import ButtonsCarousel from "@/components/ButtonsCarousel/ButtonsCarousel";
import HotCourseCard from "./HotCourseCard/HotCourseCard";
import { memo, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getAllCourses from "@/api/courses/getAllCourses";
import Loader from "@/components/Loader/Loader";
import { FilterContext } from "@/contexts/FilterSearch";
import { useSearchParams } from "react-router-dom";

const HotFreshCourses = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm: string | null = searchParams.get("q")?.toLowerCase();
  const { filterData, setSortBy } = useContext(FilterContext);

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotFreshCourses", searchTerm.toLowerCase(), filterData.page, filterData],
    queryFn: () => {
      if (!searchTerm) {
        throw new Error("Course ID is undefined");
      }
      return getAllCourses(searchTerm, filterData, filterData.limit, filterData.page);
    },
    enabled: !!searchTerm,
  });

  if (isLoading) {
    return <Loader hSize="100" useSmallLoading={false} />;
  }

  if (isError) {
    return <div>Error: Unable to fetch data</div>;
  }

  return (
    <div className="w-full max-w-full">
      <h2 className="my-[0.5em] font-sans text-[1.5em] font-extrabold">Hot and Fresh Courses</h2>
      <div className="relative w-full overflow-hidden">
        {data?.response && data?.response.length > 7 && (
          <ButtonsCarousel
            handleFnNext={handleNext}
            handleFnPrev={handlePrev}
            state={currentIndex}
            useCustom={true}
            showDirectionalButtonsOnlyOnEdge={false}
            topPosition="40%"
            leftPosition="1%"
            rightPosition="2%"
          />
        )}

        <div
          className={`flex ${data.response && data.response?.length > 7 ? "w-max items-center justify-center" : "w-full items-center justify-center"}  z-20 h-full gap-4 pb-2 transition-transform duration-1000 ease-in-out`}
          style={{
            transform: `translateX(-${currentIndex * 30.5}%)`,
          }}
        >
          {data && data?.response?.length >= 1 ? (
            data?.response?.map((hotCourseAlgo) => (
              <HotCourseCard hotCourseAlgo={hotCourseAlgo} key={hotCourseAlgo._id} />
            ))
          ) : (
            <div className="w-full">
              <Loader useSmallLoading={false} hSize="" />
            </div>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
};

export default memo(HotFreshCourses);
