import { FilterContext } from "@/contexts/FilterSearch";
import { getPageNumbers } from "@/utils/getPageNumbersAlgo";
import { useContext } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const PaginationPages: React.FC<{ totalPages: number; useScrollRef }> = ({
  totalPages,
  useScrollRef,
}) => {
  const { filterData, setPage } = useContext(FilterContext);

  const currentPage = filterData.page;

  if (!currentPage || totalPages < 1) return null;

  const updatePage = (newPage: number) => {
    setPage(newPage);
    useScrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      updatePage(currentPage + 1);
      useScrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      updatePage(currentPage - 1);
      useScrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mt-[2em] flex flex-wrap items-center justify-center gap-2 sm:gap-[1em]">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`rounded-[100em] border border-[#6D28D2] p-[0.5em] hover:bg-hoverDivGray focus:outline-none ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <MdKeyboardArrowLeft size={24} className="text-[#6D28D2]" />
      </button>

      <div className="flex items-center gap-[0.5em] text-[#6D28D2]">
        {getPageNumbers(currentPage, totalPages).map((page, index) => (
          <b
            key={index}
            className={`rounded-[0.2em] p-[0.5em] text-[1rem] hover:bg-purpleHoverBtn 
              ${
                currentPage === page
                  ? "relative font-sans font-extrabold text-[#6D28D2] before:absolute before:bottom-2 before:left-[0.25rem] before:right-[0.2rem] before:h-[0.15rem] before:bg-purple-900"
                  : page === totalPages
                    ? "font-sans font-extrabold text-[#303141]"
                    : ""
              }
              ${page === "..." ? "cursor-default text-gray-500" : "cursor-pointer"}
            `}
            onClick={() => updatePage(page)}
          >
            {page === "..." ? (
              <span className="font-sans font-extrabold tracking-[0.1em] text-[#303141]">...</span>
            ) : (
              page
            )}
          </b>
        ))}
      </div>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`rounded-[100em] border border-[#6D28D2] p-[0.5em] hover:bg-hoverDivGray focus:outline-none ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <MdKeyboardArrowRight size={24} className="text-[#6D28D2]" />
      </button>
    </div>
  );
};

export default PaginationPages;
