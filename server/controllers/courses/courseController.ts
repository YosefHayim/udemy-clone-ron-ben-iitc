import Course from "../../models/courses/courseModel.ts";
import User from "../../models/users/userModel.ts";
import APIFeatures from "../../utils/apiFeatures.ts";
import catchAsync from "../../utils/wrapperFn.ts";
import createError from "../../utils/errorFn.ts";
import { NextFunction, Request, Response } from "express";
import courseProgress from "../../models/courses/courseProgressModel.ts";
import { courseBought } from "../../types/types.ts";
import mongoose, { PipelineStage } from "mongoose";

const getAllCourses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Step 1: Build base query with filters + search (exclude pagination for count)

    const featuresForCount = new APIFeatures(Course.find(), req.query)
      .filter()
      .search();

    const filteredQuery = featuresForCount.getQuery();
    const totalCourses = await filteredQuery.clone().countDocuments();

    // Step 2: Now apply full features including pagination
    const features = new APIFeatures(Course.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate(totalCourses);

    const courses = await features.getQuery();

    if (!courses.length) {
      return next(
        createError("No Course documents found matching your criteria.", 404)
      );
    }

    // Pagination metadata
    const currentPage = req.query.page
      ? parseInt(req.query.page as string, 10)
      : 1;
    const resultsPerPage = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;
    const totalPassed = (currentPage - 1) * resultsPerPage;
    const totalLeftCourses = Math.max(totalCourses - totalPassed, 0);
    const totalPages = Math.ceil(totalCourses / resultsPerPage);

    res.status(200).json({
      status: "Success",
      totalCourses,
      totalLeftCourses,
      currentPage,
      totalPages,
      currentPageCoursesAmount: courses.length,
      response: courses,
    });
  }
);

const getRatingStatsBySearch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = req.query.search as string;


    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.trim() === ""
    ) {
      return next(
        createError(
          "Please provide a valid search term in the query string.",
          400
        )
      );
    }

    const ratingPipeline: PipelineStage[] = [
      {
        $match: {
          courseName: { $regex: searchTerm, $options: "i" },
          averageRating: { $in: [3, 3.5, 4, 4.5] },
        },
      },
      {
        $group: {
          _id: "$averageRating",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          rating: "$_id",
          count: 1,
        },
      },
      {
        $sort: { rating: -1 as 1 | -1 }, // 👈 Fix is here
      },
    ];

    const ratingStats = await Course.aggregate(ratingPipeline);

    res.status(200).json({
      status: "success",
      searchTerm,
      ratingBreakdown: ratingStats || [],
    });
  }
);

const getCourseById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    if (!courseId) {
      return next(createError("Please provide the course ID in the URL.", 400));
    }

    const findCourse = await Course.findOne({ _id: courseId });

    if (!findCourse) {
      return next(createError("There is no such course in the database.", 404));
    }

    res.status(200).json({
      status: "success",
      totalReviewsCourseHas: findCourse.reviews.length,
      data: findCourse,
    });
  }
);

const joinCourseById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const user = req.user;

      if (!user) return next(createError("User authentication required", 401));
      if (!mongoose.Types.ObjectId.isValid(courseId))
        return next(createError("Invalid course ID", 400));

      const course = await Course.findById(courseId);
      if (!course)
        return next(createError(`No course found: ${courseId}`, 404));

      if (!Array.isArray(user.coursesBought)) user.coursesBought = [];

      if (user.coursesCreated.includes(courseId))
        return next(createError("You cannot join your own course.", 403));

      if (
        user.coursesBought.some((bought: courseBought) =>
          bought.courseId ? bought.courseId.toString() === courseId : false
        )
      ) {
        return next(createError("You have already joined this course.", 400));
      }

      const existingProgress = await courseProgress.findOne({
        userId: user._id,
        courseId: courseId,
      });

      if (existingProgress)
        return next(
          createError("You already have progress for this course.", 400)
        );

      if (!course.totalStudentsEnrolled) {
        course.totalStudentsEnrolled = { students: [], count: 0 };
      }
      if (!Array.isArray(course.totalStudentsEnrolled.students)) {
        course.totalStudentsEnrolled.students = [];
      }
      course.totalStudentsEnrolled.students.push(user._id);
      await course.save();

      user.coursesBought.push({
        courseName: course.courseName,
        courseId: courseId,
        coursePrice: course.courseDiscountPrice,
        boughtAt: new Date(),
      });

      if (typeof user.udemyCredits !== "number") {
        return next(createError("User credits not initialized properly", 500));
      }

      user.udemyCredits -= course.courseDiscountPrice;
      await user.save();

      res.status(201).json({
        status: "success",
        message: `Successfully joined ${course.courseName}`,
      });
    } catch (error) {
      return next(createError("An unexpected error occurred.", 500));
    }
  }
);

const joinCoursesByIds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let courseIds = req.body.courses;

    const user = req.user;

    if (!courseIds || !Array.isArray(courseIds)) {
      return next(createError("Please provide an array of course IDs.", 400));
    }

    courseIds = courseIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (courseIds.length === 0) {
      return next(createError("No valid course IDs provided.", 400));
    }

    const courses = await Course.find({ _id: { $in: courseIds } });
    const validCourseIds = courses.map((course) => course._id.toString());

    const existingProgress = await courseProgress.find({
      userId: user._id,
      courseId: { $in: validCourseIds },
    });

    const existingIds = existingProgress.map((prog) =>
      prog.courseId.toString()
    );
    const newCourseIds = validCourseIds.filter(
      (id) => !existingIds.includes(id)
    );

    if (newCourseIds.length === 0) {
      return next(
        createError("You have already joined all the provided courses.", 400)
      );
    }

    const purchasedCourses = newCourseIds.map((courseId) => {
      const course = courses.find((c) => c._id.toString() === courseId);
      return {
        courseName: course?.courseName,
        courseId: courseId,
        coursePrice: course?.courseDiscountPrice,
        boughtAt: new Date(),
      };
    });

    user.coursesBought.push(...purchasedCourses);

    const initCoursesProgress = await Promise.all(
      newCourseIds.map((courseId) =>
        courseProgress.create({
          userId: user._id,
          courseId: courseId,
        })
      )
    );

    await user.save();

    res.status(201).json({
      status: "success",
      message: `Successfully joined courses: ${newCourseIds.join(", ")}`,
      coursesJoined: initCoursesProgress,
    });
  }
);

const leaveCourseById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const user = req.user;

    if (!courseId) {
      return next(createError("Please provide a course ID in the URL.", 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(
        createError(`No course exists with this ID: ${courseId}`, 404)
      );
    }

    const isEnrolled = user.coursesBought.some(
      (course: courseBought) =>
        course.courseId.toString() === courseId.toString()
    );

    if (!isEnrolled) {
      return next(createError("You are not enrolled in this course.", 400));
    }

    if (user.coursesCreated.includes(courseId)) {
      return next(
        createError(
          "You cannot leave your own course. Please use another route to deactivate it.",
          403
        )
      );
    }

    // Remove user from course enrollment
    if (!course.totalStudentsEnrolled) {
      course.totalStudentsEnrolled = { students: [], count: 0 };
    }
    course.totalStudentsEnrolled.students =
      course.totalStudentsEnrolled.students.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== user._id.toString()
      );
    await course.save(); // `post('save')` will update the count automatically

    // Remove course from user's purchased courses
    user.coursesBought = user.coursesBought.filter(
      (id: string) => id.toString() !== courseId.toString()
    );
    await user.save();

    res.status(200).json({
      status: "success",
      response: `You have successfully left the course ${course.courseName}`,
    });
  }
);

const updateCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    if (!courseId) {
      return next(createError("Please provide the course ID in the URL.", 400));
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return next(createError("Error occurred during course update.", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  }
);

const createCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      courseName,
      courseDescription,
      coursePrice,
      courseImg,
      category,
      subCategory,
      courseTopic,
      courseLevel,
      courseLanguages,
      moneyBackGuarantee,
    } = req.body;

    if (
      !courseImg ||
      !courseName ||
      !courseDescription ||
      !coursePrice ||
      !category ||
      !subCategory ||
      !courseTopic ||
      !courseLevel ||
      !courseLanguages
    ) {
      return next(
        createError(
          "One of the required fields for creating course is missing.",
          400
        )
      );
    }

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      coursePrice,
      category,
      courseImg,
      subCategory,
      courseTopic,
      courseLevel,
      courseLanguages,
      courseInstructor: req.user._id,
      moneyBackGuarantee,
    });

    if (!newCourse) {
      return next(createError("Error occurred during course creation.", 500));
    }

    req.user.role = "instructor";
    req.user.coursesCreated.push(newCourse._id);
    await req.user.save();

    res.status(201).json({
      status: "success",
      message: `Course has successfully been created and assigned to user: ${req.user.fName}`,
      newCourse,
    });
  }
);

const deleteCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    if (!courseId) {
      return next(createError("Please provide the course ID in the URL.", 400));
    }

    const course = await Course.findById({ _id: courseId });

    if (!course) {
      return next(createError("Course not found.", 404));
    }

    const students = await User.find({
      role: "student",
      "coursesBought.courseId": courseId,
    });

    await Promise.all(
      students.map(async (student) => {
        student.coursesBought = student.coursesBought.filter(
          (boughtCourseId) => boughtCourseId !== courseId
        );
        await student.save();
      })
    );

    course.isActive = false;
    await course.save();

    res.status(200).json({
      status: "success",
      message: "Course deleted successfully, and enrolled students updated.",
      studentsUpdated: students,
    });
  }
);

const reactivateCourseById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const user = req.user._id;

    if (!courseId) {
      return next(
        createError(
          "Please provide a course ID in the URL to re-activate it.",
          400
        )
      );
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(
        createError(
          `There is no de-activated course with ID: ${courseId}.`,
          404
        )
      );
    }

    if (course.courseInstructor.toString() !== user.toString()) {
      return next(
        createError("You can't re-activate a course you didn't create.", 403)
      );
    }

    course.isActive = true;
    await course.save();

    res.status(201).json({
      status: "success",
      response: "Course has been successfully re-activated.",
      course,
    });
  }
);

const getCourseProsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId;

    if (!courseId) {
      return next(createError("Please provide the course ID in the URL.", 400));
    }

    const findCourse = await Course.findOne({ _id: courseId });

    if (!findCourse) {
      return next(createError("There is no such course in the database.", 404));
    }

    res.status(200).json({
      status: "success",
      data: findCourse.whatYouWillLearn,
    });
  }
);

const getCourseInfoForCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    if (!courseId) {
      return next(createError("Please provide the course ID in the URL.", 400));
    }

    const findCourse = await Course.findOne({ _id: courseId }).select(
      "courseFullPrice courseImg courseName courseInstructor averageRating courseDiscountPrice totalRatings totalCourseDuration totalCourseLessons totalCourseSections"
    );

    if (!findCourse) {
      return next(createError("There is no such course in the database.", 404));
    }

    res.status(200).json({
      status: "success",
      data: findCourse,
    });
  }
);

const viewCourseById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId;

    if (!courseId) {
      return next(createError("Please provide the course ID in the URL.", 400));
    }

    const findCourse = await Course.findOne({ _id: courseId });

    if (!findCourse) {
      return next(createError("There is no such course in the database.", 404));
    }

    res.status(200).json({
      status: "success",
      permission: "You are eligible to watch the course content",
      totalReviewsCourseHas: findCourse.reviews.length,
      data: findCourse,
    });
  }
);

const updateCourseProgressById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: courseId } = req.params;
    const { lessonId, isDone, lastPlayedVideoTime } = req.body;

    if (!courseId) {
      return next(createError("Please provide the course ID in the URL.", 400));
    }

    if (
      !lessonId ||
      typeof isDone !== "boolean" ||
      typeof lastPlayedVideoTime !== "number"
    ) {
      return next(
        createError(
          "Invalid input: lessonId must be provided, isDone must be a boolean, and lastPlayedVideoTime must be a number.",
          400
        )
      );
    }

    if (!req.user || !req.user.coursesBought) {
      return next(createError("User data or courses bought not found.", 400));
    }

    // Convert courseId to string and check if the user has bought the course
    if (
      !req.user.coursesBought.some(
        (course: any) => course.courseId.toString() === courseId
      )
    ) {
      return next(
        createError(
          "This course is not included in the courses you bought.",
          400
        )
      );
    }

    // Find the course progress for the specified courseId
    const courseProgress = req.user.coursesProgress.find(
      (progress: any) => progress.course.toString() === courseId
    );

    if (!courseProgress) {
      return next(
        createError("This course progress was not found for the user.", 400)
      );
    }

    // Find the lesson progress for the specified lessonId
    const lessonProgress = courseProgress.lessons.find(
      (lesson: any) => lesson.lesson.toString() === lessonId
    );

    if (!lessonProgress) {
      return next(
        createError(
          "This lesson progress was not found in the course progress.",
          400
        )
      );
    }

    // Update the lesson progress
    if (isDone !== undefined) lessonProgress.isDone = isDone;
    if (lastPlayedVideoTime !== undefined) {
      lessonProgress.lastPlayedVideoTime = lastPlayedVideoTime;
    }

    // Save the updated user data
    await req.user.save();

    res.status(200).json({
      status: "success",
      message: "Lesson progress updated successfully",
      data: { courseId, lessonId, isDone, lastPlayedVideoTime },
    });
  }
);

export {
  updateCourseProgressById,
  viewCourseById,
  getCourseProsById,
  joinCourseById,
  leaveCourseById,
  joinCoursesByIds,
  getCourseInfoForCart,
  reactivateCourseById,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getRatingStatsBySearch,
};
