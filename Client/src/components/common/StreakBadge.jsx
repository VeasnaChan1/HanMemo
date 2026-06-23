/* StreakBadge component */
import { Flame } from "lucide-react";

const StreakBadge = ({ count = 0, className = "" }) => {
  const hasStreak = count > 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-semibold text-sm transition-all duration-300
        ${hasStreak ? "text-[#E8453C]" : "text-[#9B9BB4]"} 
        ${className}`}
    >
      <Flame
        size={16}
        fill={hasStreak ? "currentColor" : "none"}
        className={hasStreak ? "animate-pulse" : "opacity-60"}
      />
      <span>{hasStreak ? `day ${count} streak` : "No active streak"}</span>
    </div>
  );
};

export default StreakBadge;
