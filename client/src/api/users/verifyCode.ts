import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

type fn = (verificationCredentials: {
  fullName?: string;
  code: string;
  email: string;
}) => Promise<any>;

const verifyCode: fn = async (verificationCredentials) => {
  if (!verificationCredentials) throw new Error("Must provide verification credential");
  try {
    const r = await axiosClient.post(
      `${isProduction ? baseUrl : localhostUrl}/api/user/verify`,
      verificationCredentials
    );

    if (r) {
      return r?.data;
    }
  } catch (error) {
    throw error;
  }
};

export default verifyCode;
