import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

const buyCourseById = async (courseId: string | string) => {
  if (!courseId) throw new Error("Please provide course Id in url.");

  try {
    const url = `${isProduction ? baseUrl : localhostUrl}/api/course/add/${courseId}`;

    const r = await axiosClient.post(url);
    if (r) {
      return r.data;
    }
  } catch (error) {
    throw error;
  }
};

export default buyCourseById;
