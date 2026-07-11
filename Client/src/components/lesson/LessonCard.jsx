/* LessonCard component */
import { Lock, Play, CheckCircle2 } from "lucide-react";

const LessonCard = ({ lesson, onStartLesson }) => {
  const {
    id,
    title = "Lesson Title",
    wordCount = 0,
    isLocked = false,
    isCompleted = false,
    lesson_number,
    completed_words = 0,
  } = lesson || {};

  const totalItems = wordCount || 0;
  const completedItems = isCompleted ? totalItems : completed_words;

  const progressPercentage =
    totalItems > 0
      ? Math.min(Math.max((completedItems / totalItems) * 100, 0), 100)
      : 0;

  return (
    <div
      onClick={() => !isLocked && onStartLesson && onStartLesson(id)}
      className={`w-full p-5 rounded-3xl border transition-all duration-300 text-left flex flex-col justify-between min-h-[160px] bg-white
        ${
          isLocked
            ? "border-[#E8E8F0] opacity-60 bg-gray-50 select-none cursor-not-allowed"
            : isCompleted
              ? "border-[#FFE2E0] hover:shadow-sm cursor-pointer"
              : "border-[#E8E8F0] hover:border-[#FFE2E0] hover:shadow-sm cursor-pointer"
        }`}
    >
      {/* Top Details & Header Segment */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#9B9BB4]">
            LESSON {lesson_number || id}
          </span>
          <h4 className="font-bold text-[17px] text-[#1A1A2E] leading-tight">
            {title}
          </h4>
          <p className="text-[13px] font-medium text-[#9B9BB4] mt-1">
            {wordCount} words
          </p>
        </div>

        {/* State Status Badges */}
        <div className="shrink-0 mt-1">
          {isLocked ? (
            <div className="p-1.5 rounded-xl bg-gray-100 text-gray-400">
              <Lock size={16} />
            </div>
          ) : isCompleted ? (
            <div className="text-[11px] font-bold tracking-wide bg-[#e6f4ea] text-[#0d6a37] px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={14} fill="#0d6a37" color="white" /> Completed
            </div>
          ) : (
            <div className="text-[10px] font-black uppercase tracking-wider bg-[#FFF0EF] text-[#E8453C] px-2.5 py-1 rounded-lg">
              ACTIVE
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {!isLocked && (
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className={isCompleted ? "text-[#0d6a37]" : "text-[#4A4A6A]"}>{isCompleted ? "Mastery" : "Progress"}</span>
              <span className={isCompleted ? "text-[#0d6a37]" : "text-[#4A4A6A]"}>
                {isCompleted ? "100%" : `${completedItems}/${totalItems}`}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500
                  ${isCompleted ? "bg-[#0d6a37]" : "bg-[#E8453C]"}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button Controls Row */}
        <div className="w-full mt-1">
          {!isLocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartLesson && onStartLesson(id);
              }}
              className={`w-full text-sm font-bold transition-all duration-200 flex justify-center items-center gap-1.5 py-2.5 rounded-[18px] border
                ${
                  isCompleted
                    ? "text-[#5c4033] border-[#FFE2E0] bg-[#eff7f6] hover:bg-[#e4f0ef]"
                    : "text-white bg-[#E8453C] border-[#E8453C] hover:bg-[#d63b33] shadow-sm rounded-[14px]"
                }`}
            >
              {isCompleted ? (
                <>Review Again ↻</>
              ) : (
                <>
                  Study <Play size={10} fill="currentColor" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
