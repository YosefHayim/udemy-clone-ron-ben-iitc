import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import {
  calculateDiscountPercentage,
  calculateTotalSavings,
  setAddCourseToCart,
  setAmountOfCourses,
  setTotalCourseDiscountPrices,
  setTotalOriginalCoursePrices,
} from "@/redux/slices/cartSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader/Loader";

const BuyNowBtn: React.FC<{
  courseId: string;
  discountPrice: number;
  fullPrice: number;
}> = ({ courseId, discountPrice, fullPrice }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const cookie = useSelector((state: RootState) => state.user.cookie);

  const handleClick = (courseId: string) => {
    if (cookie) {
      setLoading(true);
      setTimeout(() => {
        dispatch(setAmountOfCourses());
        if (!discountPrice || isNaN(discountPrice)) {
          return;
        }
        dispatch(setTotalCourseDiscountPrices(Number(discountPrice)));
        dispatch(setTotalOriginalCoursePrices(Number(fullPrice)));
        dispatch(calculateTotalSavings());
        dispatch(calculateDiscountPercentage());
        dispatch(setAddCourseToCart(courseId));
        navigate("/payment/checkout/");
        setLoading(false);
      }, 500);
    } else {
      navigate("/login");
    }
  };
  return (
    <Button
      id={courseId}
      onClick={() => handleClick(courseId)}
      className={`w-full rounded-[0.2em] border border-purple-700 bg-white py-[1.5em] font-sans font-extrabold text-purple-700 hover:bg-hoverDivGray focus:outline-none`}
    >
      {isLoading ? <Loader hSize="" useSmallBlackLoading={true} /> : "Buy now"}
    </Button>
  );
};

export default BuyNowBtn;
