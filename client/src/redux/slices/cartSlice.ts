import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    isShowCart: false,
    amountOfCourses: 0,
    coursesAddedToCart: [] as string[],
    coursesAddedToWishList: [] as string[],
    totalCourseDiscountPrices: 0,
    totalCoursesOriginalPrices: 0,
    totalSavings: 0, // Total amount saved
    totalDiscountPercentage: 0, // Total percentage off
  },

  reducers: {
    setClearAll: (state) => {
      state.isShowCart = false;
      state.amountOfCourses = 0;
      state.coursesAddedToCart = [];
      state.coursesAddedToWishList = [];
      state.totalCourseDiscountPrices = 0;
      state.totalCoursesOriginalPrices = 0;
      state.totalSavings = 0;
      state.totalDiscountPercentage = 0;
    },
    setShowCart: (state, action: PayloadAction<boolean>) => {
      state.isShowCart = action.payload;
    },
    setAmountOfCourses: (state) => {
      state.amountOfCourses += 1;
    },
    setAddCourseToCart: (state, action: PayloadAction<string>) => {
      // Prevent duplicate course additions
      state.coursesAddedToCart = Array.from(new Set([...state.coursesAddedToCart, action.payload]));
    },
    setCoursesAddedToWishList: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;

      if (state.coursesAddedToWishList.includes(courseId)) {
        // Remove course from wishlist
        state.coursesAddedToWishList = state.coursesAddedToWishList.filter((id) => id !== courseId);
      } else {
        // Add course to wishlist
        state.coursesAddedToWishList.push(courseId);
      }
    },

    setTotalOriginalCoursePrices: (state, action: PayloadAction<number>) => {
      if (!action.payload || isNaN(action.payload)) {
        return;
      }
      state.totalCoursesOriginalPrices += action.payload; // Add original price
    },

    setTotalCourseDiscountPrices: (state, action: PayloadAction<number>) => {
      if (!action.payload || isNaN(action.payload)) {
        return;
      }
      state.totalCourseDiscountPrices += action.payload; // Add discounted price
    },
    calculateTotalSavings: (state) => {
      state.totalSavings = state.totalCoursesOriginalPrices - state.totalCourseDiscountPrices;

      if (state.totalSavings < 0) {
        state.totalSavings = 0; // Prevent negative savings
      }
    },
    calculateDiscountPercentage: (state) => {
      if (state.totalCoursesOriginalPrices > 0) {
        state.totalDiscountPercentage = Math.round(
          (state.totalSavings / state.totalCoursesOriginalPrices) * 100
        );
      } else {
        state.totalDiscountPercentage = 0; // Avoid division by zero
      }
    },
    removeCourseFromCart: (
      state,
      action: PayloadAction<{
        courseId: string;
        originalPrice: number;
        discountPrice: number;
      }>
    ) => {
      const { courseId, originalPrice = 0, discountPrice = 0 } = action.payload;

      if (!courseId) {
        return;
      }

      // Remove the course from the cart
      state.coursesAddedToCart = state.coursesAddedToCart.filter((id) => id !== courseId);

      if (state.amountOfCourses > 0) {
        state.amountOfCourses -= 1;
      }

      state.totalCoursesOriginalPrices = Math.max(
        0,
        state.totalCoursesOriginalPrices - originalPrice
      );

      state.totalCourseDiscountPrices = Math.max(
        0,
        state.totalCourseDiscountPrices - discountPrice
      );

      // Recalculate total savings and percentage discount
      state.totalSavings = state.totalCoursesOriginalPrices - state.totalCourseDiscountPrices;

      if (state.totalCoursesOriginalPrices > 0) {
        state.totalDiscountPercentage = Math.round(
          (state.totalSavings / state.totalCoursesOriginalPrices) * 100
        );
      } else {
        state.totalDiscountPercentage = 0;
      }

      // Reset totals if the cart is empty
      if (state.coursesAddedToCart.length === 0) {
        state.totalCoursesOriginalPrices = 0;
        state.totalCourseDiscountPrices = 0;
        state.amountOfCourses = 0;
        state.totalSavings = 0;
        state.totalDiscountPercentage = 0;
      }
    },
  },
});

export const {
  setClearAll,
  setShowCart,
  calculateTotalSavings,
  calculateDiscountPercentage,
  setAmountOfCourses,
  setAddCourseToCart,
  setTotalOriginalCoursePrices,
  setTotalCourseDiscountPrices,
  removeCourseFromCart,
  setCoursesAddedToWishList,
} = cartSlice.actions;
export default cartSlice.reducer;
