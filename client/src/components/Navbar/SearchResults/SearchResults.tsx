import { SearchResultsProps } from "@/types/types";
import SearchResultRow from "./SearchResultRow/SearchResultRow";
import SearchResultsCourseImg from "./SearchResultsCourseImg/SearchResultsCourseImg";
import { Link } from "react-router-dom";

const SearchResults: React.FC<{
  isTyping: boolean;
  extraCSS?: string;
  data: any;
}> = ({ isTyping, data }) => {
  return (
    <div>
      {isTyping && (
        <div
          className={`absolute left-0 top-full z-50 w-full flex-col  border border-gray-300 bg-white py-2 shadow-md`}
        >
          {data?.response?.slice(0, 13).map(
            (courseCardResult, index: number) => (
              (
                <div key={courseCardResult._id}>
                  {index < 9 ? (
                    <SearchResultRow
                      algoWord={courseCardResult.courseName}
                      courseId={courseCardResult._id}
                    />
                  ) : (
                    <Link to={`/course-view/${courseCardResult._id}`}>
                      <SearchResultsCourseImg
                        courseName={courseCardResult.courseName}
                        instructorName={courseCardResult.courseInstructor.fullName}
                        courseImg={courseCardResult.courseImg}
                        courseId={courseCardResult._id}
                      />
                    </Link>
                  )}
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
