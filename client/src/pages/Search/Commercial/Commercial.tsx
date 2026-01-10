import ContainerImg from "./ContainerImg/ContainerImg";
import CommercialRecap from "./CommercialRecap/CommercialRecap";

const Commercial = () => {
  return (
    <div className="mb-2 flex w-full max-w-full items-start justify-between gap-[0.5em] overflow-hidden border border-borderCommercial bg-bgCommercial text-[0.8rem]">
      <div className="flex w-full flex-col items-start justify-start sm:flex-row">
        <div className="hidden sm:block">
          <ContainerImg />
        </div>
        <CommercialRecap />
      </div>
    </div>
  );
};

export default Commercial;
