import TriangleShape from "./TriangleShape/TriangleShape";
import InteractionsBtns from "./InteractionBtns/InteractionsBtns";
import CoursePros from "./CoursePros/CoursePros";
import CourseLength from "@/pages/ViewCoursePageInfo/MoreCoursesByInstructor/CourseLength/CourseLength";
import CourseTag from "@/components/CourseCard/CourseTag/CourseTag";
import CourseBasicInfo from "@/pages/ViewCoursePageInfo/CourseBasicInfo/CourseBasicInfo";
import CourseRecap from "@/components/CourseCard/CourseRecap/CourseRecap";
import CourseTitle from "@/components/CourseCard/CourseTitle/CourseTitle";

const CourseHoverCardInfo: React.FC<{
  whatYouWillLearn: string[];
  courseName: string;
  courseId: string;
  coursePrice: number;
  fullPriceCourse: number;
  index: number;
  courseTopic: string;
  instructorId: string;
  width?: string;
  positionedLeft?: boolean;
  positionedRight?: boolean;
  showCourseLength?: boolean;
  courseLevel?: string;
  totalCourseDuration?: number;
  totalCourseLessons?: number;
  courseUpdatedAt?: Date;
  courseTag?: string;
  courseLanguages?: string;
  courseRecapInfo?: string;
  displayWhatYouLearn?: boolean;
}> = ({
  whatYouWillLearn,
  courseId,
  coursePrice,
  fullPriceCourse,
  index,
  courseTopic,
  instructorId,
  width = "40rem",
  positionedLeft = false,
  positionedRight = false,
  showCourseLength = false,
  courseLevel = "",
  totalCourseDuration = 0,
  totalCourseLessons = 0,
  courseUpdatedAt,
  courseTag,
  courseLanguages,
  courseRecapInfo,
  displayWhatYouLearn = true,
  courseName = "",
}) => {
    return (
      <div className="max-w-[340px] overflow-y-visible text-[0.875rem]" id={courseId}>
        <div id={courseId} className={`${courseId} relative`}>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-white">
            <TriangleShape
              index={index}
              positionedRight={positionedRight}
              positionedLeft={positionedLeft}
            />
          </div>
          <div className={`w-[${width}] rounded-[0.5em]  bg-white p-[1.5em] shadow-alertAlgoInfo `}>
            <div className="text-[1rem] font-bold opacity-95 pb-3">
              <CourseTitle title={courseName} />
            </div>
            {showCourseLength && (
              <div className="flex  w-max items-center justify-start pb-1">
                <CourseTag tagName={courseTag} />
                <CourseBasicInfo
                  isDisplayMonthName={true}
                  lastUpdated={courseUpdatedAt}
                  courseLanguage={courseLanguages}
                />
              </div>
            )}
            {showCourseLength && (
              <div className="my-1">
                <CourseLength
                  isSmallText={true}
                  courseLevel={courseLevel}
                  totalMinutes={totalCourseDuration}
                  totalLectures={totalCourseLessons}
                />
              </div>
            )}
            {showCourseLength && <CourseRecap recapInfo={courseRecapInfo} />}
            <CoursePros
              whatYouWillLearn={whatYouWillLearn}
              displayWhatYouLearn={displayWhatYouLearn}
            />
            <InteractionsBtns
              BtnText="Add to cart"
              isDisplayHeart={true}
              instructorId={instructorId}
              courseTopic={courseTopic}
              courseId={courseId}
              coursePrice={coursePrice}
              fullPriceCourse={fullPriceCourse}
            />
          </div>
        </div>
      </div>
    );
  };

export default CourseHoverCardInfo;
