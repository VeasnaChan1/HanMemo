/* LessonCard component */
import { Lock, Play, CheckCircle2 } from "lucide-react";

const LessonCard = ({ lesson, onStartLesson }) => {
  // Default structure fallback mappings
  const {
    id,
    title = "Lesson Title",
    wordCount = 0,
    isLocked = false,
    isCompleted = false,
  } = lesson || {};

  const totalItems = wordCount || 0;
  const completedItems = isCompleted ? totalItems : 0;

  // Compute local loading bar configuration tracking parameters
  const progressPercentage =
    totalItems > 0
      ? Math.min(Math.max((completedItems / totalItems) * 100, 0), 100)
      : 0;

  return (
    <div
      className={`w-full p-5 rounded-2xl border transition-all duration-300 text-left flex flex-col justify-between h-44 bg-white
        ${
          isLocked
            ? "border-[#E8E8F0] opacity-70 bg-gray-50 select-none"
            : "border-[#E8E8F0] hover:border-[#FFE2E0] hover:shadow-md"
        }`}
    >
      {/* Top Details & Header Segment */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-0.5">
          <h4 className="font-bold text-base text-[#1A1A2E] line-clamp-1">
            {title}
          </h4>
          <p className="text-xs font-semibold text-[#9B9BB4]">
            {wordCount} vocabulary words
          </p>
        </div>

        {/* State Status Badges */}
        <div>
          {isLocked ? (
            <div className="p-1.5 rounded-xl bg-gray-200 text-gray-400">
              <Lock size={16} />
            </div>
          ) : isCompleted ? (
            <div className="p-1.5 rounded-xl bg-green-50 text-green-600">
              <CheckCircle2
                size={16}
                fill="currentColor"
                className="text-white"
              />
            </div>
          ) : (
            <div className="text-[10px] font-black uppercase tracking-wider bg-[#FFF0EF] text-[#E8453C] px-2.5 py-1 rounded-lg">
              Active
            </div>
          )}
        </div>
      </div>

      {/* Bottom Progress & Action Row Segment */}
      <div className="mt-4 flex flex-col gap-3">
        {/* Render interactive linear scale loader tracks only if unlocked */}
        {!isLocked && (
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] font-bold text-[#4A4A6A]">
              <span>Progress</span>
              <span>
                {completedItems}/{totalItems}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500
                  ${isCompleted ? "bg-green-500" : "bg-[#E8453C]"}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button Controls Row */}
        <div className="flex justify-end items-center mt-1">
          {isLocked ? (
            <button
              disabled
              className="text-xs font-bold text-gray-400 flex items-center gap-1 cursor-not-allowed bg-transparent border border-transparent"
            >
              Locked
            </button>
          ) : (
            <button
              onClick={() => onStartLesson && onStartLesson(id)}
              className={`text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer py-1.5 px-3.5 rounded-xl border
                ${
                  isCompleted
                    ? "text-[#4A4A6A] border-[#E8E8F0] hover:bg-gray-50"
                    : "text-white bg-[#E8453C] border-[#E8453C] hover:bg-[#d63b33] shadow-sm"
                }`}
            >
              {isCompleted ? "Review Again" : "Start Study"}
              {!isCompleted && <Play size={10} fill="currentColor" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
