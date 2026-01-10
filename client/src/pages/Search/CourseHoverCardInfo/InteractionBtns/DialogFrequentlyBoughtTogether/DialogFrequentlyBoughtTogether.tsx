import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FrequentlyBoughtTogether from "@/pages/ViewCoursePageInfo/FrequentlyBoughtTogether/FrequentlyBoughtTogether";
import ItemInCart from "@/components/Navbar/Cart/ItemInCart/ItemInCart";
import CloseButtonDialogFBTAndTitle from "./CloseButtonDialogFBTAndTitle/CloseButtonDialogFBTAndTitle";
import ProcCheckNGoToCart from "../ProcCheckNGoToCart/ProcCheckNGoToCart";
import { useEffect, useState } from "react";

const DialogFrequentlyBoughtTogether: React.FC<{
  courseTopic: string;
  courseId: string;
  instructorId: string;
  showDialogOfFbt: boolean;
  setShowDialogOfFbt: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ courseId, instructorId, showDialogOfFbt, setShowDialogOfFbt }) => {
  const [coursesAdded, setCoursesAdded] = useState([]);

  useEffect(() => {
  }, [coursesAdded]);

  return (
    <div>
      <AlertDialog open={showDialogOfFbt} onOpenChange={setShowDialogOfFbt}>
        <AlertDialogContent
          style={{
            borderRadius: "0em",
            maxWidth: "750px",
            background: "#F6F7F9",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              <CloseButtonDialogFBTAndTitle setShowDialogOfFbt={setShowDialogOfFbt} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex w-full items-center justify-around">
                <div className="flex w-full flex-col items-start justify-start text-black">
                  {coursesAdded.length === 0 ? (
                    <ItemInCart
                      chooseFlex={`w-full`}
                      isFBT={true}
                      widthChosen={`w-[22em]`}
                      courseId={courseId}
                      rowPrices={false}
                      showHR={false}
                      showDisPrice={true}
                      showFullPrice={true}
                      hide={false}
                    />
                  ) : (
                    <div className="flex flex-col items-start justify-start gap-6">
                      <ItemInCart
                        chooseFlex={`w-full`}
                        isFBT={true}
                        widthChosen={`w-[22em]`}
                        courseId={courseId}
                        rowPrices={false}
                        showHR={false}
                        showDisPrice={true}
                        showFullPrice={true}
                        hide={false}
                      />
                      {coursesAdded.map((courseAddedToCart) => (
                        <ItemInCart
                          key={courseAddedToCart}
                          chooseFlex={`w-full`}
                          isFBT={true}
                          widthChosen={`w-[22em]`}
                          courseId={courseAddedToCart}
                          rowPrices={false}
                          showHR={false}
                          showDisPrice={true}
                          showFullPrice={true}
                          hide={false}
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex w-full flex-col gap-2">
                    <ProcCheckNGoToCart />
                  </div>
                  <hr className="mb-6 mt-3 w-full" />
                </div>
              </div>
              <div className="flex flex-wrap text-black">
                <FrequentlyBoughtTogether
                  setCoursesAdded={setCoursesAdded}
                  instructorId={instructorId}
                  showPlusButtons={false}
                  amountOfCourses={2}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DialogFrequentlyBoughtTogether;
