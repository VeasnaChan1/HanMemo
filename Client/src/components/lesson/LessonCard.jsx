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
  } = lesson || {};

  const totalItems = wordCount || 0;
  const completedItems = isCompleted ? totalItems : 0;

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
            <div className="w-[22px] h-[22px] rounded-full border-[5px] border-[#ECFDF3]" />
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
        <div className="flex justify-end items-center">
          {!isLocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartLesson && onStartLesson(id);
              }}
              className={`text-sm font-bold transition-all duration-200 flex items-center gap-1.5 py-2 px-5 rounded-[14px] border
                ${
                  isCompleted
                    ? "text-[#4A4A6A] border-[#E8E8F0] bg-white hover:bg-gray-50 hover:border-gray-300"
                    : "text-white bg-[#E8453C] border-[#E8453C] hover:bg-[#d63b33] shadow-sm"
                }`}
            >
              {isCompleted ? "Review" : "Study"}
              {!isCompleted && <Play size={10} fill="currentColor" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
