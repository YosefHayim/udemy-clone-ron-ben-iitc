import registerUser from "@/api/users/registerUser";
import { getErrorMessage } from "@/api/configuration";
import { RegisterUserPayload } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CheckboxSpecialOffer from "./CheckboxSpecialOffer/CheckboxSpecialOffer";
import ButtonLoader from "@/components/ButtonLoader/ButtonLoader";
import CustomInput from "@/components/CustomInput/CustomInput";
import { emailContext } from "@/contexts/EmailContext";

const SignUpForm = ({ isMobile }) => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setShowIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please enter a valid email address.");
  const navigate = useNavigate();

  const emailCtx = useContext(emailContext);
  const [emailUser, setEmailUser, userFullName, setUserFullName] = emailCtx;

  if (!emailCtx) throw new Error("emailContext is not provided");

  const mutation = useMutation<unknown, Error, RegisterUserPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data) navigate("/verify-code");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      setShowIsError(true);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = formData.get("fullName") as string;
    const signUpEmail = formData.get("email") as string;

    if (signUpEmail.length > 1 && fullName.length < 1) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(signUpEmail);
      if (!isValidEmail) {
        setErrorMessage("Please enter a valid email address.");
        setShowIsError(true);
      }
      return;
    }

    setLoading(true);
    setTimeout(() => {
      mutation.mutate({ fullName, email: signUpEmail });
      setLoading(false);
    }, 2000);
    setUserFullName(fullName);
    setEmailUser(signUpEmail);
  };

  return (
    <form className="flex flex-col items-center justify-start space-y-4" onSubmit={handleSubmit}>
      <div className={`${isMobile && "mb-5"}`}>
        <CheckboxSpecialOffer />
      </div>
      <CustomInput
        useErrorDisplay={false}
        isError={null}
        setShowIsError={setShowIsError}
        nameAttribute={"fullName"}
        idAttribute={"fullName"}
        labelName={"Full name"}
        inputMode={"text"}
      />
      <CustomInput
        isError={isError}
        setShowIsError={setShowIsError}
        nameAttribute={"email"}
        idAttribute={"email"}
        labelName={"Email"}
        inputMode={"email"}
        errorMessage={errorMessage}
      />
      <div className="w-full">
        <ButtonLoader isLoading={isLoading} stopLoad={isError} />
      </div>
    </form>
  );
};

export default SignUpForm;
