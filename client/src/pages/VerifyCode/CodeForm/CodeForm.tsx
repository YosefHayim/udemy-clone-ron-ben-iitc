import verifyCode from "@/api/users/verifyCode";
import ButtonLoader from "@/components/ButtonLoader/ButtonLoader";
import CustomInput from "@/components/CustomInput/CustomInput";
import { setUserInformation } from "@/utils/setUserInformation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoMdLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import NotificationCodeResent from "./NotificationCodeResent/NotificationCodeResent";
import loginUser from "@/api/users/loginUser";
import DisplayErrorCode from "./DisplayErrorCode/DisplayErrorCode";
import { useDispatch } from "react-redux";

const CodeForm = ({ emailUser, userFullName, isClickedResend }) => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setShowIsError] = useState(false);
  const [code, setCode] = useState("");
  const [codeVerification, setCodeVerification] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyCodeMutation = useMutation({
    mutationFn: verifyCode,
    onSuccess: (data) => {
      setUserInformation(data.token, dispatch);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (error) => {
      console.error("Error during login process:", error.response.data);
      setShowIsError(true);
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setCodeVerification(data.codeVerification);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    setCode(code);
    verifyCodeMutation.mutate({ code, email: emailUser });
  };

  useEffect(() => {}, [emailUser, userFullName, code]);

  useEffect(() => {
    if (isClickedResend) {
      loginMutation.mutate({ email: emailUser });
    }
  }, [isClickedResend]);

  return (
    <div className="w-full">
      {isClickedResend && <NotificationCodeResent />}
      {isError && (
        <div className="mb-2">
          <DisplayErrorCode />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center gap-5"
      >
        <div className="relative w-full">
          <IoMdLock className="absolute right-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 transform text-courseNameColorTxt" />
          <div className="w-full">
            <CustomInput
              isError={null}
              inputMode={"text"}
              nameAttribute={"code"}
              idAttribute={"code"}
              useErrorDisplay={false}
              labelName={`6-digit code`}
            />
          </div>
        </div>
        <div className="w-full">
          <ButtonLoader isLoading={isLoading} text={`Log in`} showIcon={false} stopLoad={isError} />
        </div>
      </form>
    </div>
  );
};

export default CodeForm;
