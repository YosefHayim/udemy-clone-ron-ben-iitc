import Banner from "./Banner/Banner";
import Carousel from "./Carousel/Carousel";
import LearnersAreViewing from "./LearnersAreViewing/LearnersAreViewing";
import LearningGoals from "./LearningGoals/LearningGoals";
import LetsStartLearning from "./LetsStartLearning/LetsStartLearning";
import Menu from "@/components/Menu/Menu";
import PlansSection from "./PansSection/PansSection";
import { RootState } from "@/redux/store";
import SearchResult from "./SearchResult/SearchResult";
import Sections from "./Sections/Sections";
import Testimonials from "./Testimonials/Testimonials";
import TrendingNow from "./TrendingNow/TrendingNow";
import TrendsReport from "./TopTrends/TopTrends";
import TrustedBySection from "./TrustedBySection/TrustedBySection";
import Welcome from "@/components/LoggedInHome/Welcome";
import { searchAlgoLocalStorage } from "@/utils/searchesOfUser";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

const Homepage = () => {
  const isMobile = useMediaQuery({ maxWidth: 800 });
  searchAlgoLocalStorage("course");
  document.title = "Online Courses - Learn Anything, On Your Schedule | Udemy";
  const cookie = useSelector((state: RootState) => state.user.cookie);
  const rawSearches = localStorage.getItem("searchesOfUser");
  const parsedSearches: string[] = Array.isArray(JSON.parse(rawSearches || "[]"))
    ? JSON.parse(rawSearches || "[]").filter((s: unknown) => typeof s === "string")
    : [];

  const uniqueSearches = [...new Set(parsedSearches)];

  console.log(uniqueSearches);

  useEffect(() => {}, [cookie]);

  return (
    <div>
      {!isMobile && cookie && <Menu />}
      <div className="font-[lifeLtstd]">
        {!cookie ? (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="w-full max-w-[calc(100%-11.5rem)] overflow-clip">
              <Banner isLogin={false} />
            </div>
            <Sections />
            <div className="w-full max-w-[calc(100%-11.5rem)] overflow-clip">
              <TrustedBySection />
              <LearnersAreViewing randomAlgoWord={uniqueSearches[0]} />
              <SearchResult
                title={`Because you searched for "${uniqueSearches[1]}"`}
                randomAlgoWord={uniqueSearches[1]}
              />
              <LearningGoals />
              <PlansSection />
              <Testimonials />
              <TrendsReport />
              <TrendingNow />
              <Carousel />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="">
              <Welcome />
              <Banner isLogin={true} />
              <div className="mx-2">
                <LetsStartLearning />
                <h1 className="pl-4 font-extrabold">What to learn next</h1>
                <SearchResult
                  title={`Because you searched for "${uniqueSearches[2]}"`}
                  randomAlgoWord={uniqueSearches[2]}
                />
                <SearchResult
                  title={`Because you searched for "${uniqueSearches[3]}"`}
                  randomAlgoWord={uniqueSearches[3]}
                />
                <SearchResult
                  title={`Because you searched for "${uniqueSearches[4]}"`}
                  randomAlgoWord={uniqueSearches[4]}
                />
                <SearchResult
                  title={`Because you searched for "${uniqueSearches[5]}"`}
                  randomAlgoWord={uniqueSearches[5]}
                />
                <LearnersAreViewing randomAlgoWord={uniqueSearches[6]} />
                {uniqueSearches.slice(0, 5).map((search, index) => (
                  <SearchResult
                    key={index}
                    title={`Top courses in "${search}"`}
                    randomAlgoWord={search}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
