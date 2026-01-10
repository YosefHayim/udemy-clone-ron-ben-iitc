import SearchCourseCard from "@/pages/Search/SearchCourseCard/SearchCourseCard";
import SidebarFilter from "./SidebarFilter/SidebarFilter";
import FilterNSort from "./SidebarFilter/FilterNSort/FilterNSort";
import Pagination from "./PaginationPages/PaginationPages";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getAllCourses from "@/api/courses/getAllCourses";
import Loader from "@/components/Loader/Loader";
import Commercial from "./Commercial/Commercial";
import HotFreshCourses from "./HotFreshCourses/HotFreshCourses";
import React, { useContext, useRef, useState } from "react";
import CourseHoverCardInfo from "./CourseHoverCardInfo/CourseHoverCardInfo";
import { useEffect } from "react";
import RelatedSearches from "./RelatedSearches/RelatedSearches";
import { getTopValue } from "@/utils/geTopValues";
import { searchAlgoLocalStorage } from "@/utils/searchesOfUser";
import { FilterContext } from "@/contexts/FilterSearch";
import { IoCloseOutline } from "react-icons/io5";

const SearchPage: React.FC = () => {
  const { filterData } = useContext(FilterContext);
  const useScrollRef = useRef(null);

  document.title = "Search results | Udemy";
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm: string | null = searchParams.get("q")?.toLowerCase();
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Update URL dynamically when filterData or page changes
  useEffect(() => {
    const params: Record<string, string> = {
      q: searchTerm,
    };

    if (filterData.sortBy !== undefined && filterData.sortBy.length > 1)
      params.sort = filterData.sortBy;

    if (filterData.page > 1) params.page = filterData.page.toString();

    if (filterData.language.size > 0)
      params.courseLanguages = Array.from(filterData.language).join(",");

    if (filterData.levels.size > 0) params.courseLevel = Array.from(filterData.levels).join(",");

    if (filterData.topics.size > 0) params.courseTopic = Array.from(filterData.topics).join(",");

    if (filterData.ratings) params.averageRating = filterData.ratings.toString();

    if (filterData.certificateOnly) params.certificateOnly = "true";

    if (filterData.price) params.price = filterData.price;

    setSearchParams(params);
  }, [filterData, searchTerm, setSearchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["courses", searchTerm.toLowerCase(), filterData.page, filterData],
    queryFn: () => {
      if (!searchTerm) {
        throw new Error("Course ID is undefined");
      }
      searchAlgoLocalStorage(searchTerm);
      return getAllCourses(searchTerm, filterData, filterData.limit, filterData.page);
    },
    enabled: !!searchTerm,
  });

  if (isLoading) {
    return <Loader hSize="100" useSmallLoading={false} />;
  }

  return (
    <div className="w-full bg-white" ref={useScrollRef}>
      {/* Central container */}
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-8">
        {/* Filter */}
        <FilterNSort
          coursesResults={data?.totalCourses}
          searchTerm={searchTerm}
          onFilterToggle={() => setShowMobileFilter(true)}
        />

        {/* Mobile Filter Overlay */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-[1000] lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowMobileFilter(false)}
            />
            {/* Filter Panel */}
            <div className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] overflow-y-auto bg-white shadow-lg">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                <h2 className="text-lg font-bold">Filter</h2>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="p-4">
                <SidebarFilter />
              </div>
            </div>
          </div>
        )}

        {/* Grid layout: Sidebar | Courses */}
        <div className="mt-4 flex gap-6">
          {/* Sidebar on the left - hidden on mobile/tablet */}
          <aside className="hidden w-[320px] shrink-0 lg:block">
            <SidebarFilter />
          </aside>

          {/* courses on the right - full width on mobile/tablet */}
          <main className="w-full flex-grow flex-col lg:w-auto">
            <div className="flex flex-col gap-1">
              {data?.response?.slice(0, 18).map((course, index: number) => (
                <div
                  key={course?._id}
                  id={course?._id}
                  className="relative w-auto"
                  onMouseEnter={() => setHoveredCourse(course?._id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  <Link to={`/course-view/${course?._id}`}>
                    <SearchCourseCard course={course} />
                  </Link>
                  {/* Hover card */}
                  {hoveredCourse === course?._id && (
                    <div
                      className={`absolute right-[60%] z-10 w-1/2 translate-x-1/2 ${getTopValue(index)}`}
                    >
                      <CourseHoverCardInfo
                        positionedLeft={false}
                        positionedRight={false}
                        instructorId={course?.courseInstructor?._id}
                        courseTopic={course?.courseTopic}
                        index={index}
                        whatYouWillLearn={course?.whatYouWillLearn}
                        courseId={course?._id}
                        fullPriceCourse={course?.courseFullPrice}
                        coursePrice={course?.courseDiscountPrice}
                      />
                    </div>
                  )}

                  {/* Anúncios intermediários */}
                  {index === 2 && <Commercial key="commercial" />}
                  {index === 6 && <HotFreshCourses key="hotfreshcourses" />}
                </div>
              ))}
            </div>

            {/* Pesquisas relacionadas */}
            <div>
              <RelatedSearches />
            </div>
          </main>
        </div>

        {/* Paginação */}
        <div className="mt-10">
          <Pagination totalPages={data?.totalPages} useScrollRef={useScrollRef} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
