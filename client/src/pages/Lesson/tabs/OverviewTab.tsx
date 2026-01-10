import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import fetchCourseById from "@/services/courseService";
import { FaStar } from "react-icons/fa";
import { BsPatchExclamationFill } from "react-icons/bs";
import { MdOutlineLanguage } from "react-icons/md";
import { IoMdAlarm } from "react-icons/io";

const OverviewTab: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // Log courseId for debugging
  // 

  const sanitizedCourseId = courseId?.trim().replace(/^:/, "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["course", sanitizedCourseId],
    queryFn: () => {
      // 
      return fetchCourseById(sanitizedCourseId || "");
    },
    enabled: !!sanitizedCourseId,
  });

  // 

  if (isLoading) return;
  <div>{/* <Loader /> */}</div>;
  if (error) return <div>Error loading course data</div>;
  if (!data) return <div>No course data found.</div>;

  const course = data;

  // 

  return (
    <div id="overview" className="p-20 pt-5">
      <div className="ml-4">
        <h2 className="mb-4 text-2xl">{course.courseDescription || "No Description"}</h2>
        <div className="flex items-start gap-10 py-1 text-xl">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="mr-2 font-sans text-base font-extrabold text-[#4d3105]">
                {course.averageRating.toFixed(1) || "0.0"}
              </span>
              <span className="font-sans text-base font-extrabold text-star">
                <FaStar />
              </span>
            </div>
            <span className="text-xs text-gray-500">{course.totalRatings || 0} ratings</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="mr-2 font-sans text-base font-extrabold text-[#000000]">
                {course.totalStudentsEnrolled.count || "0.0"}
              </span>
            </div>
            <span className="text-xs text-gray-500">students</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="mr-2 font-sans text-base font-extrabold text-[#000000]">
                {course.totalCourseDuration || "0.0"} hours
              </span>
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>
        <div className="flex flex-col ">
          <span>
            <div className="inline-flex  items-center gap-2 pt-3 text-sm">
              <BsPatchExclamationFill />
              Last update{" "}
              {new Date(course.updatedAt).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </span>
        </div>

        <span>
          <div className="inline-flex  items-center gap-2 pt-3 text-sm">
            <MdOutlineLanguage />
            {course.courseLanguages}
          </div>
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm">
        <div className=" flex  items-center gap-4">
          <IoMdAlarm className="text-4xl" />
          <h1 className="font-sans text-lg font-extrabold">Schedule learning time</h1>
        </div>
        <p className="text-sm text-gray-600">
          Learning a little each day adds up. Research shows that students who make learning a habit
          are more likely to reach their goals. Set time aside to learn and get reminders using your
          learning scheduler.
        </p>
        <div className="flex  gap-2">
          <button className="rounded bg-black px-4 py-2 text-white hover:bg-gray-600 focus:outline-none">
            Get started
          </button>
          <button className="rounded border-gray-300 px-4 py-2  text-black hover:border-white focus:outline-none ">
            Dismiss
          </button>
        </div>
      </div>

      <div className="mt-4 flex w-full items-center justify-between border-t">
        <span className="self-start text-xl">Description</span>
        <span className="text-l px-4">{course.courseDescription}</span>
        <span></span>
      </div>
    </div>
  );
};

export default OverviewTab;
