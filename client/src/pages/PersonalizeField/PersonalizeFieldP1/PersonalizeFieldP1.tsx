import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { personalizeContent } from "@/contexts/PersonalizeContext";
import { useContext } from "react";
import { FaUserEdit } from "react-icons/fa";

const PersonalizeFieldP1 = () => {
  const personalizeTracking = useContext(personalizeContent);
  if (!personalizeTracking) throw new Error("No personalize tracking provided");
  const [personalizeData, setPersonalizeData] = personalizeTracking;

  const handleChosenOccupation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const chosenInput = (e.target as HTMLElement).closest("input");
    if (chosenInput) {
      const chosenValue = chosenInput.value;
      setPersonalizeData((prevData: any) => ({
        ...structuredClone(prevData),
        occupation: chosenValue,
      }));
    }
  };

  return (
    <div
      className="flex w-full flex-col items-center justify-start"
      onClick={handleChosenOccupation}
    >
      <div className="my-[2em] ml-[8em] flex  items-center justify-start gap-[0.5em] rounded-[1em] bg-[#fff6e5] p-[2em] text-start">
        <FaUserEdit className="text-[2em] text-[#c4710d]" />
        <p className="text-courseNameColorTxt">
          Answer a few questions to improve your content recommendations
        </p>
      </div>
      <form className="flex w-[500px] flex-col items-start justify-start">
        <label htmlFor="field-learning" className="text-[1.5em]">
          What field are you learning for?
        </label>

        <RadioGroup defaultValue="software-development" className="mb-[2em] flex  gap-[10em]">
          <div className="flex flex-col items-start justify-start gap-[1em]">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="software-development" id="software-development" />
              <label htmlFor="software-development">Software Development</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="data-analytics" id="data-analytics" />
              <label htmlFor="data-analytics">Data & Analytics</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="information-technology" id="information-technology" />
              <label htmlFor="information-technology">Information Technology</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="marketing" id="marketing" />
              <label htmlFor="marketing">Marketing</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="design" id="design" />
              <label htmlFor="design">Design</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="finance-accounting" id="finance-accounting" />
              <label htmlFor="finance-accounting">Finance & Accounting</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="product-project-management" id="product-project-management" />
              <label htmlFor="product-project-management">Product & Project Management</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business-operations" id="business-operations" />
              <label htmlFor="business-operations">Business Operations</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sales-business-development" id="sales-business-development" />
              <label htmlFor="sales-business-development">Sales & Business Development</label>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-start justify-start gap-[1em]">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="human-resources" id="human-resources" />
                <label htmlFor="human-resources">Human Resources</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="education-training" id="education-training" />
                <label htmlFor="education-training">Education & Training</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer-support" id="customer-support" />
                <label htmlFor="customer-support">Customer Support</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="health-wellness" id="health-wellness" />
                <label htmlFor="health-wellness">Health & Wellness</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="writing" id="writing" />
                <label htmlFor="writing">Writing</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="legal" id="legal" />
                <label htmlFor="legal">Legal</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="art" id="art" />
                <label htmlFor="art">Art</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none-of-the-above" id="none-of-the-above" />
                <label htmlFor="none-of-the-above">None of the above</label>
              </div>
            </div>
          </div>
        </RadioGroup>
        <div className="mb-[8em]">
          <label htmlFor="manage-people" className="font-sans text-[1.5em] font-extrabold">
            Do you currently manage people?
          </label>
          <RadioGroup defaultValue="no" className="flex  gap-[5em]">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <label htmlFor="yes">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <label htmlFor="no">No</label>
            </div>
          </RadioGroup>
        </div>
      </form>
    </div>
  );
};

export default PersonalizeFieldP1;
