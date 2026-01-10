import { useContext } from "react";
import FilterBtn from "./FilterBtn/FilterBtn";
import SortDropDown from "./SortDropDown/SortDropDown";
import { FilterContext } from "@/contexts/FilterSearch";

const defaultFilters = {
  sortBy: "",
  handsOnPractice: new Set(),
  language: new Set(),
  levels: new Set(),
  price: "",
  ratings: 0,
  subtitles: new Set(),
  topics: new Set(),
  videosDurations: new Set(),
  certificateOnly: false,
  searchTerm: "",
  page: 1,
  limit: 20,
};

const convertToComparable = (filters) =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        value instanceof Set ? [...value] : value,
      ])
    )
  );

const FilterNSort = ({
  coursesResults,
  searchTerm,
  onFilterToggle,
}: {
  coursesResults: number;
  searchTerm: string;
  onFilterToggle?: () => void;
}) => {
  const { filterData, setFilterData } = useContext(FilterContext);

  const isFiltersDefault = convertToComparable(filterData) === convertToComparable(defaultFilters);

  return (
    <div className="flex w-full flex-col-reverse items-start justify-start">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <FilterBtn onFilterToggle={onFilterToggle} />
          <SortDropDown />
          {!isFiltersDefault && (
            <div className="flex items-center">
              <span
                className="cursor-pointer whitespace-nowrap font-sans text-sm font-extrabold text-purpleStatic hover:text-purpleHover sm:text-base"
                onClick={() => setFilterData(filterData)}
              >
                Clear filters
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="whitespace-nowrap font-sans text-sm font-extrabold text-[#595C73] sm:text-[1rem]">
            {coursesResults} results
          </p>
        </div>
      </div>
      <div className="mb-2 flex w-full flex-col items-start justify-center">
        <h1 className="my-2 text-start font-sans text-lg font-extrabold sm:my-3 sm:text-2xl">
          {coursesResults} results for "{searchTerm}"
        </h1>
      </div>
    </div>
  );
};

export default FilterNSort;
