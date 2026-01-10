import fs from "fs";
import path from "path";
import Course from "./models/courses/courseModel.ts";
import Coupon from "./models/courses/couponModel.ts";
import Lesson from "./models/courses/lessonModel.ts";
import Section from "./models/courses/sectionModel.ts";
import courseReviews from "./models/reviews/courseReviewModel.ts";
import Instructor from "./models/users/instructorModel.ts";
import User from "./models/users/userModel.ts";
import connectDb from "./config/connectDb.ts";

const checkAllRelationships = async () => {
  try {
    const report: string[] = [];
    const log = (msg: string) => {
      report.push(msg);
    };

    await connectDb();

    log("🔍 Starting Relationship Checks...\n");

    // Courses with missing instructor
    const coursesWithoutInstructor = await Course.find({
      courseInstructor: { $exists: true },
    }).populate("courseInstructor");
    const brokenCourses = coursesWithoutInstructor.filter(
      (c) => !c.courseInstructor
    );
    log(`🧑‍🏫 Courses missing instructor: ${brokenCourses.length}`);

    // Sections with missing course
    const sections = await Section.find().populate("course");
    const brokenSections = sections.filter((s) => !s.course);
    log(`📚 Sections missing course: ${brokenSections.length}`);

    // Lessons with missing section
    const lessons = await Lesson.find().populate("section");
    const brokenLessons = lessons.filter((l) => !l.section);
    log(`🎥 Lessons missing section: ${brokenLessons.length}`);

    // Students with broken courseBought refs
    const students = await User.find({ role: "student" });
    let brokenCourseRefs = 0;
    for (const student of students) {
      for (const bought of student.coursesBought || []) {
        const exists = await Course.exists({ _id: bought.courseId });
        if (!exists) brokenCourseRefs++;
      }
    }
    log(`🧑‍🎓 Students with broken courseBought refs: ${brokenCourseRefs}`);

    // Reviews with broken user or course
    const reviews = await courseReviews
      .find()
      .populate("user")
      .populate("courseReview");
    const brokenReviews = reviews.filter((r) => !r.user || !r.courseReview);
    log(`⭐ Reviews with broken user or course: ${brokenReviews.length}`);

    // Instructor documents with broken user ref
    const instructors = await Instructor.find().populate("userId");
    const brokenInstructors = instructors.filter((i) => !i.userId);
    log(`👨‍🏫 Instructors missing user ref: ${brokenInstructors.length}`);

    // Coupons with broken course or creator
    const coupons = await Coupon.find()
      .populate("courseId")
      .populate("createdBy");
    const brokenCoupons = coupons.filter((c) => !c.courseId || !c.createdBy);
    log(`🏷️ Coupons with broken course or creator: ${brokenCoupons.length}`);

    // Write to file
    const filePath = path.join(process.cwd(), "relation-check-report.txt");
    fs.writeFileSync(filePath, report.join("\n"), "utf-8");
    log(`\n📄 Relationship report written to: ${filePath}`);
  } catch (error) {
  }
};

await checkAllRelationships();
