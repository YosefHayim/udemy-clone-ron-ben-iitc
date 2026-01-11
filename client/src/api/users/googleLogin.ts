import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

const googleLogin = async (googleCode: string) => {
  if (!googleCode) throw new Error("Please provide googleCode in url.");

  try {
    const url = `${isProduction ? baseUrl : localhostUrl}/api/user/google/auth/login`;
    const r = await axiosClient.post(url, { code: googleCode });

    if (r) {
      return r?.data;
    }
  } catch (error) {
    throw error;
  }
};

export default googleLogin;
