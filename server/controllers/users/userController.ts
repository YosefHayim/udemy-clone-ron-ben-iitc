import Course from "../../models/courses/courseModel.ts";
import User from "../../models/users/userModel.ts";
import APIFeatures from "../../utils/apiFeatures.ts";
import sendEmail from "../../utils/email.ts";
import createError from "../../utils/errorFn.ts";
import loginEmailTemplateLiteral from "../../utils/loginEmailTemplateLiteral.ts";
import signUpCodeTemplate from "../../utils/signUpEmailTemplateLiteral.ts";
import catchAsync from "../../utils/wrapperFn.ts";
import randomize from "randomatic";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import sharp from "sharp";
import { NextFunction, Request, Response } from "express";
import { generateToken } from "../authorization/authController.ts";
dotenv.config();

// for updating user profile
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/imgs/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(createError(`Please upload only images`, 400), false);
  }
};

// multer instance should be initialized after defining storage and filter
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadUserPhoto = upload.single("photo");

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const users = await features.getQuery();

    if (!users || users.length === 0) {
      return next(createError("No users documents found in the database", 404));
    }

    res.status(200).json({
      status: "Success",
      totalUsers: users.length,
      response: users,
    });
  }
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId) {
      return next(createError("Please provide ID in the URL.", 400));
    }

    const findUser = await User.findOne({ _id: userId });

    if (!findUser) {
      return next(createError("There is no such user in the database.", 404));
    }

    res.status(200).json({
      status: "success",
      data: findUser,
    });
  }
);

const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get full name and email
    const { fullName, email } = req.body;

    // If one of the fields is missing
    if (!fullName || !email) {
      return next(createError("One of the required fields is missing.", 400));
    }

    // Locating the user if it is already exist in db
    const user = await User.findOne({ email });

    if (user) {
      return next(
        createError(
          "The email you entered is already in use. Please try logging in.",
          400
        )
      );
    }

    // Create user if it is not exist.
    const newUser = await User.create({
      fullName,
      email,
    });

    // Generate sign up token
    const signUpCode = +randomize("0", 6);

    // Set token and expire within 15 min.
    newUser.temporaryCode = signUpCode;
    newUser.temporaryCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await newUser.save();

    // Send email with 6 PIN DIGITS.
    sendEmail({
      to: newUser.email,
      subject:
        "Udemy Signup: Here's the 6-digit verification code you requested",
      html: signUpCodeTemplate(newUser.fullName, signUpCode),
    });

    const token = await generateToken({
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      bio: newUser.bio,
      role: newUser.role,
      coursesBought: newUser.coursesBought?.map((id: any) => id.toString()) || [],
      udemyCredits: newUser.udemyCredits,
      userLinks: newUser.links,
      language: newUser.preferredLanguage,
      headline: newUser.headline,
      fieldLearning: newUser.fieldLearning,
      isLoggedPreviouslyWithGoogle: newUser.isLoggedPreviouslyWithGoogle,
      whenCreated: newUser.createdAt?.toISOString?.() || newUser.createdAt,
      whenUpdated: newUser.updatedAt?.toISOString?.() || newUser.updatedAt,
      isAuthActivated: newUser.isAuthActivate,
    });

    // We do not send cookie on login only on Verify code.
    // res.cookie("cookie", token, {
    //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //   secure: process.env.NODE_ENV === "production",
    //   httpOnly: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 90 * 24 * 60 * 60 * 1000,
    // });

    res.status(200).json({
      codeVerification: signUpCode,
      status: "success",
      message:
        "User created successfully. Please confirm your email to log in.",
      // token,
    });
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    if (!email) {
      return next(createError("Email is missing.", 400));
    }

    const isFoundUser = await User.findOne({ email });

    if (!isFoundUser) {
      return next(
        createError(
          "There was a problem logging in. Check your email or create an account.",
          401
        )
      );
    }

    const loginCode = +randomize("0", 6);
    isFoundUser.temporaryCode = loginCode;
    isFoundUser.temporaryCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await isFoundUser.save();

    sendEmail({
      to: isFoundUser.email,
      subject:
        "Udemy Login: Here's the 6-digit verification code you requested",
      html: loginEmailTemplateLiteral(isFoundUser.fullName, loginCode),
    });

    if (!isFoundUser.emailVerified) {
      res.status(200).json({
        codeVerification: loginCode,
        status: "success",
        message: "Login successful. Please verify your email address.",
      });
      return;
    }

    const token = await generateToken({
      id: isFoundUser._id.toString(),
      fullName: isFoundUser.fullName,
      email: isFoundUser.email,
      profilePic: isFoundUser.profilePic,
      bio: isFoundUser.bio,
      role: isFoundUser.role,
      coursesBought: isFoundUser.coursesBought?.map((id: any) => id.toString()) || [],
      udemyCredits: isFoundUser.udemyCredits,
      userLinks: isFoundUser.links,
      language: isFoundUser.preferredLanguage,
      headline: isFoundUser.headline,
      fieldLearning: isFoundUser.fieldLearning,
      isLoggedPreviouslyWithGoogle: isFoundUser.isLoggedPreviouslyWithGoogle,
      whenCreated: isFoundUser.createdAt?.toISOString?.() || isFoundUser.createdAt,
      whenUpdated: isFoundUser.updatedAt?.toISOString?.() || isFoundUser.updatedAt,
      isAuthActivated: isFoundUser.isAuthActivate,
    });

    // We do not send cookie on login only on Verify code.
    // res.cookie("cookie", token, {
    //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //   secure: process.env.NODE_ENV === "production",
    //   httpOnly: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 90 * 24 * 60 * 60 * 1000,
    // });

    res.status(200).json({
      codeVerification: loginCode,
      status: "success",
      message: "Login verified proceed to code verification.",
      // token,
    });
  }
);

const verifyCode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, email } = req.body;

    const user = await User.findOne({ email });

    if (!code && user) {
      // Generate sign up token
      const regenerateCode = +randomize("0", 6);

      // Set token and expire within 15 min.
      user.temporaryCode = regenerateCode;
      user.temporaryCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      // Send email with 6 PIN DIGITS.
      sendEmail({
        to: user.email,
        subject:
          "Udemy Signup: Here's the 6-digit verification code you requested",
        html: signUpCodeTemplate(user.fullName, regenerateCode),
      });
    }

    if (!user) {
      return next(createError("Invalid email or code, please try again.", 404));
    }

    if (user.temporaryCode !== Number(code))
      return next(createError("Invalid or expired code.", 401));

    if (user.emailVerified === false) {
      user.emailVerified = true;
      await user.save();
    }

    if (
      user.temporaryCodeExpiresAt &&
      user.temporaryCodeExpiresAt.getTime() < Date.now()
    ) {
      return next(createError("Verification code expired.", 401));
    }

    user.temporaryCode = undefined;
    user.temporaryCodeExpiresAt = undefined;
    await user.save();

    const token = await generateToken({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      role: user.role,
      coursesBought: user.coursesBought?.map((id: any) => id.toString()) || [],
      udemyCredits: user.udemyCredits,
      userLinks: user.links,
      language: user.preferredLanguage,
      headline: user.headline,
      fieldLearning: user.fieldLearning,
      isLoggedPreviouslyWithGoogle: user.isLoggedPreviouslyWithGoogle,
      whenCreated: user.createdAt?.toISOString?.() || user.createdAt,
      whenUpdated: user.updatedAt?.toISOString?.() || user.updatedAt,
      isAuthActivated: user.isAuthActivate,
    });

    res.cookie("cookie", token, {
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      status: "success",
      message: "Code verified successfully. You are now logged in.",
      token,
    });
  }
);

const confirmEmailAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token;

    if (req.user.emailVerified) {
      res.status(200).json({
        status: "Success",
        message: "Your email has been already verified.",
      });
      return;
    }

    // Check if the token matches and hasn't expired
    if (
      req.user.emailVerificationToken === token &&
      req.user.emailVerificationExpires > Date.now()
    ) {
      req.user.emailVerified = true;
      req.user.emailVerificationToken = undefined;
      req.user.emailVerificationExpires = undefined;
      await req.user.save();

      sendEmail({
        to: req.user.email,
        subject: "Your account has been verified",
        html: `<p>enjoy udemy`,
      });

      res.status(200).json({
        status: "success",
        message: "Email successfully verified!",
        token,
      });
    }
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("cookie", "", {
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      status: "success",
      message: "User logged out successfully.",
    });
  }
);

const deactivateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const findUser = req.user;

    if (!findUser || !findUser._id) {
      return next(createError("The user doesn't exist in the database.", 404));
    }

    findUser.active = false;
    await findUser.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "User has been successfully deactivated.",
    });
  }
);

const reactiveUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email.trim();

    if (!email) {
      return next(createError("Wrong email provided.", 400));
    }

    const findUser = await User.findOne({
      email,
      active: false,
    });

    if (!findUser) {
      return next(
        createError(`No inactive user found with this email: ${email}`, 404)
      );
    }

    findUser.active = true;
    await findUser.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      response: "User has been successfully reactivated.",
    });
  }
);

const resendEmailVerificationToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    if (!email) {
      return next(
        createError(
          "You must provide an email to receive a new verification token.",
          400
        )
      );
    }

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return next(createError("No such email exists.", 404));
    }

    if (findUser.emailVerified) {
      return next(createError("Email is already verified.", 400));
    }

    await findUser.save();

    sendEmail({
      to: findUser.email,
      subject: "Verify Your Email",
      text: `Your email verification token is: ${findUser.emailVerificationToken}`,
      html: `<p>Use the following token to verify your email: <b>${findUser.emailVerificationToken}</b></p>`,
    });

    res.status(200).json({
      status: "success",
      message:
        "A new email verification token has been sent to your email address.",
    });
  }
);

const updateUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      fullName,
      headline,
      bio,
      country,
      email,
      preferredLanguage,
      links: { website, xPlatform, facebook, linkedin, youtube } = {},
      isAuthActivate,
    } = req.body;

    console.log(req.body);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        headline,
        bio,
        email,
        preferredLanguage,
        links: {
          website,
          xPlatform,
          facebook,
          linkedin,
          youtube,
          isAuthActivate,
          country,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(createError("User not found.", 404));
    }

    const token = await generateToken({
      id: updatedUser._id.toString(),
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      bio: updatedUser.bio,
      role: updatedUser.role,
      coursesBought: updatedUser.coursesBought?.map((id: any) => id.toString()) || [],
      udemyCredits: updatedUser.udemyCredits,
      userLinks: updatedUser.links,
      language: updatedUser.preferredLanguage,
      headline: updatedUser.headline,
      fieldLearning: updatedUser.fieldLearning,
      isLoggedPreviouslyWithGoogle: updatedUser.isLoggedPreviouslyWithGoogle,
      whenCreated: updatedUser.createdAt?.toISOString?.() || updatedUser.createdAt,
      whenUpdated: updatedUser.updatedAt?.toISOString?.() || updatedUser.updatedAt,
      isAuthActivated: updatedUser.isAuthActivate,
    });

    res.cookie("cookie", token, {
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
        token,
      },
    });
  }
);

const resizeUserPhoto = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/users/${req.file.filename}`);
  next();
};

const updateProfilePic = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(createError("Please upload an image.", 400));
    }

    // Construct image path
    const profilePic = `/imgs/users/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(createError("User not found.", 404));
    }

    const token = await generateToken({
      id: updatedUser._id.toString(),
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      bio: updatedUser.bio,
      role: updatedUser.role,
      coursesBought: updatedUser.coursesBought?.map((id: any) => id.toString()) || [],
      udemyCredits: updatedUser.udemyCredits,
      userLinks: updatedUser.links,
      language: updatedUser.preferredLanguage,
      headline: updatedUser.headline,
      fieldLearning: updatedUser.fieldLearning,
      isLoggedPreviouslyWithGoogle: updatedUser.isLoggedPreviouslyWithGoogle,
      whenCreated: updatedUser.createdAt?.toISOString?.() || updatedUser.createdAt,
      whenUpdated: updatedUser.updatedAt?.toISOString?.() || updatedUser.updatedAt,
      isAuthActivated: updatedUser.isAuthActivate,
    });

    res.cookie("cookie", token, {
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      status: "success",
      response: "Successfully updated profile picture",
    });
  }
);

const toggleCourseWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    if (!courseId) {
      return next(createError("Please provide a course ID in the URL.", 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return next(createError("Course not found.", 404));
    }

    const isInWishlist = req.user.wishlistCourses.includes(courseId);

    if (isInWishlist) {
      req.user.wishlistCourses = req.user.wishlistCourses.filter(
        (wishlistId: string) => wishlistId.toString() !== courseId
      );
      await req.user.save();
      res.status(200).json({
        status: "success",
        message: "Course removed from wishlist.",
        wishlistCourses: req.user.wishlistCourses,
      });
    } else {
      req.user.wishlistCourses.push(courseId);
      await req.user.save();
      res.status(200).json({
        status: "success",
        message: "Course added to wishlist.",
        wishlistCourses: req.user.wishlistCourses,
      });
    }
  }
);

const googleLoginOrSignUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body; // Get authorization code from frontend

    if (!code) {
      return next(createError("Authorization code is required", 400));
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${
            process.env.NODE_ENV === `production`
              ? "https://udemy-clone-ron-and-ben-front.onrender.com"
              : "http://localhost:5173"
          }`, // Must match the frontend's redirect URI
          grant_type: "authorization_code",
          code,
        }
      );

      const { access_token, id_token } = tokenResponse.data;

      // Fetch user details from Google
      const userResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const { email, name, picture } = userResponse.data;
      // console.log(userResponse.data);

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          fullName: name,
          email,
          profilePic: picture,
          authProvider: "google",
          isLoggedPreviouslyWithGoogle: true,
        });
        await user.save();
      } else {
        user.isLoggedPreviouslyWithGoogle = true;
        await user.save();
      }

      // Generate a JWT token for authentication
      // Convert MongoDB objects to plain JS values for jose serialization
      const token = await generateToken({
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        role: user.role,
        coursesBought: user.coursesBought?.map((id: any) => id.toString()) || [],
        udemyCredits: user.udemyCredits,
        userLinks: user.links,
        language: user.preferredLanguage,
        headline: user.headline,
        fieldLearning: user.fieldLearning,
        isLoggedPreviouslyWithGoogle: user.isLoggedPreviouslyWithGoogle,
        whenCreated: user.createdAt?.toISOString?.() || user.createdAt,
        whenUpdated: user.updatedAt?.toISOString?.() || user.updatedAt,
        isAuthActivated: user.isAuthActivate,
      });

      res.cookie("cookie", token, {
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      // Send success response
      res.status(200).json({
        status: "success",
        token,
      });
    } catch (error) {
      const errorData = (error as any).response?.data;
      const errorMessage = (error as any).message;
      console.log("Google login error:", errorData || errorMessage);

      // Return more specific error message for debugging
      const message = errorData?.error_description || errorData?.error || errorMessage || "Authentication failed";
      return next(createError(`Google auth error: ${message}`, 500));
    }
  }
);

const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const token = await generateToken({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      role: user.role,
      coursesBought: user.coursesBought?.map((id: any) => id.toString()) || [],
      udemyCredits: user.udemyCredits,
      userLinks: user.links,
      language: user.preferredLanguage,
      headline: user.headline,
      fieldLearning: user.fieldLearning,
      isLoggedPreviouslyWithGoogle: user.isLoggedPreviouslyWithGoogle,
      whenCreated: user.createdAt?.toISOString?.() || user.createdAt,
      whenUpdated: user.updatedAt?.toISOString?.() || user.updatedAt,
      isAuthActivated: user.isAuthActivated,
    });

    res.cookie("cookie", token, {
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      status: "success",
      response: "cookie has been updated",
      token,
    });
  }
);

const updatePersonalizeInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const personalizeField = req.body.personalizeField;

    if (!personalizeField) {
      return next(
        createError("Please provide personalizeField in the body", 400)
      );
    }

    user.personalizeField = personalizeField;

    await user.save();

    res.status(200).json({
      status: "success",
      response: "User information has been updated",
      user,
    });
  }
);

export {
  updatePersonalizeInfo,
  updateMe,
  toggleCourseWishlist,
  updateProfilePic,
  logout,
  login,
  googleLoginOrSignUp,
  signUp,
  getAllUsers,
  deactivateUser,
  reactiveUser,
  resizeUserPhoto,
  getUserById,
  uploadUserPhoto,
  confirmEmailAddress,
  resendEmailVerificationToken,
  updateUserInfo,
  verifyCode,
};
