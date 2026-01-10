import CourseTitle from "@/components/CourseCard/CourseTitle/CourseTitle";
import CourseRating from "../../CourseRating/CourseRating";
import CoursePrice from "../../StudentsAlsoBought/CoursePrice/CoursePrice";
import FaqCourseImg from "../FaqCourseImg/FaqCourseImg";
import FaqInstructName from "../FaqInstructName/FaqInstructName";
import FaqTotalStudentsCourse from "../FaqTotalStudentsCourse/FaqTotalStudentsCourse";
import { Link } from "react-router-dom";
import { GoPlusCircle } from "react-icons/go";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import {
  calculateDiscountPercentage,
  calculateTotalSavings,
  setAddCourseToCart,
  setAmountOfCourses,
  setTotalCourseDiscountPrices,
  setTotalOriginalCoursePrices,
} from "@/redux/slices/cartSlice";

const FrequentlyCourseCard: React.FC<{
  courseImg: string;
  courseName: string;
  instructorName: string;
  courseFullPrice: number;
  courseDiscountPrice: number;
  courseId: string;
  totalRatings?: number;
  setDisplayFBT: React.Dispatch<React.SetStateAction<number>>;
  setCoursesAdded: React.Dispatch<React.SetStateAction<any[]>>;
  onAddToCartSuccess: () => void;
}> = ({
  courseImg,
  courseName,
  instructorName,
  courseFullPrice,
  courseDiscountPrice,
  totalRatings,
  courseId,
  setDisplayFBT,
  setCoursesAdded,
  onAddToCartSuccess,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [showCourse, setShowCourse] = useState(true);

  const handleAddToCart = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const courseId = target.closest("div[id]").id;
    setLoading(true);
    setTimeout(() => {
      dispatch(setAmountOfCourses());
      dispatch(setTotalCourseDiscountPrices(Number(courseFullPrice)));
      dispatch(setTotalOriginalCoursePrices(Number(courseDiscountPrice)));
      dispatch(calculateTotalSavings());
      dispatch(calculateDiscountPercentage());
      dispatch(setAddCourseToCart(courseId));
      onAddToCartSuccess();
      setLoading(false);
    }, 2000);
    setShowCourse(false);
    setDisplayFBT((prev) => (prev -= 1));
    setCoursesAdded((prev) => [...prev, courseId]);
  };

  useEffect(() => {}, [showCourse]);

  return (
    <div className={`flex flex-col p-[1em] ${showCourse ? "flex" : "hidden"}`} id={courseId}>
      <div className="item-start flex justify-evenly gap-[1em]">
        <Link to={`/course-view/${courseId}`}>
          <FaqCourseImg courseImg={courseImg} />
        </Link>
        <div>
          <CourseTitle shortcutTitle={true} title={courseName} />
          <FaqInstructName instructorName={instructorName} />
          <div className="flex  items-center gap-[0.5em]">
            <CourseRating colorRating="text-black" amountOfStars={4} courseRating={totalRatings} />
            <FaqTotalStudentsCourse totalRatings={totalRatings} />
          </div>
        </div>
        <div>
          <CoursePrice
            courseFullPrice={courseFullPrice}
            courseDiscountPrice={courseDiscountPrice}
          />
        </div>
        <div className="w-min">
          <button
            className="rounded-full text-purple-800 hover:bg-purple-100 focus:outline-none"
            onClick={handleAddToCart}
          >
            {isLoading ? (
              <Loader hSize="0px" useSmallBlackLoading={true} useSmallLoading={true} />
            ) : (
              <GoPlusCircle size={22} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyCourseCard;
