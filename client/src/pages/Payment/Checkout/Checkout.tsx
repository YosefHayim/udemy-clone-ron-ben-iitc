import buyCourseById from "@/api/courses/buyCourseId";
import refreshMe from "@/api/users/refreshMe";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoMdLock } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserInformation } from "@/utils/setUserInformation";
import { setClearAll } from "@/redux/slices/cartSlice";
import { initializeCourseProgress } from "@/services/ProgressService";

const Checkout: React.FC<{ isPaypal: ReactPayPalScriptOptions }> = ({ isPaypal }) => {
  const [isLoading, setLoading] = useState(false);
  const [navigateFirstCourseBought, setNavigateFirstCourseBought] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalToPay = useSelector((state: RootState) => state.cart?.totalCourseDiscountPrices);
  const totalCourses = useSelector((state: RootState) => state.cart?.amountOfCourses);
  const originalPrice = useSelector((state: RootState) => state.cart?.totalCoursesOriginalPrices);
  const coursesIds = useSelector((state: RootState) => state.cart?.coursesAddedToCart);

  useEffect(() => {}, [originalPrice, totalCourses, totalToPay]);

  const checkOutMutation = useMutation({
    mutationFn: buyCourseById,
    onSuccess: () => {
      dispatch(setClearAll());
      setTimeout(() => {
        refreshUserDataMutation.mutate();
      }, 1000);
    },
  });

  const refreshUserDataMutation = useMutation({
    mutationFn: refreshMe,
    onSuccess: (data) => {
      setUserInformation(data.token, dispatch);
      setTimeout(() => {
        navigate(`/course-view/${navigateFirstCourseBought}`);
      }, 1000);
    },
  });

  const handleClick = async () => {
    if (!coursesIds.length) {
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 2000);

    if (coursesIds.length === 1) {
      const courseId = coursesIds[0];
      if (!courseId) {
        return;
      }
      checkOutMutation.mutate(courseId);
      await initializeCourseProgress(courseId);
      setNavigateFirstCourseBought(courseId);
    } else {
      checkOutMultiMutation.mutate(coursesIds);
      setNavigateFirstCourseBought(coursesIds[0]);
      return Promise.all(coursesIds.map((id) => initializeCourseProgress(id)));
    }
  };

  const checkOutMultiMutation = useMutation({
    mutationFn: async (courseIds: string[]) => {

      return Promise.all(
        courseIds.map(async (id) => {
          buyCourseById(id);
        })
      );
    },
    onSuccess: async () => {
      dispatch(setClearAll());
      setTimeout(() => {
        refreshUserDataMutation.mutate();
      }, 1000);
    },
  });

  return (
    <div className="w-min-max flex flex-col items-start justify-start p-[3em]">
      <div className="flex w-full flex-col items-start justify-start">
        <h2 className="mb-[1em] w-full font-sans text-[1.5em] font-extrabold">Order Summary</h2>
        <div className="flex w-[75%] flex-col items-start justify-start gap-[0.5em]">
          <div className="flex w-full  items-start justify-between gap-[5em]">
            <p>Original price:</p>
            <p>₪{originalPrice || 0}</p>
          </div>
          <hr className="w-full border border-b-gray-400" />
          <div className="mb-[3em] flex w-full  items-start justify-between">
            <div className="flex  gap-[0.3em]">
              <b>Total</b>
              <p>({totalCourses} course)</p>
            </div>
            {isPaypal ? <b>Proceed</b> : <b>₪{totalToPay?.toFixed(2) || 0}</b>}
          </div>
        </div>
        <div className="mb-[1em] w-[75%]">
          <p>
            By completing your purchase you agree to these{" "}
            <span className="text-btnColor">Terms of Service.</span>
          </p>
        </div>
        <div className="mb-[2em] w-[75%]">
          <Button
            onClick={handleClick}
            className="w-full rounded-[0.2em] bg-btnColor p-[1.7em] font-sans font-extrabold text-white hover:bg-[#892de1]"
          >
            {isLoading ? (
              <div>
                <Loader useSmallLoading={true} hSize="" />
              </div>
            ) : (
              <div className="flex  items-center">
                <IoMdLock />
                Pay ₪{totalToPay?.toFixed(2) || 0}
              </div>
            )}
          </Button>
        </div>
        <div className="mb-[3em] flex w-[75%] flex-col items-center justify-center gap-[1em]">
          <b>30-Day Money-Back Guarantee</b>
          <p className="text-center">
            Not satisfied? Get a full refund within 30 days. Simple and straightforward!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
