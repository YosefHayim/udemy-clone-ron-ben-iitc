import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

const refreshMe = async () => {
  try {
    const r = await axiosClient.post(`${isProduction ? baseUrl : localhostUrl}/api/user/me`);

    if (r) {
      return r.data;
    }
  } catch (error) {
    throw error;
  }
};

export default refreshMe;
