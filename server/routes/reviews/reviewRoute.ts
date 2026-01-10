import express, { NextFunction, Request, Response } from "express";
import { grantedAccess } from "../../controllers/authorization/authController.ts";
import {
  getAllReviews,
  addReviewByCourseId,
  deleteReviewById,
  updateReviewById,
  getReviewByReviewId,
  getAllReviewsByCourseId,
  getAllReviewsOfUser,
  toggleLikeByReviewId,
  toggleDislikeReaction,
  getAllReviewsCountOfAllCourses,
} from "../../controllers/reviews/reviewController.ts";

const router = express.Router();

router.param("id", (req: Request, res: Response, next: NextFunction, val) => {
  next();
});

// Get all reviews of all courses
router.get("/", getAllReviews);

// Get review by review id
router.get("/single/:id", getReviewByReviewId);

// get reviews analytics
router.get("/courses/analytics", getAllReviewsCountOfAllCourses);

// Get all reviews of specific course by its id
router.get("/course/:id", getAllReviewsByCourseId);

// Get all reviews that the current user that is auth is commented
router.get("/user/:id", getAllReviewsOfUser);

// Add review to a specific course by course id
router.post("/:id", grantedAccess, addReviewByCourseId);

// toggle like by review id
router.post("/like/:id", grantedAccess, toggleLikeByReviewId);

// toggle dislike by review id
router.post("/dislike/:id", grantedAccess, toggleDislikeReaction);

// Update a review by id and by the specific course
router.patch("/:id", grantedAccess, updateReviewById);

// Delete review by its id
router.delete("/:id", grantedAccess, deleteReviewById);

export default router;
