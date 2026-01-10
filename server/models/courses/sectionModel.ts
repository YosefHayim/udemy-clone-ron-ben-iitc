import mongoose, { Model, Query } from "mongoose";
import Lesson from "./lessonModel.ts";
import { LessonDocument, SectionDocument } from "../../types/types.ts";

const sectionSchema = new mongoose.Schema<SectionDocument>(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Section must belong to a course."],
    },
    title: {
      type: String,
      required: [true, "A section must have a title."],
    },
    totalSectionDuration: {
      type: Number,
      default: 0,
    },
    totalSectionLessons: {
      type: Number,
      default: 0,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
);

sectionSchema.pre(/^find/, function (this: Query<any, SectionDocument>, next) {
  this.populate("lessons");
  next();
});

// Middleware to calculate and set total lessons and duration
sectionSchema.post("save", async function () {
  try {
    // Ensure TypeScript recognizes the populated lessons as an array of `LessonDocument`
    const section = await this.populate<{ lessons: LessonDocument[] }>(
      "lessons"
    );

    if (Array.isArray(section.lessons)) {
      // Calculate total duration and lessons count
      const totalDuration = section.lessons.reduce(
        (acc: number, lesson: LessonDocument) => acc + (lesson.duration || 0),
        0
      );

      // Update fields directly without triggering save recursion
      await this.updateOne({
        totalSectionDuration: totalDuration,
        totalSectionLessons: section.lessons.length,
      });
    } else {
    }
  } catch (err) {
  }
});

sectionSchema.post("save", async function () {
  const lessons = await Lesson.find({ section: this._id });
  const totalDuration = lessons.reduce(
    (sum: number, lesson: LessonDocument) => sum + lesson.duration,
    0
  );

  await this.updateOne({
    totalSectionDuration: totalDuration,
    totalSectionLessons: lessons.length,
  });
});

const Section: Model<SectionDocument> = mongoose.model(
  "Section",
  sectionSchema
);
export default Section;
