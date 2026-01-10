import { SignJWT, jwtVerify } from "jose";
import catchAsync from "../../utils/wrapperFn.ts";
import crypto from "crypto";
import createError from "../../utils/errorFn.ts";
import { NextFunction, Request, Response } from "express";
import User from "../../models/users/userModel.ts";
import { Payload } from "../../types/types.ts";

const jwtKey = new TextEncoder().encode(process.env.JWT_SECRET as string);

// Generate a random token for email confirmation
const confirmEmailToken = (length = 32) => {
  const emailToken = crypto.randomBytes(length).toString("hex"); // Convert to hexadecimal format
  return emailToken;
};

const generateToken = async (payload: Payload) => {
  // Generating token once user logged in
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "90d")
    .sign(jwtKey);
  return token;
};

const verifyToken = async (token: string) => {
  // Verify the token that was provided
  try {
    const { payload } = await jwtVerify(token, jwtKey);
    return payload;
  } catch (err) {
    throw Error("Error occurred during verify token of user");
  }
};

const grantedAccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Getting token and checking if it's there
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.cookie) {
      token = req.cookies.cookie;
    }

    if (!token) {
      return next(
        createError(
          "You are not logged in or there is no token in headers.",
          401
        )
      );
    }

    // Verify token
    const decoded = await verifyToken(token);

    // Check if the user still exists
    const currentUser = await User.findOne({ _id: decoded.id });

    if (!currentUser) {
      return next(
        createError("This user no longer exists. Please sign up.", 401)
      );
    }

    req.user = currentUser;

    next();
  }
);

export { verifyToken, grantedAccess, generateToken, confirmEmailToken };
