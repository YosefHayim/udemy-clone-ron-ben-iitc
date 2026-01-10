import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLessonProgress } from "@/services/ProgressService";
import { useSidebar } from "@/components/ui/sidebar";
import CustomTrigger from "./CustomTrigger";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { PlayIcon } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useNavigate } from "react-router-dom";

interface VideoPlayerProps {
  videoUrl: string;
  currentLesson: any;
  lessonIndex: number;
  nextLesson: any;
  prevLesson: any;
  onNavigate: (lessonId: string) => void;
  courseId: string; // Add courseId for mutation
  controls?: boolean;
  playing?: boolean;
  width?: string;
  height?: string;
  setCurrentSec: (seconds: number) => void; // New prop for updating lastWatched
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  currentLesson,
  lessonIndex,
  nextLesson,
  prevLesson,
  onNavigate,
  courseId,
  setCurrentSec,
  controls = true,
  playing = true,
  width = "100%",
  height = "780px",
}) => {
  const { open, toggleSidebar } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const [paused, setPaused] = useState(!playing);
  const [loading, setLoading] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  // Track the last watched position
  const [lastWatched, setLastWatched] = useState(0);
  const [updateTimer, setUpdateTimer] = useState<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  const isCanceledRef = useRef(false); // Use ref to track isCanceled
  const playerRef = useRef<ReactPlayer>(null);
  const queryClient = useQueryClient(); // Access queryClient

  // Seek to the last watched time when the video URL changes or lastWatched updates
  useEffect(() => {

    if (playerRef.current && currentLesson?.lastWatched > 0) {
      playerRef.current.seekTo(currentLesson.lastWatched, "seconds");
      setPaused(true); // Set paused state to true
    }
  }, [videoUrl, currentLesson._id]);

  // Mutation to update lesson progress
  const mutation = useMutation({
    mutationFn: ({
      lessonId,
      payload,
    }: {
      lessonId: string;
      payload: { lastWatched?: number; completed?: boolean };
    }) => updateLessonProgress(courseId, lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["courseProgress", courseId]);
    },
  });

  // Update `lastWatched` time periodically
  const handleProgress = (progress: { playedSeconds: number }) => {
    const currentSeconds = Math.floor(progress.playedSeconds);
    setLastWatched(currentSeconds);
    setCurrentSec(currentSeconds);


    if (!updateTimer) {
      const timer = setTimeout(() => {
        mutation.mutate({
          lessonId: currentLesson._id,
          payload: { lastWatched: currentSeconds },
        });
        setUpdateTimer(null);
      }, 2000); // Update every 5 seconds
      setUpdateTimer(timer);
    }
  };

  // Mark lesson as completed when the video ends
  const handleVideoEnd = () => {
    setIsEnded(true); // Set ended state to true
    mutation.mutate({
      lessonId: currentLesson._id,
      payload: { completed: true }, // Mark lesson as completed
    });

    if (nextLesson) {
      setLoading(true);
      let currentProgress = 0;

      // Start a timer to increment progress
      const interval = setInterval(() => {
        currentProgress += 10; // Increment progress by 10
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(interval); // Stop when progress reaches 100
        }
      }, 150); // Update progress every 200ms (adjust as needed)

      setTimeout(() => {
        clearInterval(interval);
        if (!isCanceledRef.current) {
          onNavigate(nextLesson._id);
          setProgress(0);
          setLoading(false);
          setPaused(false);
        }
      }, 2500);
    }
  };

  // Clear the update timer on unmount
  useEffect(() => {
    return () => {
      if (updateTimer) clearTimeout(updateTimer);
    };
  }, [updateTimer]);

  return (
    <div
      className="video-player group relative h-full w-full bg-watchUdemyCourse"
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current Lesson Title */}
      <div className="absolute top-[65px] w-full bg-gradient-to-b from-black/75 to-transparent py-2 pl-10 text-start text-lg text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {lessonIndex}. {currentLesson.title}
      </div>

      {/* Play Button Overlay */}
      <div
        className={`absolute inset-0 z-0 flex items-center justify-center ${
          paused ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        {paused && !isEnded && (
          <PlayIcon
            size={80}
            color="white"
            className="absolute inset-0 m-auto flex items-center justify-center rounded-full bg-slate-950 bg-opacity-70 p-4"
          />
        )}
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 bg-opacity-75">
          {/* Display the "Up to next" message */}
          <span className="mb-2 text-sm text-gray-500">Up to next</span>
          <span className="mb-6 text-4xl text-white">
            {lessonIndex + 1}. {nextLesson?.title}
          </span>

          {/* Circular Progress Loader */}
          <CircularProgress
            variant="determinate"
            value={progress}
            size="6rem"
            color="inherit"
            style={{ color: "#D1D2E0" }} // Custom color
          />
          {/* Play Icon */}
          <div className="absolute  flex cursor-pointer items-center justify-center">
            <PlayIcon
              onClick={() => {
                if (nextLesson) {
                  onNavigate(nextLesson._id);
                  setLoading(false);
                  setProgress(0);
                }
              }}
              size={80}
              color="white"
              className="absolute mt-7 rounded-full bg-opacity-70 p-4 "
            />
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => {
              isCanceledRef.current = true; // Update the ref
              setLoading(false);
              setProgress(0);
            }}
            className="relative z-10 mt-6 rounded px-6 py-2 text-white transition duration-300 hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Centered Custom Trigger */}
      {!open && window.innerWidth > 1000 && (
        <div className="absolute inset-0 flex items-center  justify-end pb-80">
          <CustomTrigger open={open} toggleSidebar={toggleSidebar} position="centered" />
        </div>
      )}

      {/* React Player */}
      <ReactPlayer
        ref={playerRef} // Attach the ref here
        url={videoUrl}
        controls={isHovered}
        playing={!paused}
        width="100%"
        height="100%"
        onPause={() => setPaused(true)}
        onPlay={() => {
          setPaused(false);
          isCanceledRef.current = false; // Reset ref on play
        }}
        onProgress={handleProgress} // Update progress
        onEnded={handleVideoEnd} // Mark lesson as completed
      />

      {/* Navigation Buttons */}
      {!open && (
        <div
          className={`absolute top-1/2 z-[1000] flex h-14 w-full -translate-y-1/2 transform justify-between transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button
            className={` flex max-h-10 w-8 items-center justify-center bg-purple-500 bg-opacity-60 bg-gradient-to-r  px-1 text-white hover:bg-[#892DE1]  ${
              prevLesson ? "opacity-100" : "invisible"
            }`}
            onClick={prevLesson ? () => onNavigate(prevLesson._id) : undefined}
            title={prevLesson ? `Previous: ${prevLesson.title}` : ""}
          >
            <MdArrowBackIos size={16} />
          </button>

          <button
            className={` flex max-h-10 w-8 items-center justify-center bg-purple-500 bg-opacity-60 bg-gradient-to-r  px-1 text-white hover:bg-[#892DE1]  ${
              nextLesson ? "opacity-100" : "invisible"
            }`}
            onClick={nextLesson ? () => onNavigate(nextLesson._id) : undefined}
            title={nextLesson ? `Next: ${nextLesson.title}` : ""}
          >
            <MdArrowForwardIos size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
