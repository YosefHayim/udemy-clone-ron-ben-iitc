import { IoFilterOutline } from "react-icons/io5";

const FilterBtn = ({ onFilterToggle }: { onFilterToggle?: () => void }) => {
  return (
    <div
      onClick={onFilterToggle}
      className="flex h-[5em] w-min cursor-pointer items-center gap-[0.1em] rounded-[0.2em] border border-gray-400 px-[0.5em] py-[1em] hover:bg-[#F6F7F9] lg:cursor-default lg:hover:bg-transparent"
    >
      <div>
        <IoFilterOutline />
      </div>
      <div>
        <b className="ml-[0.4em] font-sans text-base font-extrabold leading-[1.2]">Filter</b>
      </div>
    </div>
  );
};

export default FilterBtn;
