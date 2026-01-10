// import { Server } from "socket.io";
// import { createServer } from "node:http";
// import app, { allowedOrigins } from "../app.ts";
// import User from "../models/users/userModel.ts";

// export const server = createServer(app);

// export const launchSocket = () => {
//   const io = new Server(server, {
//     cors: {
//       origin: allowedOrigins,
//       credentials: true,
//     },
//   });

//   // Middleware: Authenticate socket before connection
//   io.use(async (socket, next) => {
//     const emailOfUser = socket.handshake.auth?.emailOfUser;

//     if (!emailOfUser) {
//       const err = new Error("Email not provided");
//       err.data = { code: "NO_EMAIL", message: "Missing email in auth" };
//       return next(err);
//     }

//     try {
//       const user = await User.findOne({ email: emailOfUser });

//       if (!user) {
//         const err = new Error("User not found");
//         err.data = {
//           code: "USER_NOT_FOUND",
//           message: "No user in DB",
//           status: 401,
//         };
//         return next(err);
//       }

//       // Attach user to socket for later use
//       socket.user = user;
//       
//       next();
//     } catch (error) {
//       const err = new Error("DB error during user auth");
//       err.data = { code: "DB_ERROR", message: error.message };
//       return next(err);
//     }
//   });

//   // Main socket connection
//   io.on("connection", (socket) => {
//     

//     // Emit welcome message
//     socket.emit("welcomeToServer", "Welcome to the Udemy clone socket server");

//     // Handle userConnected event
//     socket.on("userConnected", ({ emailOfUser }) => {
//       
//     });
//   });
// };
