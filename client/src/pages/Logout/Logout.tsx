import { useState } from "react";
import LogoutMessage from "../Home/LogoutMessage/LogoutMessage";
import logoutBanner from "/images/logout-banner.jpg";
import udemyBusinessLogo from "/images/udemy-business-logo.png";

const Logout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  document.title = "udemy.com/logout/";

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const closestDiv = target.closest("div[id]");
    if (closestDiv) {
      const categoryName = closestDiv.id;
      setSelectedCategory(categoryName);
    }
  };

  return (
    <div className="mb-[2em] px-[2em]">
      <LogoutMessage />
      <img src={logoutBanner} alt="Logout banner" />
      <div className="col absolute right-[70%] top-[50%] flex w-[320px] items-center justify-start gap-[0.5em]">
        <div>
          <img
            src={udemyBusinessLogo}
            alt="Udemy business logo"
            className="absolute right-[7%] top-[-80%]"
          />
        </div>
        <div>
          <p className="text-[1.2em] font-medium">
            Your company can give you access to our top 27,000+ business and tech courses.
          </p>
          <div className="mt-[1em]">
            <button className="rounded-[0.2rem] bg-btnColor px-[0.5em] py-[0.7em] font-[lifeLtstd] font-sans text-sm font-extrabold text-white transition duration-150 hover:bg-[#892DE1] focus:outline-none">
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div className="mt-[2.5em] flex  items-start justify-start gap-[1.5em]" onClick={handleClick}>
        {[
          "business",
          "design",
          "photography-video",
          "marketing",
          "it-software",
          "personal-development",
        ].map((category) => (
          <div className="cursor-pointer pb-[0.5em]" id={category} key={category}>
            <b
              className={`text-gray-600 hover:text-black ${
                selectedCategory === category ? "font-sans font-extrabold !text-black" : ""
              }`}
            >
              {category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" & ")}
            </b>
            <hr
              className={`w-min-max relative bottom-0 border border-black ${
                selectedCategory === category ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default Logout;
