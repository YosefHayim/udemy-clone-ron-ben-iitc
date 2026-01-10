import express, { NextFunction, Request, Response } from "express";
import { grantedAccess } from "../../controllers/authorization/authController.ts";
import {
  getAllReports,
  getReportById,
  getReportsByReviewId,
  createReportByReviewId,
  deleteReportById,
} from "../../controllers/reviews/reportReviewController.ts";

const router = express.Router();

router.param("id", (req: Request, res: Response, next: NextFunction, val) => {
  next();
});

router.get("/", getAllReports);
router.get("/:id", getReportById);
router.get("/:reviewId", getReportsByReviewId);
router.post("/:reviewId", grantedAccess, createReportByReviewId);
router.delete("/:id", grantedAccess, deleteReportById);

export default router;
