import React, { useState, useEffect } from "react";
import CourseTag from "@/components/CourseCard/CourseTag/CourseTag";
import CourseHoverCard from "./CourseHoverCard";
import { Course } from "@/types/types";
import { MdOutlineStarHalf } from "react-icons/md";
import { IoIosStar, IoIosStarOutline, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { baseUrl, isProduction, localhostUrl } from "@/api/configuration";

const CoursesCarousel: React.FC<{ searchTerm: string }> = ({ searchTerm = "" }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);
  const [hoverCardPosition, setHoverCardPosition] = useState({
    top: 0,
    left: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleItems = 5; // Número de itens visíveis no carrossel

  // Função para buscar cursos
  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${isProduction ? baseUrl : localhostUrl}/api/course/?search=${encodeURI(searchTerm)}`
      );
      const data = await response.json();
      if (data.status === "Success") {
        const updatedCourses = data.response.map((course: any) => ({
          ...course,
          isNew: course.totalRatings < 10,
          isBestseller: course.totalRatings > 50,
        }));

        setCourses(updatedCourses);
      } else {
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Função para ir ao próximo conjunto de cursos no carrossel
  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < Math.ceil(courses.length / visibleItems)) {
      setCurrentIndex(nextIndex);
    }
  };

  // Função para voltar ao conjunto anterior no carrossel
  const handlePrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    }
  };

  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);

  // Função ao passar o mouse sobre um curso
  const handleMouseEnter = (course: Course, event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredCourseId(course._id); // Define o curso em hover
    const courseRect = event.currentTarget.getBoundingClientRect();

    setHoverCardPosition({
      top: courseRect.height / 2, // Centraliza verticalmente
      left: courseRect.width + 10, // Adiciona 10px à direita
    });

    setHoveredCourse(course);
  };

  // Função para remover o hover
  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setHoveredCourseId(null);
      setHoveredCourse(null);
    }
  };

  const navigate = useNavigate();

  const handleCardClick = (courseId: string) => {
    navigate(`/course-view/${courseId}`);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center justify-between">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < fullStars) {
            return <IoIosStar key={i} className="ml-[1px] text-[#c4710d]" />;
          } else if (i === fullStars && hasHalfStar) {
            return <MdOutlineStarHalf key={i} className="ml-[1px] text-[#c4710d]" />;
          } else {
            return <IoIosStarOutline key={i} className="ml-[1px] text-[#c4710d]" />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="relative mx-auto w-full overflow-visible py-6">
      <h2 className="mb-4 overflow-visible pl-2 font-sans text-2xl font-extrabold text-courseNameColorTxt">
        Because you viewed{" "}
        <span className="font-sans font-extrabold text-btnColor underline hover:text-[#521e9f]">
          {searchTerm}
        </span>
      </h2>

      {courses.length > 0 && (
        <div className="relative overflow-x-clip overflow-y-visible">
          <div
            className="flex overflow-y-visible transition-transform duration-300"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
              width: `${courses.length * (100 / visibleItems)}%`,
            }}
          >
            {courses.map((course) => (
              <div
                key={course._id}
                className="relative box-border w-[calc(100%/5)] overflow-visible px-[0.5rem] "
                onMouseEnter={(e) => handleMouseEnter(course, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  onClick={() => handleCardClick(course._id)}
                  className="maxh-[18rem] flex cursor-pointer flex-col overflow-visible bg-white shadow-sm"
                >
                  <div className="h-36 w-full">
                    <img
                      src={course.courseImg}
                      alt={course.courseName}
                      className={`h-full w-full border border-gray-300 object-cover transition-all duration-300 ${
                        hoveredCourseId === course._id ? "brightness-90" : ""
                      }`}
                    />
                  </div>
                  <div className="flex flex-grow flex-col justify-between">
                    <h3 className="line-clamp-2 pt-[0.3rem] font-sans text-[1rem] font-extrabold leading-5 text-courseNameColorTxt">
                      {course.courseName}
                    </h3>
                    <p className="truncate py-[0.2rem] text-xs text-grayNavbarTxt">
                      {course.courseInstructor.fullName}
                    </p>
                    <div className="flex items-center font-sans text-sm font-extrabold text-[#8B4309]">
                      <span className="mr-1 text-[#8B4309]">{course.averageRating.toFixed(1)}</span>
                      <div className="flex">{renderStars(course.averageRating)}</div>
                      <span className="ml-2 text-xs text-gray-500">
                        ({course.totalRatings.toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between py-[0.15rem]">
                      <span className="text-[1rem] font-[700] text-courseNameColorTxt">
                        ₪{course.courseDiscountPrice.toFixed(2)}
                      </span>
                      {course.courseFullPrice && (
                        <span className="ml-2 text-xs text-gray-500 line-through">
                          ₪{course.courseFullPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="inline-block pt-[0.3rem]">
                      <CourseTag tagName={course.courseTag} />
                    </span>
                  </div>
                </div>

                {hoveredCourse?._id === course._id && (
                  <div
                    className="absolute !z-[9999] overflow-visible"
                    style={{
                      top: `${hoverCardPosition.top}px`,
                      left: `${hoverCardPosition.left}px`,
                      transform: "translateY(-50%)",
                    }}
                    onMouseEnter={() => setHoveredCourseId(hoveredCourse?._id || null)}
                    onMouseLeave={(event) => handleMouseLeave(event)}
                  >
                    <CourseHoverCard course={hoveredCourse} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handlePrev}
        className="absolute left-[-1rem] top-[9.2rem] z-10 h-[3.2rem] w-[3.2rem] -translate-y-1/2 transform rounded-full bg-white p-3 text-courseNameColorTxt shadow-md hover:bg-[#E9EAF2]"
        aria-label="Scroll Left"
      >
        <IoIosArrowBack className="text-[1.4rem]" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-[-1rem] top-[9.2rem] z-10 h-[3.2rem] w-[3.2rem] -translate-y-1/2 transform rounded-full bg-white p-3 text-courseNameColorTxt shadow-md hover:bg-[#E9EAF2]"
        aria-label="Scroll Right"
      >
        <IoIosArrowForward className="text-[1.4rem]" />
      </button>
    </div>
  );
};

export default CoursesCarousel;
