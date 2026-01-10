import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
// import limiter from "./middlewares/rateLimit.ts";
import errorHandler from "./middlewares/errorHandler.ts";
import undefinedRoute from "./middlewares/undefinedRoutes.ts";
import connectDb from "./config/connectDb.ts";
import loggerInfo from "./middlewares/logger.ts";
import courseRoute from "./routes/course/courseRoute.ts";
import couponRoute from "./routes/course/couponRoute.ts";
import lessonRoute from "./routes/course/lessonRoute.ts";
import sectionRoute from "./routes/course/sectionRoute.ts";
import courseProgressRoutes from "./routes/course/courseProgressRoutes.ts";
import userRoute from "./routes/users/userRoute.ts";
import commentRoute from "./routes/reviews/commentRoute.ts";
import reviewRoute from "./routes/reviews/reviewRoute.ts";
import reportReviewRoute from "./routes/reviews/reportReviewRoute.ts";
import instructorRoute from "./routes/users/instructorRoute.ts";
import configRoute from "./routes/configRoute.ts";
// import { launchSocket, server } from "./sockets/launchSocket.ts";

dotenv.config();
const PORT: number = Number(process.env.PORT) || 3000;

// Allowed CORS origins
export const allowedOrigins: string[] = [
  "http://localhost:5173",
  "https://udemy-clone-ron-and-ben-front.onrender.com",
  "https://udemy-clone-ron-ben-iitc.onrender.com",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
];

export const app: Application = express();

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
  })
);
// Serve static images
app.use("/imgs", express.static("public/imgs"));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(loggerInfo);

// app.use(limiter);
connectDb();

// launchSocket();

// Logging middleware
app.use(morgan("dev"));

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    response: "Welcome to the Udemy clone backend server",
  });
});

// API Routes
app.use("/api/config", configRoute);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/section", sectionRoute);
app.use("/api/lesson", lessonRoute);
app.use("/api/review", reviewRoute);
app.use("/api/report/review", reportReviewRoute);
app.use("/api/comment", commentRoute);
app.use("/api/instructor", instructorRoute);
app.use("/api/course-progress", courseProgressRoutes);
app.use("/api/coupon", couponRoute);

// Handle undefined routes
app.all("*", undefinedRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export default app;
