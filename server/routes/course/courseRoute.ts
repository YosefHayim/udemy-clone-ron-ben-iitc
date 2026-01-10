import express, { NextFunction, Request, Response } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  reactivateCourseById,
  joinCourseById,
  leaveCourseById,
  joinCoursesByIds,
  getCourseProsById,
  getCourseInfoForCart,
  viewCourseById,
  updateCourseProgressById,
  getRatingStatsBySearch,
} from "../../controllers/courses/courseController.ts";
import { grantedAccess } from "../../controllers/authorization/authController.ts";

const router = express.Router();

router.param("id", (req: Request, res: Response, next: NextFunction, val) => {
  next();
});

//
// ---------- GET ROUTES ----------
//

// Ratings breakdown for search results
router.get("/ratings-stats", getRatingStatsBySearch);

// Course info for cart
router.get("/cartInfo/:id", getCourseInfoForCart);

// What you'll learn (pros)
router.get("/pros/:courseId", getCourseProsById);

// All courses (supports filtering, search, sort)
router.get("/", getAllCourses);

// View course if user bought it (separate from generic course get)
router.get("/view/:id", viewCourseById);

// Get course by ID
router.get("/:id", getCourseById);

//
// ---------- POST ROUTES ----------
//

// Create new course
router.post("/", grantedAccess, createCourse);

// Re-activate soft-deleted course
router.post("/re-activate/:id", grantedAccess, reactivateCourseById);

// Join single course
router.post("/add/:id", grantedAccess, joinCourseById);

// Join multiple courses
router.post("/multiple/courses", grantedAccess, joinCoursesByIds);

// Leave a course
router.post("/leave/:id", grantedAccess, leaveCourseById);

//
// ---------- PUT/PATCH/DELETE ROUTES ----------
//

// Update entire course
router.put("/:id", grantedAccess, updateCourse);

// Update user’s course progress
router.patch("/:id", grantedAccess, updateCourseProgressById);

// Delete course
router.delete("/:id", grantedAccess, deleteCourse);

export default router;
