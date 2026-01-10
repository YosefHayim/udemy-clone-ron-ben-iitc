import { isProduction, baseUrl, localhostUrl } from "@/api/configuration";
import googleLogin from "@/api/users/googleLogin";
import { setUserInformation } from "@/utils/setUserInformation";
import { continueWGoogleBtn } from "@/utils/stylesStorage";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const GoogleBtn = () => {
  const [isError, setShowIsError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookie = Cookies.get("cookie");

  const googleMutationLogin = useMutation({
    mutationFn: googleLogin,
    onSuccess: (data) => {
      setUserInformation(data.token, dispatch);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (error) => {
      setShowIsError(true);
    },
  });

  const handleGoogle = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      googleMutationLogin.mutate(credentialResponse.code);
    },
    onError: (error) => {
    },
    onNonOAuthError: (nonAuthError) => {
    },
    flow: "auth-code",
    ux_mode: "popup",
    redirect_uri: isProduction ? baseUrl : localhostUrl,
  });
  return (
    <div className="flex w-full items-center justify-start">
      <button
        onClick={handleGoogle}
        className={`${continueWGoogleBtn} rounded-sm border border-purple-800 text-sm text-purple-800`}
      >
        <FcGoogle size={35} /> Continue with Google
      </button>
    </div>
  );
};

export default GoogleBtn;
