import { localhostUrl, baseUrl, isProduction } from "@/api/configuration";
import DialogPopup from "@/components/DialogPopup/DialogPopup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { regFullButtonPurpleHover, regInputFill } from "@/utils/stylesStorage";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoMdCheckmarkCircle, IoMdMail } from "react-icons/io";
import { useLocation } from "react-router-dom";

const SharePopup = ({ isClicked, setClicked }) => {
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [isSent, setSent] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${isProduction ? baseUrl : localhostUrl}${location.pathname}`);
  };

  const handleEmail = () => {
    setOpenEmailDialog(true);
  };

  const handleCancel = () => {
    setEmailInput("");
    setMessage("");
    setSent(false);
    setOpenEmailDialog(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emails = formData.get("emails");
    const recommendReason = formData.get("recommend");
    setSent(true);
  };

  const isSendDisabled = () => {
    const hasValidEmail = emailInput
      .split(",")
      .map((e) => e.trim())
      .some((email) => email.includes("@"));
    const hasMessage = message.trim().length > 0;
    return !(hasValidEmail && hasMessage);
  };

  return (
    <div>
      <Dialog open={isClicked} onOpenChange={setClicked}>
        <DialogOverlay style={{ backgroundColor: "#1d1e27cc" }} />
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-sans font-extrabold">Share this course</DialogTitle>
            <DialogDescription>
              <div className="flex w-full  gap-[0.4em]">
                <input
                  type="text"
                  value={`${isProduction ? baseUrl : localhostUrl}${location.pathname}`}
                  disabled={true}
                  className={`${regInputFill} w-full rounded-sm bg-white p-2`}
                />
                <button
                  onClick={handleCopyText}
                  className={`${regFullButtonPurpleHover} px-5 py-[0.6em]`}
                >
                  Copy
                </button>
              </div>
              <div className="mt-[0.7em] flex  items-center justify-center gap-[1em]">
                <div className="w-min cursor-pointer rounded-[100em] border border-purple-900 p-[0.5em] hover:bg-purple-200">
                  <FaFacebook className="text-[1.3em] text-purple-600" />
                </div>
                <div className="w-min cursor-pointer rounded-[100em] border border-purple-900 p-[0.5em] hover:bg-purple-200">
                  <FaSquareXTwitter className="text-[1.3em] text-purple-600" />
                </div>
                <div
                  onClick={handleEmail}
                  className="w-min cursor-pointer rounded-[100em] border border-purple-900 p-[0.5em] hover:bg-purple-200"
                >
                  <IoMdMail className="text-[1.3em] text-purple-600" />
                </div>
                <DialogPopup
                  extraCustomClass="w-full max-w-[550px] "
                  isClicked={openEmailDialog}
                  setClicked={setOpenEmailDialog}
                  title="Share via email"
                >
                  <form onSubmit={handleSubmit}>
                    <div className="flex w-full flex-col items-start justify-start gap-2 text-black">
                      <label htmlFor="emails" className="font-extrabold ">
                        Email addresses
                      </label>
                      <input
                        name="emails"
                        id="emails"
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className={`${regInputFill} w-full rounded-sm border bg-white p-2 focus:border-purple-700 focus:outline-none active:border-purple-700`}
                      />
                      <p className="text-xs text-gray-700">
                        Enter up to 5 email address, separated by comma
                      </p>
                      <div className="flex w-full items-center justify-between">
                        <label htmlFor="recommend" className="font-bold ">
                          Why are you recommending this?
                        </label>
                        <p className="text-xs font-normal text-gray-500">Optional</p>
                      </div>
                      <textarea
                        id="recommend"
                        name="recommend"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`${regInputFill} w-full rounded-sm border bg-white p-2 focus:border-purple-700 focus:outline-none active:border-purple-700`}
                      />
                      <p className="w-full text-xs text-gray-700">
                        Make your share more meaningful with a personal note
                      </p>
                      <div className="flex w-full items-center justify-between">
                        <div className="w-full">
                          <p className="w-max text-xs text-gray-700">
                            By sending, you confirm that you know the recipients
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="reset"
                            onClick={handleCancel}
                            className="cursor-pointer rounded-sm px-2 py-2 font-bold hover:bg-gray-300 focus:outline-none"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className={`${regFullButtonPurpleHover} ${isSendDisabled() || isSent ? "cursor-not-allowed opacity-30" : "cursor-pointer"} flex h-full  items-center px-3 py-[0.5rem] focus:outline-none`}
                          >
                            {isSent ? (
                              <div className="flex  items-center justify-center">
                                <p>Email Sent</p>
                                <IoMdCheckmarkCircle size={18} />
                              </div>
                            ) : (
                              <p>Send</p>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </DialogPopup>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharePopup;
