import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import getCourseById from "@/api/courses/getCourseById";
import CourseBasicInfo from "./CourseBasicInfo/CourseBasicInfo";
import CourseBigTitle from "./CourseBigTitle/CourseBigTitle";
import CourseContent from "./CourseContent/CourseContent";
import CourseCreatedBy from "./CourseCreatedBy/CourseCreatedBy";
import CourseRating from "./CourseRating/CourseRating";
import CourseRecap from "./CourseRecap/CourseRecap";
import CourseStudentRatings from "./CourseStudentsRatings/CourseStudentRatings";
import ExploreTopics from "./ExploreTopics/ExploreTopics";
import FrequentlyBoughtTogether from "./FrequentlyBoughtTogether/FrequentlyBoughtTogether";
import InstructorSection from "./InstructorSection/InstructorSection";
import MoreCoursesByInstructor from "./MoreCoursesByInstructor/MoreCoursesByInstructor";
import ReportAbuse from "./ReportAbuse/ReportAbuse";
import ReviewsSection from "./ReviewsSection/ReviewsSection";
import StickyCourseNavbar from "./StickyCourseNavbar/StickyCourseNavbar";
import StudentsAlsoBought from "./StudentsAlsoBought/StudentsAlsoBought";
import TopicPathMenu from "./TopicPathMenu/TopicPathMenu";
import WhatYouLearn from "./WhatYouLearn/WhatYouLearn";
import CoursePreviewCard from "./CoursePreviewCard/CoursePreviewCard";
import CourseTag from "@/components/CourseCard/CourseTag/CourseTag";
import { CourseData } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import StickyCourseMobile from "./StickyCourseMobile/StickyCourseMobile";

const ViewCoursePageInfo = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 800 });
  const { courseId } = useParams<{ courseId: string }>();
  const sanitizedCourseId = courseId?.trim().replace(/^:/, "");
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [fixedCourseCard, setCourseCard] = useState(false);
  const [restoreTop, setRestoreTop] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!viewportRef.current) return;

      const courseCardViewport = viewportRef.current.getBoundingClientRect();
      const top = courseCardViewport.top;

      // When scrolling down into sticky range
      if (top <= -251 && top > -2570 && !fixedCourseCard) {
        setRestoreTop(viewportRef.current.offsetTop); // store original absolute top
        setCourseCard(true); // switch to fixed
      }

      // When scrolling down far enough, stop sticking
      if (top <= -2570 && fixedCourseCard) {
        setCourseCard(false);
      }

      // When scrolling back up above sticky threshold
      if (top > -251 && fixedCourseCard) {
        setCourseCard(false); // switch to absolute again
      }

      setCurrentPosition(top);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fixedCourseCard]);

  const { data, isLoading, error } = useQuery<CourseData>({
    queryKey: ["course", sanitizedCourseId],
    queryFn: async () => {
      if (!sanitizedCourseId) {
        throw new Error("Course ID is missing");
      }
      return await getCourseById(sanitizedCourseId);
    },
    enabled: !!sanitizedCourseId,
  });

  const handleScroll = () => {
    const offset = 100;
    const element = scrollTargetRef.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "instant" });
    }
  };

  if (data && data?.courseName) {
    document.title = data.courseName;
  }

  if (isLoading) {
    return (
      <div>
        <Loader hSize="100" useSmallLoading={false} />
      </div>
    );
  }

  if (error) {
    return navigate("/not/found");
  }


  return (
    <div>
      <div className="flex w-full items-start justify-start gap-4">
        <div className="flex w-full flex-col items-start justify-start gap-4">
          <div className="flex w-full flex-col items-start justify-start">
            <div className="flex w-full flex-col items-start justify-start gap-5 bg-blackUdemy  p-5">
              {!isMobile && (
                <StickyCourseNavbar
                  courseName={data?.courseName}
                  totalStudents={data?.totalStudentsEnrolled?.count}
                  avgRating={data?.averageRating}
                  totalRatings={data?.totalRatings}
                />
              )}
              {isMobile && <StickyCourseMobile />}
              <TopicPathMenu
                category={data?.category}
                subcategory={data?.subCategory}
                topic={data?.courseTopic}
              />
              <CourseBigTitle courseTitle={data?.courseName} />
              <CourseRecap recapInfo={data?.courseRecapInfo} />
              <div className="flex w-full  items-center justify-start gap-3">
                <CourseTag tagName={data?.courseTag} />
                <CourseRating
                  courseRating={data?.averageRating}
                  amountOfStars={data?.averageRating}
                  isShowRating={true}
                />
                <CourseStudentRatings
                  totalRated={data?.totalRatings}
                  totalStudents={data?.totalStudentsEnrolled?.count}
                />
              </div>
              <CourseCreatedBy
                handleScroll={handleScroll}
                instructorName={data?.courseInstructor?.fullName}
                instructorId={data?.courseInstructor?._id}
              />
              <CourseBasicInfo
                isDisplayMonthName={false}
                lastUpdated={data?.updatedAt}
                courseLanguage={data?.courseLanguages}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-5 p-5">
              <WhatYouLearn prosCourse={data?.whatYouWillLearn} />
              <ExploreTopics
                category={data?.category}
                subCategory={data?.subCategory}
                topic={data?.courseTopic}
              />
              <CourseContent
                sectionsOfCourse={data?.sections}
                totalCourseSections={data?.sections?.length}
                totalCourseDuration={data?.totalCourseDuration}
                totalCourseLessons={data?.totalCourseLessons}
                requirements={data?.courseRequirements}
                description={data?.courseDescription}
                whoThisFor={data?.whoThisCourseIsFor}
              />
              <StudentsAlsoBought />
              <FrequentlyBoughtTogether instructorId={data?.courseInstructor._id} />
              <div ref={scrollTargetRef}>
                <InstructorSection
                  instructorHeadline={data?.courseInstructor?.headline}
                  instructorId={data?.courseInstructor?._id}
                  instructorImg={data?.courseInstructor?.profilePic}
                  instructorName={data?.courseInstructor?.fullName}
                  descriptionInstructor={data?.courseInstructorDescription}
                />
              </div>
              <ReviewsSection reviewsToRender={data?.reviews} avgRating={data?.averageRating} />
              <MoreCoursesByInstructor instructorName={data?.courseInstructor?.fullName} />
              <ReportAbuse />
            </div>
          </div>
        </div>
        <div>
          <div
            className={`${currentPosition <= -970 ? `absolute top-[${currentPosition}px]` : "absolute"} right-[10%] top-[10%] w-1/4`}
            ref={viewportRef}
          >
            <CoursePreviewCard
              restoreTop={restoreTop}
              currentPosition={currentPosition}
              fixedCourseCard={fixedCourseCard}
              courseTopic={data?.courseTopic}
              instructorId={data?.courseInstructor?._id}
              firstLessonId={data?.sections?.[0]?.lessons?.[0]?._id}
              courseId={data?._id}
              courseImg={data?.courseImg}
              coursePrice={data?.courseDiscountPrice}
              fullPrice={data?.courseFullPrice}
              discountPrice={data?.courseDiscountPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCoursePageInfo;
