import reportUserReviewByReviewId from "@/api/reviews/reportUserReviewByReviewId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const DialogReportReview: React.FC<{
  reviewId: string;
  isOpenReportDrawer: boolean;
  setReportDrawer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  userId?: string;
}> = ({ reviewId, isOpenReportDrawer, setReportDrawer, userId }) => {
  if (!reviewId) {
    return <div>No review selected to report.</div>;
  }

  const [isClicked, setIsClicked] = useState(false);

  const handleSubmitReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const issueType = String(formData.get("issue-type"));
    const issueDetails = String(formData.get("issue-details"));

    if (!issueType || !issueDetails) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    mutation.mutate({ userId, reviewId, issueType, issueDetails });
  };

  const mutation = useMutation({
    mutationFn: reportUserReviewByReviewId,
    onSuccess: (data) => {
      // Show the acknowledgment message
      setIsClicked(true);
    },
    onError: (error) => {
    },
  });

  const handleCloseBtn = () => {
    // Close the dialog when the user acknowledges
    setReportDrawer(false);
    setIsClicked(false); // Reset the state for the next time the dialog opens
  };

  return (
    <div>
      <Dialog open={isOpenReportDrawer} onOpenChange={(isOpen) => setReportDrawer(isOpen)}>
        <DialogOverlay style={{ backgroundColor: "#1d1e27cc" }} />

        <DialogContent className="w-max-none z-[2000] w-[600px]">
          <DialogHeader>
            <DialogTitle className="mb-[1em] font-sans font-extrabold">Report abuse</DialogTitle>
            <DialogDescription className="text-black">
              {isClicked ? (
                <div>
                  <p>
                    Thank you for helping maintain the integrity of our marketplace. We will review
                    your report as soon as possible. As a matter of policy we will only follow up if
                    we require additional information.
                  </p>
                </div>
              ) : (
                <div>
                  <p>
                    Flagged content is reviewed by Udemy staff to determine whether it violates
                    Terms of Service or Community Guidelines.
                  </p>
                  <div>
                    If you have a question or technical issue, please contact our{" "}
                    <span className="cursor-pointer text-purpleStatic underline">
                      Support team here
                    </span>
                    .
                  </div>
                </div>
              )}
              <form
                className={`flex flex-col items-start justify-start gap-[1em]`}
                onSubmit={handleSubmitReport}
              >
                {!isClicked && (
                  <>
                    <label htmlFor="issue-type" className="mt-[1.5em] font-sans font-extrabold">
                      Issue type
                    </label>
                    <select
                      name="issue-type"
                      id="issue-type"
                      required
                      className="w-full rounded-[0.2em] border border-black bg-white p-[1em] text-black"
                    >
                      <option value="">Select an issue</option>
                      <option value="harmfulVioletHateful">
                        Inappropriate Course Content - Harmful, Violent, Hateful, or Criminal
                      </option>
                      <option value="courseContentOther">
                        Inappropriate Course Content - Other
                      </option>
                      <option value="inappropriateBehavior">Inappropriate Behavior</option>
                      <option value="udemyPolicyViolation">Udemy Policy Violation</option>
                      <option value="spammyContent">Spammy Content</option>
                      <option value="other">Other</option>
                    </select>
                    <label htmlFor="issue-details" className="font-sans font-extrabold">
                      Issue details
                    </label>
                    <Input
                      className="h-[4em] rounded-[0.2em] border border-black"
                      type="text"
                      name="issue-details"
                      id="issue-details"
                    />
                  </>
                )}
                <div className="flex w-full  items-end justify-end gap-[1em] text-end">
                  {isClicked ? (
                    <Button
                      className="rounded-[0.3em] p-[1.3em] font-sans font-extrabold"
                      onClick={handleCloseBtn}
                    >
                      OK
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="bg-white p-[1.3em] font-sans font-extrabold text-black shadow-none hover:bg-white"
                        onClick={handleCloseBtn}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="rounded-[0.3em] p-[1.3em] font-sans font-extrabold"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogReportReview;
