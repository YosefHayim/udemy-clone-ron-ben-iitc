import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

interface WishlistResponse {
  status: string;
  message: string;
  wishlistCourses: string[];
}

const toggleWishlist = async (courseId: string): Promise<WishlistResponse> => {
  if (!courseId) throw new Error("Please provide a course ID.");

  const response = await axiosClient.post(
    `${isProduction ? baseUrl : localhostUrl}/api/user/course/wishlist/${courseId}`
  );

  return response.data;
};

export default toggleWishlist;
