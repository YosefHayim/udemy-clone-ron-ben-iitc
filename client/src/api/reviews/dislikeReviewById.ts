import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

type fn = (idOfReview: string) => Promise<any>;

export const dislikeReviewById: fn = async (idOfReview: string) => {
  if (!idOfReview) throw new Error("Please provide idOfReview in url.");

  const sanitizedReviewId = idOfReview.trim();
  const url = `${isProduction ? baseUrl : localhostUrl}/api/review/dislike/${sanitizedReviewId}`;
  try {
    const r = await axiosClient.post(url);

    if (r) {
      return r;
    }
  } catch (error) {
    throw error;
  }
};
