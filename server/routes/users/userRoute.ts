import express, { NextFunction, Request, Response } from "express";
import { grantedAccess } from "../../controllers/authorization/authController.ts";
import {
  getAllUsers,
  signUp,
  login,
  logout,
  deactivateUser,
  reactiveUser,
  getUserById,
  confirmEmailAddress,
  resendEmailVerificationToken,
  updateUserInfo,
  updateProfilePic,
  toggleCourseWishlist,
  verifyCode,
  googleLoginOrSignUp,
  updateMe,
  uploadUserPhoto,
  resizeUserPhoto,
  updatePersonalizeInfo,
} from "../../controllers/users/userController.ts";
const router = express.Router();

router.param("id", (req: Request, res: Response, next: NextFunction, val) => {
  next();
});

// get all users
router.get("/", getAllUsers);

// get user by is id
router.get("/:id", getUserById);

// refresh cookie data
router.post("/me", grantedAccess, updateMe);

// Verify user code either for login or for sign up.
router.post("/verify", verifyCode);

// Add or remove courses to wishlist
router.post("/course/wishlist/:id", grantedAccess, toggleCourseWishlist);

// verify email address of user auth
router.get("/email/verification", confirmEmailAddress);

// Google OAuth Callback Route
router.post("/google/auth/login", googleLoginOrSignUp);

// sign up
router.post("/auth/signup", signUp);

// resend verification email token
router.post(
  "/email/resend/verification",
  grantedAccess,
  resendEmailVerificationToken
);

// login regular
router.post("/auth/login", login);

// logout and clear cookie
router.post("/logout", grantedAccess, logout);

// reactivate "delete" account
router.post("/reactivate", reactiveUser);

// Personalize field update of user
router.post("/updatePersonalizeField", grantedAccess, updatePersonalizeInfo);

// update user information
router.put("/", grantedAccess, updateUserInfo);

// update user profile picture
router.patch(
  "/profile/picture",
  grantedAccess,
  uploadUserPhoto,
  resizeUserPhoto,
  updateProfilePic
);

// "delete" user account
router.delete("/", grantedAccess, deactivateUser);

export default router;
