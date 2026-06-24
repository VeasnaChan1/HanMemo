/* Loader component */

const Loader = ({ size = "md", fullScreen = false }) => {
  // Size layout mapping configurations
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div
      className={`rounded-full border-t-[#E8453C] border-r-transparent border-b-transparent border-l-transparent animate-spin ${sizeClasses[size] || sizeClasses.md}`}
      style={{
        borderColor: "rgba(232, 69, 60, 0.2)",
        borderTopColor: "#E8453C",
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FAFAFA]/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

export default Loader;
