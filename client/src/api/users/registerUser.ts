import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";
import { RegisterUserPayload } from "../../types/types";

type fn = (data: RegisterUserPayload) => Promise<any>;

const registerUser: fn = async (data: RegisterUserPayload): Promise<any> => {
  if (!data) throw new Error("Please provide data in url.");

  try {
    const r = await axiosClient.post(
      `${isProduction ? baseUrl : localhostUrl}/api/user/auth/signup`,
      data
    );

    if (r) {
      return r;
    }
  } catch (error) {
    throw error;
  }
};

export default registerUser;
