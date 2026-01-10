import { FaApple, FaFacebook } from "react-icons/fa";
import { baseUrl, isProduction, localhostUrl } from "@/api/configuration";
import { iconSize, loginThirdPartyBtn } from "@/utils/stylesStorage";

import { FcGoogle } from "react-icons/fc";
import googleLogin from "@/api/users/googleLogin";
import { setUserInformation } from "@/utils/setUserInformation";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const OtherLoginOptions = () => {
  const [_, setShowIsError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <div>
      <div className="my-6 flex w-full items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-sm text-grayNavbarTxt">Other log in options</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <div className="mb-[2em] flex justify-center space-x-5">
        <button onClick={handleGoogle} className={`${loginThirdPartyBtn}`}>
          <FcGoogle className={`${iconSize}`} />
        </button>
        <button className={`${loginThirdPartyBtn}`}>
          <FaFacebook className={`${iconSize} text-blue-600`} />
        </button>
        <button className={`${loginThirdPartyBtn}`}>
          <FaApple className={`${iconSize}`} />
        </button>
      </div>
    </div>
  );
};

export default OtherLoginOptions;
