import { isProduction, baseUrl, localhostUrl } from "@/api/configuration";

const CourseImg: React.FC<{
  courseImg?: string;
  widthChosen?: string;
  standCardView?: boolean;
  imgExplanation?: string;
}> = ({ courseImg, widthChosen, standCardView, imgExplanation = "" }) => {
  return (
    <div className="shrink-0 border">
      <img
        src={courseImg}
        alt={imgExplanation}
        className="h-auto w-[100px] object-cover sm:w-[150px] md:w-[200px]"
        style={widthChosen ? { width: widthChosen } : undefined}
      />
    </div>
  );
};

export default CourseImg;
