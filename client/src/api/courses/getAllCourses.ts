import { axiosClient, baseUrl, isProduction, localhostUrl } from "../configuration";

const getAllCourses = async (searchTerm = "", filterData, limit = 13, page = 1) => {
  if (!searchTerm) {
    return;
  }

  const {
    sortBy = "",
    handsOnPractice = "",
    language = new Set(),
    levels = new Set(),
    price = null,
    ratings = "",
    subtitles = new Set(),
    topics = new Set(),
    videosDurations = new Set(),
    certificateOnly = "",
  } = filterData;

  const encodedSearch = encodeURIComponent(searchTerm);

  // Convert sets to comma-separated strings (if not empty)
  const toCSV = (set) => (set.size ? Array.from(set).join(",") : "");
  const languageCSV = toCSV(language);
  const levelsCSV = toCSV(levels);
  const topicsCSV = toCSV(topics);
  const subtitlesCSV = toCSV(subtitles);
  const durationsCSV = toCSV(videosDurations);
  const handsOnCSV =
    handsOnPractice instanceof Set ? [...handsOnPractice].join(",") : handsOnPractice;

  // Build query parameters
  const queryParams = [
    `search=${encodedSearch}`,
    sortBy && `sort=${sortBy}`,
    price === "Free" && "courseDiscountPrice=0",
    price === "Paid" && "courseDiscountPrice[gte]=0.01",
    ratings && `averageRating[gte]=${ratings}`,
    languageCSV && `courseLanguages=${languageCSV}`,
    certificateOnly && `certificateOnly=${certificateOnly}`,
    levelsCSV && `courseLevel=${levelsCSV}`,
    topicsCSV && `courseTopic=${topicsCSV}`,
    durationsCSV && `totalCourseDuration[gte]=${durationsCSV}`,
    page > 1 && `page=${page}`,
    `limit=${limit}`,
    handsOnCSV && `hands-on=${handsOnCSV}`,
  ]
    .filter(Boolean) // remove falsy entries
    .join("&");

  const url = `${isProduction ? baseUrl : localhostUrl}/api/course/?${queryParams}`;

  try {
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export default getAllCourses;
