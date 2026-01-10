import { axiosClient, localhostUrl } from "../api/configuration";

type fn = (courseId: string) => Promise<any>;

const fetchCourseById: fn = async (courseId: string) => {
  if (!courseId || typeof courseId !== "string") {
    return null;
  }

  const sanitizedCourseId = courseId.trim();
  const url = `${localhostUrl}/api/course/${sanitizedCourseId}`;

  try {
    const response = await axiosClient.get(url);

    if (response?.data?.data) {
      return response.data.data;
    }

    console.warn("No course data found in the response.");
    return null;
  } catch (error) {
    throw error;
  }
};

export default fetchCourseById; // Default export
