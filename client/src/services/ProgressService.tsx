import { axiosClient, baseUrl, isProduction, localhostUrl } from "../api/configuration";

// Define response types
type CourseProgressResponse = {
  totalLessons: number;
  completedLessons: number;
  percentageCompleted: number;
};

type FetchProgressFn = (courseId: string) => Promise<CourseProgressResponse>;
type UpdateLessonProgressFn = (
  courseId: string,
  lessonId: string,
  payload: {
    completed?: boolean;
    lastWatched?: number;
  }
) => Promise<void>;
type InitializeProgressFn = (courseId: string) => Promise<void>;

/**
 * Fetch progress for a specific course by course ID.
 */
const fetchCourseProgress: FetchProgressFn = async (courseId) => {
  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const url = `${isProduction ? baseUrl : localhostUrl}/api/course-progress/${courseId.trim()}`;

  try {
    const response = await axiosClient.get<CourseProgressResponse>(url);

    // Validate response structure
    if (
      response?.data &&
      typeof response.data.totalLessons === "number" &&
      typeof response.data.completedLessons === "number" &&
      typeof response.data.percentageCompleted === "number"
    ) {
      return response.data;
    }

    console.warn("Unexpected response structure:", response?.data);
    throw new Error("Invalid response format.");
  } catch (error) {
    throw error;
  }
};

/**
 * Update progress for a specific lesson in a course.
 */
const updateLessonProgress: UpdateLessonProgressFn = async (courseId, lessonId, payload) => {
  if (!courseId || !lessonId) {
    throw new Error("Course ID and Lesson ID are required.");
  }

  const url = `${isProduction ? baseUrl : localhostUrl}/api/course-progress/${courseId.trim()}/lessons/${lessonId.trim()}`;

  try {
    const response = await axiosClient.patch(url, payload);

    if (!response?.data) {
      console.warn("No data returned from updating lesson progress.");
      throw new Error("Failed to update lesson progress.");
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Failed to update progress for course ID ${courseId} and lesson ID ${lessonId}`
    );
  }
};

/**
 * Initialize progress for a course by course ID.
 */
const initializeCourseProgress: InitializeProgressFn = async (courseId) => {
  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const url = `${isProduction ? baseUrl : localhostUrl}/api/course-progress/initialize/${courseId.trim()}`;

  try {
    const response = await axiosClient.post(url);

    if (response?.data) {
      console.warn("No data returned from initializing course progress.");
      throw new Error("Failed to initialize course progress.");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Failed to initialize progress for course ID ${courseId}`
    );
  }
};

// Export all methods as named exports
export { fetchCourseProgress, updateLessonProgress, initializeCourseProgress };
