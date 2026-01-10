import CourseImg from "@/components/CourseCard/CourseImg/CourseImg";
import CourseInstructor from "@/components/CourseCard/CourseInstructor/CourseInstructor";
import CoursePrice from "@/components/CourseCard/CoursePrice/CoursePrice";
import CourseRatings from "@/components/CourseCard/CourseRatings/CourseRatings";
import CourseRecap from "@/components/CourseCard/CourseRecap/CourseRecap";
import CourseTag from "@/components/CourseCard/CourseTag/CourseTag";
import CourseTitle from "@/components/CourseCard/CourseTitle/CourseTitle";
import CourseLength from "@/pages/ViewCoursePageInfo/MoreCoursesByInstructor/CourseLength/CourseLength";
import { useNavigate } from "react-router-dom";

const SearchCourseCard = ({ course }) => {
  const navigate = useNavigate();

  if (!course) {
    console.log("Course is undefined", course);
    return;
  }

  const handleCardClick = (courseId: string) => {
    navigate(`/course-view/${courseId}`);
    return;
  };

  return (
    <div id={course._id} onClick={() => handleCardClick(course._id)}>
      <div className="flex w-full max-w-full cursor-pointer flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4">
        <div className="flex w-full items-start justify-start gap-2 text-[0.8rem] sm:gap-[1em]">
          <CourseImg courseImg={course.courseImg} />

          <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-[0.3em] text-[0.8rem]">
            <CourseTitle title={course.courseName} />
            <CourseRecap recapInfo={course.courseRecapInfo} />
            <CourseInstructor instructor={course.courseInstructor.fullName} />
            <CourseRatings totalRatings={course.totalRatings} avgRatings={course.averageRating} />
            <CourseLength
              courseLevel={course.courseLevel}
              totalMinutes={course.totalCourseDuration}
              totalLectures={course.totalCourseLessons}
            />
            <CourseTag />
          </div>
        </div>
        <CoursePrice
          displayPercent={false}
          extraCSS={`text-sm`}
          fullPrice={course.courseFullPrice}
          discountPrice={course.courseDiscountPrice}
        />
      </div>
      <hr className="my-4 w-full" />
    </div>
  );
};

export default SearchCourseCard;
