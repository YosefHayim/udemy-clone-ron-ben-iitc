import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

const updateUserLanguage = async (preferredLanguage: string) => {
  if (!preferredLanguage) throw new Error("Please provide preferredLanguage in url.");

  const url = `${isProduction ? baseUrl : localhostUrl}/api/user`;
  try {
    const r = await axiosClient.put(url, preferredLanguage);

    if (r) {
      return r.data;
    }
  } catch (error) {
    throw error;
  }
};

export default updateUserLanguage;
