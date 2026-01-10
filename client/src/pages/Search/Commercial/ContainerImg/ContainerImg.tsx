import commercialImg from "/images/commercial-img.png";

const ContainerImg = () => {
  return (
    <div className="shrink-0">
      <img src={commercialImg} alt="" className="w-[200px] object-cover lg:w-[27em]" />
    </div>
  );
};

export default ContainerImg;
