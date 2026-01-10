// import { createContext, useContext, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { baseUrl, isProduction, localhostUrl } from "../api/configuration";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { clearUser } from "@/redux/slices/userSlice";

// export const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const socketRef = useRef(null);
//   const emailOfUser = useSelector((state: RootState) => state?.user?.email);

//   useEffect(() => {
//     const socketInstance = io(`${isProduction ? baseUrl : localhostUrl}`, {
//       auth: {
//         emailOfUser,
//       },
//     });
//     socketRef.current = socketInstance;

//     socketInstance.connect();

//     socketInstance.on("connect", () => {
//       socketInstance.emit("userConnected", { emailOfUser });
//     });

//     socketInstance.on("welcomeToServer", (data) => {
//       
//     });

//     socketInstance.on("connect_error", (err) => {
//       
//       if (err.data) {
//         dispatch(clearUser());
//         
//       }
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [emailOfUser]);

//   return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
// };
