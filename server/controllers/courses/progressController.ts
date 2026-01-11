import User from "../../models/users/userModel.ts";
import Course from "../../models/courses/courseModel.ts";
import CourseProgress from "././../../models/courses/courseProgressModel.ts";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { LessonProgressDocument } from "../../types/types.ts";

/**
 * Initialize progress for a user when they start a course.
 */
const initializeProgress = async (req: Request, res: Response) => {
  try {
    // Extract IDs from the request
    const courseId = req.params.id; // courseId comes as a string from URL params
    const userId = req.user?._id; // userId should already be an ObjectId


    // Validate that courseId and userId are valid ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: "Invalid user ID or course ID" });
    }

    // Convert courseId to ObjectId
    const courseObjectId = new mongoose.Types.ObjectId(courseId); // Ensure ObjectId type
    const userObjectId = userId; // userId is already an ObjectId

    // Check if the course and user exist
    const userExists = await User.findById(userObjectId);
    const courseExists = await Course.findById(courseObjectId).populate({
      path: "sections",
      populate: {
        path: "lessons",
      },
    });

    if (!userExists || !courseExists) {
      return res.status(404).json({ error: "User or course not found" });
    }

    // Check for existing progress
    const existingProgress = await CourseProgress.findOne({
      userId: userObjectId,
      courseId: courseObjectId,
    });

    if (existingProgress) {
      return res.status(400).json({
        error: "Progress already initialized for this course and user",
      });
    }

    // Prepare sections for progress
    const sections = courseExists.sections.map((section) => ({
      sectionId: section._id,
      lessons: section.lessons.map((lesson) => ({
        lessonId: lesson,
        completed: false,
        lastWatched: 0,
      })),
    }));

    // Create the new progress record
    const progress = new CourseProgress({
      userId: userObjectId,
      courseId: courseObjectId,
      sections,
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to initialize progress", details: err });
  }
};
/**
 * Update progress for a specific lesson.
 */
const updateLessonProgress = async (req: Request, res: Response) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user._id;
  const { completed, lastWatched } = req.body;

  try {
    const progress = await CourseProgress.findOne({
      userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    let lessonUpdated = false;

    // Update the progress for the specific lesson
    for (const section of progress.sections) {
      for (const lesson of section.lessons) {
        if (lesson.lessonId.toString() === lessonId.toString()) {
          if (completed !== undefined) lesson.completed = completed;
          if (lastWatched !== undefined) lesson.lastWatched = lastWatched;
          lessonUpdated = true;
        }
      }
    }

    if (!lessonUpdated) {
      return res
        .status(404)
        .json({ message: "Lesson not found in progress data" });
    }

    await progress.save();
    res.status(200).json({ message: "Lesson progress updated", progress });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update progress",
      details: (err as Error).message,
    });
  }
};

/**
 * Retrieve progress for a specific course and user.
 */
const getCourseProgress = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    // Find progress for the user and course
    const progress = await CourseProgress.findOne({ userId, courseId })
      .lean()
      .populate({
        path: "sections.sectionId", // Populate section information
        select: "title course totalSectionDuration totalSectionLessons", // Select required fields
      })
      .populate({
        path: "sections.lessons.lessonId", // Populate lesson information
        select:
          "title videoUrl duration order resources createdAt updatedAt completed", // Select required fields
      });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    // Initialize total lessons and completed lessons counters
    let totalLessons = 0;
    let completedLessons = 0;

    // Add stats for each section
    const sectionsWithStats = progress.sections.map(
      (section: any, index: number) => {
        let sectionTotalLessons = 0;
        let sectionCompletedLessons = 0;

        // Calculate lessons for each section
        section.lessons.forEach(
          (lesson: LessonProgressDocument, lessonIndex: number) => {
            sectionTotalLessons++; // Count all lessons in the section
            if (lesson.completed) {
              sectionCompletedLessons++; // Count completed lessons in the section
            }
          }
        );

        // Accumulate to the total lessons and completed lessons
        totalLessons += sectionTotalLessons;
        completedLessons += sectionCompletedLessons;

        // Add the stats to the section
        return {
          ...section,
          totalLessonsInSection: sectionTotalLessons,
          completedLessonsInSection: sectionCompletedLessons,
        };
      }
    );

    // Calculate percentage of completion for the whole course
    const percentageCompleted =
      totalLessons > 0 ? completedLessons / totalLessons : 0;

    // Add the calculated stats to the response
    const response = {
      progress: { ...progress, sections: sectionsWithStats },
      totalLessons,
      completedLessons,
      percentageCompleted, // Returns as a float (e.g., 0.25 for 25%)
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve progress",
      details: (err as Error).message,
    });
  }
};

const addNote = async (req: Request, res: Response) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user._id;
  const { seconds, text } = req.body;

  try {
    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const section = progress.sections.find((sec) =>
      sec.lessons.some((lesson) => lesson.lessonId.toString() === lessonId)
    );

    if (!section) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const lesson = section.lessons.find(
      (lesson) => lesson.lessonId.toString() === lessonId
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found in section" });
    }

    const newNote = {
      _id: uuidv4(),
      seconds,
      text,
    };

    lesson.notes.push(newNote);
    await progress.save();

    res.status(201).json({ message: "Note added successfully", note: newNote });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add note", details: (err as Error).message });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  const { courseId, lessonId, noteId } = req.params;
  const userId = req.user._id;

  try {
    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const section = progress.sections.find((sec) =>
      sec.lessons.some((lesson) => lesson.lessonId.toString() === lessonId)
    );

    if (!section) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const lesson = section.lessons.find(
      (lesson) => lesson.lessonId.toString() === lessonId
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found in section" });
    }

    const noteIndex = lesson.notes.findIndex((note) => note._id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    lesson.notes.splice(noteIndex, 1);
    await progress.save();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete note",
      details: (err as Error).message,
    });
  }
};

const getAllNotes = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    // Find progress with populated lesson and section data
    const progress = await CourseProgress.findOne({ userId, courseId })
      .populate({
        path: "sections.sectionId", // Populate section details
        select: "title", // Include section title
      })
      .populate({
        path: "sections.lessons.lessonId", // Populate lesson details
        select: "title", // Include lesson title
      });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    // Flatten all lessons across sections and calculate lessonIndex
    const flattenedLessons = progress.sections.flatMap(
      (section, sectionIndex) =>
        section.lessons.map((lesson, lessonIndex) => ({
          lesson,
          lessonIndex,
          sectionIndex,
          sectionTitle: (section.sectionId as any).title,
          lessonTitle: (lesson.lessonId as any).title,
        }))
    );

    // Collect all notes with additional details
    const notes = flattenedLessons.flatMap(
      ({ lesson, lessonIndex, sectionIndex, sectionTitle, lessonTitle }) =>
        lesson.notes.map((note) => ({
          noteId: note._id,
          seconds: note.seconds,
          text: note.text,
          lessonId: lesson.lessonId._id,
          lessonTitle,
          lessonIndex,
          sectionIndex,
          sectionTitle,
        }))
    );

    res.status(200).json({ notes });
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve notes",
      details: (err as Error).message,
    });
  }
};

const editNote = async (req: Request, res: Response) => {
  const { courseId, lessonId, noteId } = req.params;
  const userId = req.user._id;
  const { text, seconds } = req.body;

  try {
    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const section = progress.sections.find((sec) =>
      sec.lessons.some((lesson) => lesson.lessonId.toString() === lessonId)
    );

    if (!section) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const lesson = section.lessons.find(
      (lesson) => lesson.lessonId.toString() === lessonId
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found in section" });
    }

    const note = lesson.notes.find((note) => note._id === noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update note fields
    if (text !== undefined) note.text = text;
    if (seconds !== undefined) note.seconds = seconds;

    await progress.save();

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update note",
      details: (err as Error).message,
    });
  }
};

export {
  addNote,
  getCourseProgress,
  editNote,
  initializeProgress,
  updateLessonProgress,
  getAllNotes,
  deleteNote,
};
