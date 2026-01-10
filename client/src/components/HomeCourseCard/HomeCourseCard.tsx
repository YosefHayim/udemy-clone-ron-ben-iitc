import CourseTag from "@/components/CourseCard/CourseTag/CourseTag";
import CourseTitle from "@/components/CourseCard/CourseTitle/CourseTitle";
import CoursePrice from "@/components/CourseCard/CoursePrice/CoursePrice";
import CourseRatings from "@/components/CourseCard/CourseRatings/CourseRatings";
import CourseInstructor from "@/components/CourseCard/CourseInstructor/CourseInstructor";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const HomeCourseCard = ({ courseCard, index, onHover, onPosition, onStartHideTimer, onCancelHideTimer }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    onCancelHideTimer?.();
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverWidth = 330;

    let left = rect.right;
    if (left + hoverWidth > window.innerWidth) {
      left = rect.left - hoverWidth - 10;
    }

    onPosition({
      top: rect.top + window.scrollY,
      left,
    });

    onHover(courseCard);
  };

  const handleMouseLeave = () => {
    onStartHideTimer?.();
  };

  const handleCardClick = (courseId: string) => {
    navigate(`/course-view/${courseId}`);
  };

  return (
    <div
      onClick={() => handleCardClick(courseCard._id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={courseCard?._id}
      className="relative w-[312px] cursor-pointer flex-col items-start rounded-lg border border-borderGrayColor bg-white shadow-sm"
    >
      <img
        src={courseCard?.courseImg}
        alt={courseCard?.courseName}
        className="h-50 w-full object-cover"
      />
      <hr className="h-[0.1em] w-full bg-gray-300" />
      <div className="flex flex-col items-start justify-start gap-1 p-2">
        <CourseTitle title={courseCard.courseName} />
        <CourseInstructor instructor={courseCard?.courseInstructor?.fullName} />
        <CourseRatings
          totalRatings={courseCard?.totalRatings}
          avgRatings={courseCard?.averageRating}
        />
        <CoursePrice
          discountPrice={courseCard.courseDiscountPrice}
          fullPrice={courseCard.courseFullPrice}
        />
        <CourseTag tagName={courseCard?.courseTag} />
      </div>
    </div>
  );
};

export default HomeCourseCard;
