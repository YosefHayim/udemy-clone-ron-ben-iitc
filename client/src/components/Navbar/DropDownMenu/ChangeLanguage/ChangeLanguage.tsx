import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { RootState } from "@/redux/store";
import { TbWorld } from "react-icons/tb";
import { btnLanguages } from "@/utils/languages";
import { setLanguage } from "@/redux/slices/userSlice";
import updateUserLanguage from "@/api/users/updateUserLanguage";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useState } from "react";

const ChangeLanguage: React.FC<{
  isClicked?: boolean;
  setClicked?: (value: boolean) => void;
  size?: number;
  showIcon: boolean;
}> = ({ isClicked, setClicked, showIcon = false, size = 26 }) => {
  const dispatch = useDispatch();

  const defaultLanguage = useSelector((state: RootState) => state?.user.language);
  const [chosenLanguage, setChosenLanguage] = useState(defaultLanguage);

  const postUserLanguage = useMutation({
    mutationFn: updateUserLanguage,
  });

  const handleChosenLanguage = (language: string) => {
    dispatch(setLanguage(language));
    setChosenLanguage(language);
    postUserLanguage.mutate(language);
  };

  return (
    <Dialog>
      <DialogOverlay style={{ backgroundColor: "#1d1e27cc" }} />
      <DialogTrigger>
        {showIcon && (
          <div>
            <p>Language</p>
          </div>
        )}
        {!showIcon && (
          <div
            className={`${
              !showIcon ? "justify-center border border-purple-800 p-[10px]" : ""
            } flex items-center rounded-[0.2em] hover:bg-purpleHoverBtn focus:outline-none`}
          >
            {!showIcon && <TbWorld size={size} className="focus:outline-none" />}
            {!showIcon && <p className="hidden">{chosenLanguage}</p>}
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-[0.5em] font-sans font-extrabold focus:outline-none">
            Choose a language
          </DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-3 grid-rows-3 flex-wrap gap-1">
              {btnLanguages.map((language: { code: string; name: string }) => (
                <div
                  onClick={() => handleChosenLanguage(language.name)}
                  className="w-full hover:bg-white"
                  key={language.code}
                >
                  <Button
                    className={`hover:hover-color-mix flex h-[3em] w-full justify-start rounded-[0.2em] bg-white text-black shadow-none hover:text-btnColor focus:outline-none
                          ${chosenLanguage === language.name && "border border-gray-500"} `}
                  >
                    {language.name}
                  </Button>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeLanguage;
