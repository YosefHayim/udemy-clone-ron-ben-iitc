import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

type fn = (payload) => Promise<any>;

const reportUserReviewByReviewId: fn = async ({ reviewId, issueType, issueDetails, userId }) => {
  if (!reviewId) throw new Error("Please provide idOfReview in url.");

  const sanitizedReviewId = reviewId.trim().toString();
  if (!sanitizedReviewId) {
    throw new Error("Invalid review ID provided after sanitization.");
  }

  const url = `${isProduction ? baseUrl : localhostUrl}/api/report/review/${sanitizedReviewId}`;

  try {
    const payload = { issueType, issueDetails, userId };
    const r = await axiosClient.post(url, payload);

    if (r) {
      return r;
    }
  } catch (error) {
      `Error reporting review with ID ${sanitizedReviewId}:`,
      error.response.data.message
    );
    throw error;
  }
};

export default reportUserReviewByReviewId;
