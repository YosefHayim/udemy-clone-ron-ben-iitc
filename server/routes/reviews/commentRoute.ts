import express, { NextFunction, Request, Response } from "express";
import { grantedAccess } from "../../controllers/authorization/authController.ts";
import {
  getAllComments,
  addCommentByReviewId,
  getCommentsByReviewId,
  updateCommentById,
  deleteCommentById,
  getCommentById,
} from "../../controllers/reviews/commentController.ts";

const router = express.Router();

router.param("id", (req: Request, res: Response, next: NextFunction, val) => {
  next();
});

// Get a comment by its id
router.get("/:id", getCommentById);

// Get all comments
router.get("/", getAllComments);

// Get comment by a review id
router.get("/:reviewId", getCommentsByReviewId);

// Add comment by a review id
router.post("/:id", grantedAccess, addCommentByReviewId);

// updated comment by id
router.put("/:id", grantedAccess, updateCommentById);

// delete comment by id
router.delete("/:id", grantedAccess, deleteCommentById);

export default router;
