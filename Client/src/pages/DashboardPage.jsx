import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import StreakBadge from "../components/common/StreakBadge";
import { RefreshCw, Check, ArrowRight } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simulated content initial fetch mapping setup to demonstrate Loader integration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // Quick state transition smooth render
    return () => clearTimeout(timer);
  }, []);

  // Mock metric counters mirroring your backend database entities and figma layout details
  const dashboardStats = {
    dueReviews: 14,
    streakCount: 7,
    wordsLearned: 48,
    retentionRate: "76%",
    currentLesson: "HSK1 - Lesson 3 - Family",
    completedItems: 12, // User completed items
    totalItems: 15, // Total items in current lesson path
  };

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  // Compute progress bar percentage safely, managing boundary conditions
  const progressPercentage =
    dashboardStats.totalItems > 0
      ? Math.min(
          Math.max(
            (dashboardStats.completedItems / dashboardStats.totalItems) * 100,
            0,
          ),
          100,
        )
      : 0;

  // Render full screen loader if tracking states haven't updated yet
  if (loading) {
    return <Loader fullScreen={true} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-left">
      {/* INTERNAL CLIENT TOP NAV BAR */}
      <nav className="w-full bg-white border-b border-[#E8E8F0] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="font-bold text-2xl text-[#E8453C] tracking-wide">
            Han<span className="text-[#1A1A2E]">MEMO</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-sm text-[#4A4A6A]">
            <span className="text-[#E8453C] font-bold border-b-2 border-[#E8453C] pb-1 cursor-pointer">
              Home
            </span>
            <span
              className="hover:text-[#E8453C] transition-colors cursor-pointer"
              onClick={() => navigate("/lessons")}
            >
              Lesson
            </span>
            <span
              className="hover:text-[#E8453C] transition-colors cursor-pointer"
              onClick={() => navigate("/reviews/session")}
            >
              Review
            </span>
            <span
              className="hover:text-[#E8453C] transition-colors cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              Profile
            </span>
            <button
              onClick={logout}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* DASHBOARD GRID CONTENT */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {/* STUDENT PROFILE SUMMARY HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#1A1A2E]">
              Good morning, {user?.name || "Eychhean"}
            </h1>
            {/* Integrated your completed custom reusable common StreakBadge component */}
            <StreakBadge count={dashboardStats.streakCount} />
          </div>
          {/* User Rounded Avatar Icon */}
          <div className="w-12 h-12 rounded-full bg-[#E8453C] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "E"}
          </div>
        </div>

        {/* METRICS ROW SEPARATORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: TODAY'S SRS FLASHCARD REVIEW INTERFACE PANEL */}
          <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1A2E] mb-4">
              <RefreshCw size={16} className="text-[#E8453C]" /> Today's Review
            </div>

            <div className="text-center my-6 flex flex-col items-center">
              <span className="text-6xl font-black text-[#1A1A2E]">
                {dashboardStats.dueReviews}
              </span>
              <span className="text-xs text-[#9B9BB4] font-medium mt-1 uppercase tracking-wider">
                words due today
              </span>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate("/reviews/session")}
              className="flex items-center justify-center gap-2"
            >
              Start Review <ArrowRight size={16} />
            </Button>
          </div>

          {/* RIGHT: TRACKING METRICS BOX WRAPPERS */}
          <div className="flex flex-col gap-6">
            {/* WEEKLY ACTIVITY REPETITION GRID */}
            <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">
                7-day streak
              </h3>
              <div className="flex justify-between items-center max-w-sm">
                {weekdays.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-xs font-semibold text-[#9B9BB4]">
                      {day}
                    </span>
                    {/* Highlighted active consecutive daily target tracking days */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                      ${idx < 6 ? "bg-[#E8453C] text-white" : "bg-gray-100 text-[#9B9BB4]"}`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PLATFORM QUICK RETENTION COGNITIVE STATES */}
            <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">
                Quick States
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFAFA] p-4 rounded-xl text-center border border-[#E8E8F0]">
                  <p className="text-2xl font-black text-[#1A1A2E]">
                    {dashboardStats.wordsLearned}
                  </p>
                  <p className="text-xs text-[#4A4A6A] font-medium mt-0.5">
                    Words learned
                  </p>
                </div>
                <div className="bg-[#FAFAFA] p-4 rounded-xl text-center border border-[#E8E8F0]">
                  <p className="text-2xl font-black text-green-600">
                    {dashboardStats.retentionRate}
                  </p>
                  <p className="text-xs text-[#4A4A6A] font-medium mt-0.5">
                    Retention
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: LESSON PROGRESS TIMELINE CONTINUATION BAR */}
        <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-0.5">
                Lesson Progress
              </h3>
              <p className="text-xs text-[#9B9BB4] font-medium">
                {dashboardStats.currentLesson}
              </p>
            </div>
            {/* Numeric visual label for user completions */}
            <span className="text-xs font-bold text-[#4A4A6A]">
              {dashboardStats.completedItems} / {dashboardStats.totalItems}
            </span>
          </div>

          {/* Dynamic computed progress bar track */}
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E8453C] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="max-w-35 mt-1">
            <Button
              variant="outline"
              className="py-2 text-sm text-[#E8453C] border-[#E8453C] hover:bg-[#FFF0EF]"
              onClick={() => navigate("/lessons/study")}
            >
              Continue
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
