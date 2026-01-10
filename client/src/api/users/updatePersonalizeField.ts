import { personalizeFieldPayload } from "../../types/types";
import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

const updatePersonalizeUserField = async (personalizeField: personalizeFieldPayload) => {
  if (!personalizeField) throw new Error("Please provide personalizeField in url.");

  try {
    const url = `${isProduction ? baseUrl : localhostUrl}/api/user/updatePersonalizeField`;
    const r = await axiosClient.put(url, personalizeField);

    if (r) {
      return r.data;
    }
  } catch (error) {
    throw error;
  }
};

export default updatePersonalizeUserField;
