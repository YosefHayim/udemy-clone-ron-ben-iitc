import CourseRating from "@/pages/ViewCoursePageInfo/CourseRating/CourseRating";
import { LuDot } from "react-icons/lu";
import CoursePrice from "@/components/CourseCard/CoursePrice/CoursePrice";
import CourseTag from "@/components/CourseCard/CourseTag/CourseTag";
import getCourseById from "@/api/courses/getCourseById";
import { CourseData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useEffect } from "react";

const CourseCardInstructorRelated: React.FC<{
  courseId: string;
}> = ({ courseId }) => {
  if (!courseId) throw new Error("Missing courseId of instructor");

  const { data, isLoading, error } = useQuery<CourseData>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) {
        throw new Error("Course ID is missing");
      }
      return await getCourseById(courseId);
    },
    enabled: !!courseId,
  });

  useEffect(() => {}, []);

  if (error) {
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <Loader hSize="" useSmallBlackLoading={true} useSmallLoading={true} />
      ) : (
        <div className=" flex cursor-pointer flex-col items-start justify-start gap-[0.2em]">
          <img src={data?.courseImg} alt="" className="w-[200px] border border-gray-300" />
          <b className="w-[200px]">{data?.courseName}</b>
          <div className="flex  items-center">
            <b className="text-[#BB6300]">4.7</b>
            <CourseRating amountOfStars={0} courseRating={data?.courseRating} />
            <p className="text-gray-500 ">({data?.totalRatings})</p>
          </div>
          <div className="flex   items-center justify-start gap-[0.2em] text-gray-500">
            <p>{data?.totalCourseDuration} hours</p>
            <LuDot />
            <p>59 lectures</p>
            <LuDot />
            <p>Intermediate</p>
          </div>
          <CoursePrice
            extraCSS={`text-sm`}
            displayPercent={false}
            chooseFlex={`flex items-center gap-2`}
            fullPrice={data?.courseFullPrice}
            discountPrice={data?.courseDiscountPrice}
          />
          <CourseTag tagName={data?.courseTag} />
        </div>
      )}
    </div>
  );
};

export default CourseCardInstructorRelated;
