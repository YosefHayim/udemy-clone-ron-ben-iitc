import express, { NextFunction, Request, Response } from "express";
import {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLessonById,
  deleteLessonById,
} from "../../controllers/courses/lessonController.ts";

const router = express.Router();

router.param("id", (req: Request, res: Response, next: NextFunction, val) => {
  next();
});

// Get all lessons of all courses
router.get("/", getAllLessons);

// Get specific lesson by lesson id
router.get("/:id", getLessonById);

// Create lesson
router.post("/", createLesson);

// mark lesson as done and update last time seconds view of lesson

// Update lesson by id
router.put("/:id", updateLessonById);

// Delete lesson by id
router.delete("/:id", deleteLessonById);

export default router;
