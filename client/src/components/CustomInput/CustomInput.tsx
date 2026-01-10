import { TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { PiWarningOctagon } from "react-icons/pi";

const CustomInput: React.FC<{
  isError?: boolean | null;
  setShowIsError?: React.Dispatch<React.SetStateAction<boolean | null>>;
  labelName: string;
  idAttribute: string;
  nameAttribute: string;
  inputMode: string;
  useErrorDisplay?: boolean;
  errorMessage?: string;
}> = ({
  isError,
  setShowIsError,
  labelName,
  idAttribute,
  nameAttribute,
  inputMode,
  useErrorDisplay = true,
  errorMessage = "Please enter a valid email address.",
}) => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const focusOrBlurRef = useRef(null);

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="flex w-full flex-col items-start justify-center gap-2">
      <div className="relative flex w-full">
        <TextField
          required={true}
          ref={focusOrBlurRef}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          inputMode={inputMode}
          id={idAttribute}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label={labelName}
          variant="filled"
          name={nameAttribute}
          error={isError && useErrorDisplay}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "white",
              border: "2px solid gray",
              borderRadius: "5px",
              transition: "border-color 0.2s ease-in-out",
              "&:hover": {
                background: "#f6f7f9",
                borderColor: "gray",
              },
              "&.Mui-focused": {
                borderColor: "#6D28D2",
                backgroundColor: "white",
              },
              "& input": {
                color: "black",
              },
            },
            "& .MuiInputLabel-root": {
              color: `${isError && useErrorDisplay ? "red" : "black"}`,
              fontWeight: 600,
              fontSize: 15,
              "&.Mui-focused": {
                color: isError && useErrorDisplay ? "red" : "black",
              },
            },
          }}
          slotProps={{
            input: {
              disableUnderline: true,
            },
            inputLabel: {
              required: false,
            },
          }}
        />
        {isError && useErrorDisplay && (
          <PiWarningOctagon
            size={18}
            className={`${isFocused ? "" : "left-14 top-[28%]"} absolute left-12 top-[4px] text-red-600`}
          />
        )}
      </div>
      {isError && useErrorDisplay && (
        <p className="text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default CustomInput;
