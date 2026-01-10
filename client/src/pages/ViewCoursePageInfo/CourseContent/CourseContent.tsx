import Description from "../Description/Description";
import Requirements from "../Requirements/Requirements";
import Section from "../Section/Section";
import TotalCourseLength from "../TotalCourseLength/TotalCourseLength";

const CourseContent = ({
  description,
  whoThisFor,
  requirements,
  totalCourseDuration,
  totalCourseLessons,
  totalCourseSections,
  sectionsOfCourse,
}) => {
  if (sectionsOfCourse?.lessons?.length === 0) {
    return (
      <div>
        <b>This course has no sections and lessons yet</b>
      </div>
    );
  }


  return (
    <div className="curriculum flex flex-col">
      <h2 className="mb-[1em] font-sans text-[1.2em] font-extrabold">Course Content</h2>
      <TotalCourseLength
        totalCourseLessons={totalCourseLessons}
        totalCourseDuration={totalCourseDuration}
        totalCourseSections={totalCourseSections}
      />
      <div>
        {sectionsOfCourse.map((courseSection) => (
          <div key={courseSection._id}>
            <Section lessonsOfSection={courseSection.lessons} sectionName={courseSection.title} />
          </div>
        ))}
      </div>
      <hr className="mt-[2em] w-[550px]" />
      <Requirements requirements={requirements} />
      <Description description={description} whoThisFor={whoThisFor} />
    </div>
  );
};

export default CourseContent;
