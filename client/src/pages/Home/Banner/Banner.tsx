import { useEffect, useState } from "react";
import ButtonsCarousel from "@/components/ButtonsCarousel/ButtonsCarousel";
import { getBanners } from "@/utils/banners";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Banner: React.FC<{ isLogin?: boolean }> = ({ isLogin }) => {
  const coursesBoughtOrJoined = useSelector((state: RootState) => state?.user?.coursesBought);
  const fullName = useSelector((state: RootState) => state.user.fullName);
  const registerAt = useSelector((state: RootState) => state.user.whenCreated);

  const banners = getBanners({
    coursesBoughtOrJoined,
    fullName,
    registerAt,
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // This one is creating infinite banners to scroll from the banners base which we just add to it and thats it.
  const generatedBanners = Array.from({ length: (currentIndex + 1) * 2 }, (_, i) => {
    return banners[i % banners.length];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-0 w-full overflow-hidden">
      <ButtonsCarousel
        state={currentIndex}
        leftPosition="1%"
        topPosition="43%"
        rightPosition="2%"
        useCustom={false}
        handleFnNext={handleNext}
        handleFnPrev={handlePrev}
      />

      <div className="relative h-full w-full overflow-hidden">
        <div
          className={`flex transition-transform duration-1000 ease-in-out`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {generatedBanners.map((banner, index) => (
            <div key={index} className="relative w-full flex-shrink-0">
              <img src={banner.src} alt={`banner-${index}`} className="w-full" />
              <div className="absolute left-16 top-16 bg-white px-5 py-7 shadow"></div>
              {banner.content && banner.content()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
