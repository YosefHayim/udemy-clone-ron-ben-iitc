import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

type email = {
  email: string;
};

type fn = (email: email) => Promise<any>;

const loginUser: fn = async (email) => {
  if (!email) throw new Error("Please provide email in url.");

  try {
    const r = await axiosClient.post(
      `${isProduction ? baseUrl : localhostUrl}/api/user/auth/login`,
      email
    );

    if (r) {

      return r?.data?.data;
    }
  } catch (error) {
    throw error;
  }
};

export default loginUser;
