import loginUser from "@/api/users/loginUser";
import { getErrorMessage } from "@/api/configuration";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "@/components/CustomInput/CustomInput";
import ButtonLoader from "@/components/ButtonLoader/ButtonLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { emailContext } from "@/contexts/EmailContext";

const LoginForm = ({ showOnlyLoginButton = true }) => {
  const emailCtx = useContext(emailContext);
  const globalEmail = useSelector((state: RootState) => state?.user?.email);
  if (!emailCtx) throw new Error("emailContext is not provided");
  const [emailUser, setEmailUser, userFullName, setUserFullName] = emailCtx;

  const [isLoading, setLoading] = useState(false);
  const [isError, setShowIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please enter a valid email address.");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate("/verify-code");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      setShowIsError(true);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailSendToLoginApi = (formData.get("email") as string) || globalEmail;

    if (emailSendToLoginApi.length > 1) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(emailSendToLoginApi);
      if (!isValidEmail) {
        setErrorMessage("Please enter a valid email address.");
        setShowIsError(true);
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      loginMutation.mutate({ email: emailSendToLoginApi });
      setLoading(false);
    }, 1500);
    setEmailUser(emailSendToLoginApi);
  };

  return (
    <form className="mb-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
      <div className="relative">
        {showOnlyLoginButton && (
          <CustomInput
            isError={isError}
            setShowIsError={setShowIsError}
            labelName={"Email"}
            idAttribute={`email`}
            nameAttribute={`email`}
            inputMode={`email`}
            errorMessage={errorMessage}
          />
        )}
      </div>
      <ButtonLoader isLoading={isLoading} stopLoad={isError} />
    </form>
  );
};

export default LoginForm;
