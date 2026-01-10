import { faker } from "@faker-js/faker";
import connectDb from "./config/connectDb.ts";
import User from "./models/users/userModel.ts";
import Course from "./models/courses/courseModel.ts";
import Lesson from "./models/courses/lessonModel.ts";
import Section from "./models/courses/sectionModel.ts";
import InstructorComment from "./models/reviews/instructorCommentModel.ts";
import courseReviews from "./models/reviews/courseReviewModel.ts";
import ReportReview from "./models/reviews/reportReviewModel.ts";
import courseCategories from "./utils/courseCategories.ts";
import allowedIssueTypes from "./utils/reportSubjects.ts";
import courseNames from "./utils/courseNames.ts";
import sectionNames from "./utils/sectionNames.ts";
import lessonsNames from "./utils/lessonNames.ts";
import videosToDisplay from "./utils/videosToDisplay.ts";
import supportedCountries from "./utils/supportedCountries.ts";
import algoSearch from "./utils/algoSearch.ts";
import Instructor from "./models/users/instructorModel.ts";
import CourseProgress from "./models/courses/courseProgressModel.ts";
import { InstructorDocument, LessonDocument } from "./types/types.ts";
import Coupon from "./models/courses/couponModel.ts";
import { getRandomImageFromDir } from "./utils/getRandomImageFromDir.ts";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const specificCourseTopics = [
//   {
//     Development: {
//       subCategories: "Data Science",
//       topics: [
//         "ChatGPT",
//         "Data Science",
//         "Python",
//         "Machine Learning",
//         "Deep Learning",
//         "Artificial Intelligence (AI)",
//         "Statistics",
//         "Natural Language Processing (NLP)",
//       ],
//     },
//   },
//   {
//     "IT & Software": {
//       subCategories: "IT Certifications",
//       topics: [
//         "Amazon AWS",
//         "AWS Certified Cloud Practitioner",
//         "AZ-900: Microsoft Azure Fundamentals",
//         "AWS Certified Solutions Architect - Associate",
//         "Kubernetes",
//         "AWS Certified Developer - Associate",
//         "Cisco Certified Network Associate (CCNA)",
//         "CompTIA Security+",
//       ],
//     },
//   },
//   {
//     Entrepreneurship: {
//       subCategories: "Entrepreneurship",
//       topics: [
//         "Leadership",
//         "Management Skills",
//         "Project Management",
//         "Personal Productivity",
//         "Emotional Intelligence",
//         "Digital Transformation",
//         "Business Strategy",
//         "Conflict Management",
//       ],
//     },
//   },
//   {
//     Development: {
//       subCategories: "Web Development",
//       topics: ["Typescript", "Node.Js", "Next.js"],
//     },
//   },
//   {
//     Teaching: {
//       subCategories: "Analytics & Intelligence",
//       topics: [
//         "Microsoft Excel",
//         "SQL",
//         "Microsoft Power BI",
//         "Data Analysis",
//         "Business Analysis",
//         "Tableau",
//         "Data Visualization",
//         "Data Modeling",
//       ],
//     },
//   },
//   {
//     Entrepreneurship: {
//       subCategories: "Communication",
//       topics: [
//         "Communication Skills",
//         "Presentation Skills",
//         "Public Speaking",
//         "Writing",
//         "PowerPoint",
//         "Business Communication",
//         "Business Writing",
//         "Email Writing and Etiquette",
//       ],
//     },
//   },
// ];

const clearCollections = async () => {
  await Promise.all([
    User.deleteMany(),
    CourseProgress.deleteMany(),
    Course.deleteMany(),
    Section.deleteMany(),
    Lesson.deleteMany(),
    courseReviews.deleteMany(),
    ReportReview.deleteMany(),
    Instructor.deleteMany(),
    InstructorComment.deleteMany(),
    Coupon.deleteMany(),
  ]);
};

const createUsers = async (amountOfUsers: number) => {
  const users = [];
  const generatedEmails = new Set();

  // Fetch all existing emails from the database
  const existingUsers = await User.find({}, { email: 1, _id: 0 });
  existingUsers.forEach((user) => generatedEmails.add(user.email));

  // Generate new users
  for (let i = 0; i < amountOfUsers; i++) {
    let email;

    // Ensure the email is unique (not in existing or newly generated emails)
    do {
      email = faker.internet.email().toLowerCase();
    } while (generatedEmails.has(email));

    generatedEmails.add(email);

    users.push({
      fullName: faker.person.fullName(),
      profilePic: faker.image.avatar(),
      email, // Use the unique email
      fieldLearning: faker.helpers.arrayElements(Object.keys(courseCategories)),
      role: faker.helpers.arrayElement(["student", "instructor"]),
      bio: faker.lorem.sentence(1),
      links: {
        website: `https://wwww.${faker.person.fullName()}.com`,
        xPlatform: "https://twitter.com/?mx=1",
        facebook: "https://www.facebook.com/",
        linkedin: "https://www.linkedin.com/",
        youtube: "https://www.youtube.com/",
      },
      headline: faker.person.jobTitle(),
      udemyCredits: faker.number.int({ min: 5000, max: 10000 }),
      country: faker.helpers.arrayElement(supportedCountries),
      recentSearches: faker.helpers.arrayElements(algoSearch, {
        min: 3,
        max: 6,
      }),
    });
  }

  // Insert the new users into the database
  try {
    const createdUsers = await User.insertMany(users);
    return createdUsers;
  } catch (error) {
    throw error;
  }
};

const createCourses = async ({
  coursesPerTopic = 5,
  coursesPerInstructor = 20,
} = {}) => {

  const instructors = await User.find({ role: "instructor" });
  const students = await User.find({ role: "student" });

  if (!instructors.length || !students.length) {
    throw new Error("❌ Missing instructors or students.");
  }

  // Flatten topics with category metadata
  const topicMatrix = [];
  for (const parentCategory of Object.keys(courseCategories)) {
    const subCategories = courseCategories[parentCategory].subCategories;
    for (const subCategory of Object.keys(subCategories)) {
      for (const topic of subCategories[subCategory]) {
        topicMatrix.push({ parentCategory, subCategory, topic });
      }
    }
  }

  const instructorBuckets = new Map(
    instructors.map((inst) => [inst._id.toString(), []])
  );
  let instructorIndex = 0;

  const allCourses = [];

  for (const { parentCategory, subCategory, topic } of topicMatrix) {
    for (let i = 1; i <= coursesPerTopic; i++) {
      // Find next instructor with available quota
      let instructor;
      let attempts = 0;
      while (attempts < instructors.length) {
        const candidate = instructors[instructorIndex];
        const bucket = instructorBuckets.get(candidate._id.toString()) || [];
        if (bucket.length < coursesPerInstructor) {
          instructor = candidate;
          break;
        }
        instructorIndex = (instructorIndex + 1) % instructors.length;
        attempts++;
      }

      if (!instructor) {
        console.warn("🚫 No available instructor found with remaining quota.");
        continue;
      }

      const enrolledStudents = faker.helpers.arrayElements(
        students,
        faker.number.int({ min: 7, max: 15 })
      );

      const course = await Course.create({
        courseName: faker.helpers.arrayElement(courseNames),
        courseImg: getRandomImageFromDir(
          path.join(__dirname, "public/imgs/courses")
        ),
        courseRecapInfo: faker.lorem.words(10),
        courseDescription: faker.lorem.paragraph(),
        courseFullPrice: faker.number.int({ min: 500, max: 800 }),
        courseDiscountPrice: faker.number.int({ min: 100, max: 300 }),
        whoThisCourseIsFor: faker.lorem.sentence(),
        courseInstructorDescription: faker.lorem.paragraphs(3),
        whatYouWillLearn: Array.from({ length: 8 }, () =>
          faker.lorem.sentence()
        ),
        courseRequirements: Array.from({ length: 5 }, () =>
          faker.lorem.sentence()
        ),
        category: parentCategory,
        subCategory,
        courseTopic: topic,
        courseLevel: faker.helpers.arrayElement([
          "Beginner",
          "Intermediate",
          "Advanced",
        ]),
        courseLanguages: faker.helpers.arrayElement([
          "English",
          "Spanish",
          "French",
          "German",
        ]),
        courseTag: faker.helpers.arrayElement([
          "Bestseller",
          "Highest Rated",
          "Hot and New",
          "New",
          "",
        ]),
        courseInstructor: instructor._id, // ✅ SET HERE
        courseTrailer: faker.helpers.arrayElement(videosToDisplay),
        moneyBackGuarantee: faker.date.soon(30),
        averageRating: 0,
        totalRatings: 0,
        totalStudentsEnrolled: {
          students: enrolledStudents.map((s) => s._id),
          count: enrolledStudents.length,
        },
        certificateOnly: faker.datatype.boolean(),
        isActive: true,
        totalCourseDuration: 0,
        totalCourseLessons: 0,
        sections: [],
        lessons: [],
        reviews: [],
      });

      // Track instructor usage
      instructorBuckets.get(instructor._id.toString()).push(course._id);

      // Save instructor with linked course
      instructor.coursesCreated ||= [];
      instructor.coursesCreated.push(course._id);
      await instructor.save();

      // Save student course purchases
      for (const student of enrolledStudents) {
        student.coursesBought ||= [];
        student.coursesBought.push({
          courseName: course.courseName,
          courseId: course._id,
          boughtAt: new Date(),
          coursePrice: course.courseDiscountPrice,
        });
        try {
          await student.save();
        } catch (err) {
            `⚠️ Failed to update student ${student._id}: ${err.message}`
          );
        }
      }

      allCourses.push(course);

        `📘 Created: "${course.courseName}" — Topic: "${topic}" | Sub: "${subCategory}" | Cat: "${parentCategory}" | 👨‍🏫 ${instructor.fullName}`
      );
    }
  }

  return allCourses;
};

const createSections = async () => {
  const courses = await Course.find();
  if (courses.length === 0) {
    throw new Error("No courses found for section creation.");
  }

  const sections = [];

  for (const course of courses) {
    const numSections = faker.number.int({ min: 4, max: 7 }); // Random number of sections per course
    const createdSections = [];

    for (let i = 0; i < numSections; i++) {
        `Creating section ${i + 1}/${numSections} for course "${
          course.courseName
        }"...`
      );

      try {
        const section = await Section.create({
          course: course._id,
          title: faker.helpers.arrayElement(sectionNames),
          totalSectionDuration: 0,
          totalSectionLessons: 0,
          lessons: [],
        });

        // Keep track of created sections for this course
        createdSections.push(section._id);
        sections.push(section);
      } catch (err) {
          `Error creating section ${i + 1} for ${course.courseName}:`,
          err
        );
      }
    }

    // Update the course with created sections
    if (createdSections.length > 0) {
      course.sections.push(...createdSections);
      await course.save();
        `Updated course "${course.courseName}" with ${createdSections.length} sections.`
      );
    }
  }

  return sections;
};

const createLessons = async () => {
  const sections = await Section.find().populate("course");

  if (sections.length === 0) {
    throw new Error("No sections found for lesson creation.");
  }

  const lessons = [];

  for (const section of sections) {
    if (!section.course || !section.course._id) {
      console.warn(
        `Skipping section "${section.title}" due to missing course reference.`
      );
      continue; // Skip this section
    }


    const totalLessonsPerSection = faker.number.int({ min: 3, max: 8 }); // Randomize number of lessons
    const createdLessons = [];
    let totalDurationForSection = 0;

    for (let i = 0; i < totalLessonsPerSection; i++) {
      const duration = faker.number.int({ min: 5, max: 10 });

      try {
        const lesson: LessonDocument = await Lesson.create({
          section: section._id,
          title: faker.helpers.arrayElement(lessonsNames),
          videoUrl: faker.helpers.arrayElement(videosToDisplay),
          duration,
          order: section.lessons.length + createdLessons.length + 1, // Ensure unique order
        });

        createdLessons.push(lesson._id);
        lessons.push(lesson);
        totalDurationForSection += duration;

          `Lesson created: ${lesson.title}, Order: ${
            section.lessons.length + createdLessons.length
          }, Duration: ${duration} mins`
        );
      } catch (err) {
      }
    }

    // Update the section with created lessons
    section.lessons.push(...createdLessons);
    section.totalSectionDuration += totalDurationForSection;
    section.totalSectionLessons += createdLessons.length;
    await section.save();

    // Update the course linked to the section
    try {
      const course = await Course.findById(section.course._id);
      if (course) {
        course.totalCourseDuration += totalDurationForSection;
        course.totalCourseLessons += createdLessons.length;
        await course.save();
      } else {
        console.warn(
          `No course found for section "${section.title}". Skipping course update.`
        );
      }
    } catch (err) {
        `Error updating course for section "${section.title}": ${err}`
      );
    }

      `Updated section "${section.title}" with ${createdLessons.length} lessons.`
    );
  }

  return lessons;
};

const createReviews = async () => {
  try {

    const students = await User.find({
      role: "student",
      "coursesBought.courseId": { $exists: true, $type: "objectId" }, // Ensure valid ObjectId
    }).populate({
      path: "coursesBought.courseId", // Ensure proper population
      model: "Course",
      select: "_id courseName",
    });


    if (!students.length) {
      return;
    }

    for (const student of students) {
      if (!student.coursesBought || student.coursesBought.length === 0) {
          `No valid courses found for student ${student.email}. Skipping...`
        );
        continue;
      }

      for (const courseEntry of student.coursesBought) {
        const course = courseEntry.courseId; // Fix: Access the populated course object

        if (!course || !course._id) {
            `Invalid course reference for student "${student.email}". Skipping...`
          );
          continue;
        }

        const reviewPayload = {
          user: student._id,
          courseReview: course._id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
        };

        try {
          const review = await courseReviews.create(reviewPayload);
          if (!review) {
            continue;
          }

          const updatedCourse = await Course.findByIdAndUpdate(
            course._id,
            {
              $push: { reviews: review._id },
              $inc: { totalRatings: 1 },
              $set: {
                averageRating: await calculateAverageRating(course._id),
              },
            },
            { new: true }
          );

          if (!updatedCourse) {
              `Course with ID ${course._id} not found while updating.`
            );
          } else {
              `Review added to course "${updatedCourse.courseName}" successfully.`
            );
          }
        } catch (err) {
            `Error creating or updating review for course "${course.courseName}": ${err.message}`
          );
        }
      }
    }

  } catch (err: unknown) {
    throw err;
  }
};

// Helper function to calculate average rating
const calculateAverageRating = async (courseId: string) => {
  try {
    const allRatings = await courseReviews.find({ courseReview: courseId });
    if (!allRatings.length) return 0;
    return allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
  } catch (err) {
      `Error calculating average rating for course ${courseId}: ${err}`
    );
    return 0;
  }
};

const createReportedReviews = async () => {

  const reviews = await courseReviews.find().populate({
    path: "courseReview",
    select: "_id courseName",
  });

  const students = await User.find({ role: "student" });

  if (!reviews || reviews.length === 0) {
    throw new Error("No reviews found for reporting.");
  }

  if (!students || students.length === 0) {
    throw new Error("No students found for reporting.");
  }

  const totalReports = 100;

  for (let i = 0; i < totalReports; i++) {

    // Filter reviews where the student has purchased the course
    const eligibleReviews = reviews.filter((review) =>
      students.some((student) =>
        student.coursesBought.some(
          (course) => course.courseId === review.courseReview._id.toString()
        )
      )
    );

    if (eligibleReviews.length === 0) {
      continue;
    }

    const randomReview = faker.helpers.arrayElement(eligibleReviews);
    if (!randomReview || !randomReview.courseReview) {
      continue;
    }

    const randomStudent = students.find((student) =>
      student.coursesBought.some(
        (course) => course.courseId === randomReview.courseReview._id.toString()
      )
    );

    if (!randomStudent) {
        `No student found who bought the course "${randomReview.courseReview.courseName}".`
      );
      continue;
    }

    const randomIssueType = faker.helpers.arrayElement(allowedIssueTypes);

    try {
      const report = await ReportReview.create({
        user: randomStudent._id,
        review: randomReview._id,
        issueType: randomIssueType,
        issueDetails: faker.lorem.sentence(),
      });

      randomReview.reports = randomReview.reports || { count: 0, entries: [] };
      randomReview.reports.entries.push(report._id);
      randomReview.reports.count += 1;
      await randomReview.save();

        `Report ${i + 1} created for Review:`,
        randomReview.comment,
        `Reported by:`,
        randomStudent.email,
        `Issue Type:`,
        randomIssueType
      );
    } catch (err) {
    }
  }

};

const simulateCoursePurchases = async () => {
  const users = await User.find({
    role: "student",
    udemyCredits: { $gte: 10 },
  });
  const courses = await Course.find({ isActive: true }).populate({
    path: "sections",
    populate: { path: "lessons", select: "_id duration" },
  });

  if (!users.length || !courses.length) {
    throw new Error("No users or courses available for simulation.");
  }

  for (const user of users) {
    try {
      const coursesToPurchase = faker.helpers.arrayElements(
        courses,
        faker.number.int({ min: 3, max: 5 })
      );

      for (const course of coursesToPurchase) {
        if (
          !user.coursesBought.some(
            (bought) => bought.course && bought.course.equals(course._id)
          )
        ) {
          const discountPrice = parseFloat(course.courseDiscountPrice);
          if (user.udemyCredits >= discountPrice) {
            user.coursesBought.push({
              courseName: course.courseName,
              courseId: course._id,
              boughtAt: new Date(),
              coursePrice: course.courseDiscountPrice,
            });
            user.udemyCredits -= discountPrice;

            // Update course enrollment
            course.totalStudentsEnrolled.count += 1;
            course.totalStudentsEnrolled.students.push(user._id);

            await course.save();
          } else {
              `${user.fullName} does not have enough credits for "${course.courseName}".`
            );
          }
        }
      }

      await user.save();
    } catch (err) {
    }
  }

};

const addCoursesToWishlistOfUsers = async () => {
  const users = await User.find({ role: "student" });
  const courses = await Course.find();

  if (!users.length) {
    console.warn("No users found to update with wishlist.");
    return;
  }
  if (!courses.length) {
    console.warn("No courses available to add to wishlist.");
    return;
  }

  for (const user of users) {
    // Randomly select 1 to 5 courses for the wishlist
    const wishlistCourses = faker.helpers.arrayElements(
      courses.map((course) => course._id),
      faker.number.int({ min: 1, max: 5 })
    );

    // Update the user's wishlist
    user.wishlistCourses = wishlistCourses;
    await user.save();
  }

};

const createInstructorProfiles = async () => {

  // Find all users with role: instructor
  const instructors = await User.find({ role: "instructor" });

  if (!instructors.length) {
    return;
  }

  for (const instructor of instructors) {
    // Find courses created by this instructor
    const courses = await Course.find({ courseInstructor: instructor._id });

    if (!courses.length) {
      console.warn(`No courses found for instructor: ${instructor.fullName}`);
      continue; // Skip if no courses are assigned to this instructor
    }

    // Calculate total students from all courses
    const totalStudents = courses.reduce(
      (acc, course) => acc + (course.totalStudentsEnrolled.count || 0),
      0
    );

    // Calculate total reviews from all courses
    const totalReviews = courses.reduce(
      (acc, course) => acc + (course.totalRatings || 0),
      0
    );

    // Create Instructor document
    const instructorProfile: InstructorDocument = await Instructor.create({
      userId: instructor._id,
      coursesRelatedIds: courses.map((course) => course._id),
      backgroundOfInstructor: faker.lorem.paragraphs(10),
      avgRatingInstructor: faker.number.float({
        min: 3,
        max: 5,
      }),
      totalStudents: totalStudents,
      totalCourses: courses.length,
      totalReviews: totalReviews,
    });

  }

};

const generateCouponsForCourses = async () => {

  try {
    // Get all active courses with their instructors
    const courses = await Course.find({ isActive: true }).populate({
      path: "courseInstructor",
      select: "_id fullName", // Select specific fields
    });


    if (!courses.length) {
      return;
    }

    const coupons = [];

    for (const course of courses) {
      if (!course.courseInstructor || !course.courseInstructor._id) {
        console.warn(
          `Skipping course ${course.courseName} because it has no instructor.`
        );
        continue;
      }

      const numCoupons = faker.number.int({ min: 2, max: 4 });

      for (let i = 0; i < numCoupons; i++) {

        const isPercentage = faker.datatype.boolean();
        const discountPercentage = isPercentage
          ? faker.number.int({ min: 10, max: 75 })
          : 0;
        const discountPrice = !isPercentage
          ? faker.number.int({ min: 50, max: 200 })
          : 0;

        const coupon = {
          courseId: course._id,
          couponCode: `${course.courseName
            .substring(0, 3)
            .toUpperCase()}${faker.string.alphanumeric(5).toUpperCase()}`,
          discountPrice,
          discountPercentage,
          couponType: isPercentage ? "percentage" : "fixed",
          isActive: true,
          validFrom: new Date(),
          expirationDate: faker.date.future({ years: 1 }),
          maxUses: faker.number.int({ min: 50, max: 200 }),
          usedCount: 0,
          createdBy: course.courseInstructor._id, // Ensure it's an ObjectId
          description: faker.lorem.sentence(),
          minimumPurchaseAmount: faker.number.int({ min: 100, max: 300 }),
          restrictions: {
            oneTimePerUser: faker.datatype.boolean(),
            newStudentsOnly: faker.datatype.boolean(),
            specificCategories: [course.category],
          },
          appliedTo: {
            courses: [course._id],
            categories: [course.category],
            bundleOnly: false,
          },
        };
        coupons.push(coupon);
      }
    }

    // Insert all coupons
    const createdCoupons = await Coupon.insertMany(coupons);
      `Successfully created ${createdCoupons.length} coupons for ${courses.length} courses.`
    );
  } catch (error) {
    console.error("Error generating coupons:", error);
  }
};

const generateUpdatedDummyData = async () => {
  try {
    await connectDb();
    await clearCollections();

    const users = await createUsers(10000);

    const courses = await createCourses({
      coursesPerTopic: 15,
      coursesPerInstructor: 10,
    });

    if (courses && courses.length > 1) {
    }

    await createInstructorProfiles();

    const sections = await createSections();

    const lessons = await createLessons();

    await simulateCoursePurchases();

    await createReviews();

    await createReportedReviews();

    await addCoursesToWishlistOfUsers();

    await generateCouponsForCourses();

    process.exit();
  } catch (err) {
    process.exit(1);
  }
};

generateUpdatedDummyData();
