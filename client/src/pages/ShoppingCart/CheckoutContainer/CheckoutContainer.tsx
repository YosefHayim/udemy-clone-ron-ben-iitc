import { Button } from "@/components/ui/button";
import CouponArea from "@/pages/ViewCoursePageInfo/CoursePreviewCard/CouponArea/CouponArea";
import { RootState } from "@/redux/store";
import { setRole } from "@/redux/slices/userSlice";
import { DecodedTokenProps } from "@/types/types";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CheckoutContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cookie = useSelector((state: RootState) => state.user.cookie);

  const totalToPay = useSelector((state: RootState) => state.cart.totalCourseDiscountPrices);

  const totalSavings = useSelector((state: RootState) => state.cart.totalSavings);

  const totalDiscountPercent = useSelector(
    (state: RootState) => state.cart.totalDiscountPercentage
  );

  useEffect(() => {}, [totalToPay, totalDiscountPercent, totalSavings]);

  const handleCheckout = () => {
    try {
      if (!cookie) {
        navigate("/login");
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode<DecodedTokenProps>(cookie);
      } catch (err: any) {
        navigate("/login");
        return;
      }

      const isLogged = dispatch(setRole(decoded?.role));
      if (!isLogged) {
        navigate("/login");
        return;
      }

      navigate("/payment/checkout/");
    } catch (err: any) {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-start justify-start gap-[1em]">
      <div className="mb-[0.5em] w-full text-start">
        <h3 className="font-sans text-[1.2em] font-extrabold text-weakGray">Total:</h3>
        <h2 className="font-sans text-[2em] font-extrabold">₪{totalToPay?.toFixed(2) || 0}</h2>
        <p className="text-gray-600 line-through">{totalSavings?.toFixed(2) || 0}</p>
        <p className="text-gray-600">{totalDiscountPercent}% off</p>
        <Button
          className="w-full rounded-[0.3em] bg-btnColor py-[1.7em] font-sans font-extrabold hover:bg-btnHoverColor"
          onClick={handleCheckout}
        >
          Proceed to Checkout
          <FaArrowRight />
        </Button>
        <p className="my-[0.5em] text-grayNavbarTxt">You wont be charged yet</p>
      </div>
      <hr className="w-full border border-gray-100" />
      <b>Promotions</b>
      <CouponArea btnBgDesign={"bg-btnColor hover:bg-btnHoverColor"} couponText="KEEPLEARNING" />
    </div>
  );
};

export default CheckoutContainer;
