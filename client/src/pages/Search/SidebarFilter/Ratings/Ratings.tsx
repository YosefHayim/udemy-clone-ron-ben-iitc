import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import getRatingStatsBySearch from "@/api/courses/getRatingStatsBySearchTerm";
import { FilterContext } from "@/contexts/FilterSearch";
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

const ratings = [
  { rating: "★★★★½", value: 4.5, count: "4,394" },
  { rating: "★★★★☆", value: 4.0, count: "8,757" },
  { rating: "★★★½☆", value: 3.5, count: "9,900" },
  { rating: "★★★☆☆", value: 3, count: "10,000" },
];

const RatingsFilter = () => {
  const [isClicked, setClicked] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { setRatings, filterData } = useContext(FilterContext);

  // Sync selectedRating with filterData on mount
  useEffect(() => {
    setSelectedRating(filterData.ratings || null);
  }, [filterData.ratings]);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setRatings(rating);
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setClicked((prev) => !prev);
  };

  // const { data } = useQuery({
  //   queryKey: ["ratingsOfSearch", filterData.searchTerm],
  //   queryFn: () => getRatingStatsBySearch(filterData.searchTerm),
  //   enabled: !!filterData.searchTerm,
  // });

  // if (!data) {
  //   return;
  // }

  return (
    <div>
      <hr />
      <div className={`overflow-hidden transition-all ${isClicked ? "h-auto" : "h-[50px]"}`}>
        <div className="flex cursor-pointer items-center justify-between" onClick={handleClick}>
          <p className="py-[0.5em] font-sans text-lg font-extrabold">Ratings</p>
          {isClicked ? <MdKeyboardArrowUp size={17} /> : <MdOutlineKeyboardArrowDown size={17} />}
        </div>
        <div className={`${isClicked ? "block" : "hidden"}`}>
          {ratings.map(({ rating, value, count }) => (
            <label key={value} className="flex cursor-pointer items-center space-x-2 py-2">
              <span
                onClick={() => handleRatingClick(value)}
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  selectedRating === value ? "border-black" : "border-gray-600"
                }`}
              >
                {selectedRating === value && (
                  <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
                )}
              </span>
              <div className="flex ">
                <span className="flex items-center">
                  <span className="text-sm text-[#C4710D]">{rating}</span>
                  <span className="ml-1 text-sm text-gray-600">{value} & up</span>
                </span>
                <span className="ml-2 text-sm text-gray-500">{`(${count})`}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsFilter;
