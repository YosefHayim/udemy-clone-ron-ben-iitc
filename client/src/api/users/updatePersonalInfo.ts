import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

const updatePersonalInfo = async (dataOfUser) => {
  if (!dataOfUser) throw new Error("Please provide dataOfUser in url.");


  const url = `${isProduction ? baseUrl : localhostUrl}/api/user/`;
  try {
    const r = await axiosClient.put(url, dataOfUser);

    if (r) {
      return r;
    }
  } catch (error) {
    throw error;
  }
};

export default updatePersonalInfo;
