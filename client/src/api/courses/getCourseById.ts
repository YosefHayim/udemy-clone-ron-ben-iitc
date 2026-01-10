import { CourseData } from "../../types/types";
import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

type fn = (courseId: string) => Promise<CourseData>;

const getCourseById: fn = async (courseId: string) => {
  if (!courseId) {
    return;
  }

  const sanitizedCourseId = courseId.trim();
  const url = `${isProduction ? baseUrl : localhostUrl}/api/course/${sanitizedCourseId}`;

  try {
    const r = await axiosClient.get(url);

    if (r) {
      // 
      return r?.data?.data;
    }
  } catch (error) {
    throw error;
  }
};

export default getCourseById;
