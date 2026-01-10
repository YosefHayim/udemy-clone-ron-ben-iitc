import CourseCardInstructorRelated from "../CourseCardInstructorRelated/CourseCardInstructorRelated";
import { useNavigate } from "react-router-dom";

const InstructorCourses: React.FC<{ coursesCreated: string[] }> = ({ coursesCreated }) => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const courseDiv = target.closest("div[id]");
    const courseId = courseDiv?.id;
    navigate(`/course-view/${courseId}`);
  };

  return (
    <div className="w-full">
      <b>My courses({coursesCreated.length})</b>
      <div className="mt-[1.5em] grid grid-cols-2 gap-[1em]" onClick={handleNavigate}>
        {coursesCreated.map((courseId) => (
          <CourseCardInstructorRelated courseId={courseId} key={courseId} />
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;
