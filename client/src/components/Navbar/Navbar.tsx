import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput/SearchInput";
import LoginBtn from "./LoginBtn/LoginBtn";
import SignupBtn from "./SignupBtn/SignupBtn";
import Cart from "./Cart/Cart";
import Logo from "../Logo/Logo";
import ButtonNavbar from "../ButtonNavbar/ButtonNavbar";
import Heart from "./Heart/Heart";
import Notifications from "./Notifications/Notifications";
import Profile from "./Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CategoriesMenu from "./Categories/CategoriesMenu";
import ChangeLanguage from "./DropDownMenu/ChangeLanguage/ChangeLanguage";
import SaleCommercialTwo from "./SaleCommercials/SaleCommercialTwo/SaleCommercialTwo";
import { useMediaQuery } from "react-responsive";
import MobileNavbar from "../MobileNavbar/MobileNavbar";

const Navbar = () => {
  const isMobile = useMediaQuery({ maxWidth: 800 });
  const isTablet = useMediaQuery({ minWidth: 801, maxWidth: 1200 });
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const cookie = useSelector((state: RootState) => state?.user?.cookie);
  const coursesInCart =
    useSelector((state: RootState) => state?.cart?.coursesAddedToCart) ||
    useSelector((state: RootState) => state?.cart?.coursesAddedToWishList);

  const coursesInProgress = useSelector((state: RootState) => state?.user?.coursesInProgress);

  useEffect(() => {
    const body = document.querySelector("body");
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const courseId = target.closest("div")?.id;
      if (courseId) {
        navigate(`/course-view/${courseId}`);
        setIsTyping(false);
        return;
      } else {
        setIsTyping(false);
      }
    };

    body.addEventListener("click", handleClick);

    return () => {
      body.removeEventListener("click", handleClick);
    };
  });

  useEffect(() => {}, [cookie]);

  return (
    <div className="w-full">
      {/* <SaleCommercial />dasdsa */}
      {!isMobile && <SaleCommercialTwo />}
      {!isMobile && (
        <div
          className={`relative z-[50] flex w-full items-center justify-between bg-white pb-[0.9em] pl-[1.7rem] pr-[0.5rem] pt-[0.2em] 
          ${"shadow-md shadow-[#bcc0ce]"}`}
        >
          <div className="flex w-full items-center justify-between gap-2 pl-[0rem] pt-[0.4rem]">
            <Link to="/" className="shrink-0">
              <Logo />
            </Link>
            <div className="shrink-0">
              <CategoriesMenu />
            </div>
            <div className="min-w-0 flex-1 px-1">
              <SearchInput isTyping={isTyping} setIsTyping={setIsTyping} />
            </div>
            <div className="flex shrink-0 items-center justify-end gap-1">
              {!isTablet && (
                <>
                  <ButtonNavbar
                    buttonName={"Udemy Business"}
                    insideBtnText="Try Udemy Business"
                    paragraphText="Get your team access to over 27,000 top Udemy courses, anytime, anywhere."
                    to="/demo-business"
                  />
                  <ButtonNavbar
                    buttonName={"Teach on Udemy"}
                    paragraphText="Turn what you know into an opportunity and reach millions around the world."
                    to="/teaching/?ref=teach_header"
                    insideBtnText="Learn more"
                  />
                </>
              )}
              {cookie && !isTablet && (
                <Link to="/wishlist">
                  <ButtonNavbar
                    to="/wishlist"
                    buttonName={"My learning"}
                    insideBtnText="Go to my learning"
                    coursesInProgress={coursesInProgress}
                  />
                </Link>
              )}
              {cookie && (
                <div className="flex items-center">
                  <Heart />
                </div>
              )}
              <Link to="/cart">
                <div className="relative mr-[0.3rem] flex items-center">
                  <Cart />
                </div>
              </Link>
              <div className="flex items-center justify-around gap-[0.9rem]">
                {cookie && (
                  <div className="flex items-center">
                    <Notifications />
                  </div>
                )}
                {!cookie && (
                  <div className="flex flex-row gap-2">
                    <LoginBtn />
                    <SignupBtn />
                  </div>
                )}
              </div>
              {cookie && (
                <Link to="/user/edit-profile">
                  <div className="relative inline-block">
                    <Profile cookie={cookie} />
                    {coursesInCart.length >= 1 && (
                      <div className="absolute right-[28.5%] top-[5%] z-10 h-[0.85rem] w-[0.85rem] rounded-full bg-[#A435F0]"></div>
                    )}
                  </div>
                </Link>
              )}
              {!cookie && (
                <div className="mx-2">
                  <ChangeLanguage
                    size={20}
                    isClicked={isClicked}
                    setClicked={setClicked}
                    showIcon={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="w-full">
          {isTyping && <div className="absolute left-0 top-0 z-50 h-screen w-full bg-white"></div>}
          <MobileNavbar isTyping={isTyping} setIsTyping={setIsTyping} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
