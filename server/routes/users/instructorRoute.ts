import express, { NextFunction, Request, Response } from "express";
import {
  getInstructorById,
  getThreeCoursesOfInstructor,
} from "../../controllers/users/instructorController.ts";

const router = express.Router();

router.param("id", (req: Request, res: Response, next: NextFunction, val) => {
  next();
});

// get 3 course ids of the instructor by id
router.get("/:id/three/courses", getThreeCoursesOfInstructor);

// get information about the instructor by id
router.get("/:id", getInstructorById);

export default router;
