/* RatingButtons component */

const RatingButtons = ({ onRate, disabled = false, intervals = {} }) => {
  // Define standard SM-2 rating quality buttons configurations
  const buttons = [
    {
      value: 1,
      label: "Again",
      subLabel: "Forgot",
      colorClass: "border-red-200 text-red-600 hover:bg-red-50 focus:bg-red-50",
    },
    {
      value: 2,
      label: "Hard",
      subLabel: "Hesitated",
      colorClass:
        "border-orange-200 text-orange-600 hover:bg-orange-50 focus:bg-orange-50",
    },
    {
      value: 3,
      label: "Good",
      subLabel: "Correct",
      colorClass:
        "border-blue-200 text-blue-600 hover:bg-blue-50 focus:bg-blue-50",
    },
    {
      value: 4,
      label: "Easy",
      subLabel: "Perfect",
      colorClass:
        "border-green-200 text-green-600 hover:bg-green-50 focus:bg-green-50",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-4 gap-2.5 px-1">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          disabled={disabled}
          onClick={() => onRate && onRate(btn.value)}
          className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl border bg-white transition-all duration-150 shadow-sm focus:outline-none font-medium text-left cursor-pointer
            ${disabled ? "opacity-40 cursor-not-allowed select-none" : "hover:scale-[1.02] active:scale-[0.98]"}
            ${btn.colorClass}`}
        >
          {intervals[btn.value] && (
            <span className="absolute -top-3 bg-white px-1.5 text-[10px] font-bold text-gray-500 rounded-full border shadow-sm">
              {intervals[btn.value]}
            </span>
          )}
          <span className="text-sm font-bold tracking-tight">{btn.label}</span>
          <span className="text-[10px] opacity-75 font-semibold mt-0.5">
            {btn.subLabel}
          </span>
        </button>
      ))}
    </div>
  );
};

export default RatingButtons;
