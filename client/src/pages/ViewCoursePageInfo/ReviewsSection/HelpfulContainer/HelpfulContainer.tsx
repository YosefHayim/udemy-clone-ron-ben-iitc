import { dislikeReviewById } from "@/api/reviews/dislikeReviewById";
import { likeReviewById } from "@/api/reviews/likeReviewById";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

const HelpfulContainer: React.FC<{ idOfReview: string }> = ({ idOfReview }) => {
  const [isClickedLike, setClickedLike] = useState(false);
  const [isDisLike, setDisLike] = useState(false);

  // Load the initial state from LocalStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`review-${idOfReview}`);
    if (savedState) {
      const { liked, disliked } = JSON.parse(savedState);
      setClickedLike(liked);
      setDisLike(disliked);
    }
  }, [idOfReview]);

  const saveStateToLocalStorage = (liked: boolean, disliked: boolean) => {
    localStorage.setItem(`review-${idOfReview}`, JSON.stringify({ liked, disliked }));
  };

  const likeMutation = useMutation({
    mutationFn: likeReviewById,
    onError: (error) => {
    },
  });

  const disLikeMutation = useMutation({
    mutationFn: dislikeReviewById,
    onError: (error) => {
    },
  });

  const handleLike = () => {
    if (!isClickedLike) {
      setClickedLike(true);
      setDisLike(false);

      saveStateToLocalStorage(true, false); // Save state

      likeMutation.mutate(idOfReview);
    } else {
      setClickedLike(false);

      saveStateToLocalStorage(false, isDisLike); // Save state
    }
  };

  const handleDislike = () => {
    if (!isDisLike) {
      setDisLike(true);
      setClickedLike(false);

      saveStateToLocalStorage(false, true); // Save state

      disLikeMutation.mutate(idOfReview);
    } else {
      setDisLike(false);

      saveStateToLocalStorage(isClickedLike, false); // Save state
    }
  };

  return (
    <div className="flex  items-start justify-start gap-[1em]">
      <p>Helpful?</p>
      <div onClick={handleLike} className="cursor-pointer">
        {isClickedLike ? <BiSolidLike /> : <BiLike />}
      </div>
      <div className="cursor-pointer" onClick={handleDislike}>
        {isDisLike ? <BiSolidDislike /> : <BiDislike />}
      </div>
    </div>
  );
};

export default HelpfulContainer;
