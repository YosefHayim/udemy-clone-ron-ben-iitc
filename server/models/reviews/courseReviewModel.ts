import mongoose, { CallbackError, Model, Query } from "mongoose";
import Course from "../courses/courseModel.ts";
import { CourseReviewDocument } from "../../types/types.ts";

const courseReviewsSchema = new mongoose.Schema<CourseReviewDocument>(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
    courseReview: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "ID of a course must be provided"],
    },
    rating: {
      type: Number,
      required: [true, "You must provide a rating between 1 and 5."],
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating cannot exceed 5."],
    },
    comment: {
      type: String,
      required: [true, "You must provide a comment."],
      minLength: [1, "Comment must be at least 1 character."],
      maxLength: [250, "Comment cannot exceed 250 characters."],
    },
    likes: {
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      count: { type: Number, default: 0 },
    },
    dislikes: {
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      count: { type: Number, default: 0 },
    },
    reports: {
      entries: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReportReview" }],
      count: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

// Middleware to validate `courseReview` before saving or creating a review
courseReviewsSchema.pre<CourseReviewDocument>("save", async function (next) {
  try {
    // Check if the courseReview ID is valid and exists
    const course = await Course.findById(this.courseReview);
    if (!course) {
      return next(new Error("Invalid course ID provided for courseReview."));
    }

    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

courseReviewsSchema.pre(
  /^find/,
  function (this: Query<any, CourseReviewDocument>, next) {
    this.populate({
      path: "user",
      select: "fullName",
    });
    next();
  }
);
// Middleware to update the course's `reviews` field after saving a review
courseReviewsSchema.post("save", async function () {
  try {
    // Add the review ID to the course's reviews array
    await Course.findByIdAndUpdate(
      (this as CourseReviewDocument).courseReview,
      {
        $addToSet: { reviews: this._id },
      }
    );
  } catch (err) {
  }
});

// Middleware to update average rating after saving a review
courseReviewsSchema.post<CourseReviewDocument>("save", async function () {
  try {
    // Ensure TypeScript recognizes `this`
    const ReviewModel = this.constructor as Model<CourseReviewDocument>;

    // Find all reviews for this course
    const ratings = await ReviewModel.find({ courseReview: this.courseReview });

    // Compute the average rating
    const average =
      ratings.reduce(
        (sum: number, review: CourseReviewDocument) => sum + review.rating,
        0
      ) / ratings.length;

    // Update the course's average rating
    await Course.findByIdAndUpdate(this.courseReview, {
      averageRating: average,
    });
  } catch (err) {
  }
});

const courseReviews: Model<CourseReviewDocument> = mongoose.model(
  "Review",
  courseReviewsSchema
);
export default courseReviews;
