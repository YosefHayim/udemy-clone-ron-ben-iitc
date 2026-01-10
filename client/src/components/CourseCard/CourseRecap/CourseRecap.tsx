const CourseRecap = ({ recapInfo }: { recapInfo?: string }) => {
  return (
    <div className="w-full max-w-full">
      <p className="line-clamp-2 break-words text-gray-600">{recapInfo}</p>
    </div>
  );
};

export default CourseRecap;
