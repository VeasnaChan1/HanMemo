import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import StreakBadge from "../components/common/StreakBadge";
import {
  RefreshCw,
  Check,
  ArrowRight,
  BookOpen,
  Play,
  GraduationCap,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { lessonApi } from "../api/lessonApi";
import { progressApi } from "../api/progressApi";

const getGreeting = () => {
  const hour = new Date().getHours();
  // Good morning: 5:00 AM – 11:59 AM
  if (hour >= 5 && hour < 12) return "Good morning";
  // Good afternoon: 12:00 PM – 5:59 PM
  if (hour >= 12 && hour < 18) return "Good afternoon";
  // Good evening: 6:00 PM – 4:59 AM
  return "Good evening";
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({
    dueReviews: 0,
    wordsLearnedToday: 0,
    reviewedToday: 0,
    wordsLearned: 0,
    repetitionPercentage: 0,
    completedLessons: 0,
    streak: user?.streak || 0,
  });

  // Redirect admin users away from learner dashboard
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const fetchedLessons = await lessonApi.getLessons(user?.hsk_level);
        setLessons(fetchedLessons);
      } catch {
        // Handle gracefully
      }

      try {
        const fetchedProgress = await progressApi.getProgress();
        setProgress(fetchedProgress || {});
      } catch {
        // Handle gracefully
      }

      setLoading(false);
    };

    loadDashboardData();
  }, [token]);

  const dashboardStats = {
    dueReviews: progress.dueReviews || 0,
    streakCount: progress.streak || user?.streak || 0,
    wordsLearnedToday: progress.wordsLearnedToday || 0,
    reviewedToday: progress.reviewedToday || 0,
    repetitionPercentage: progress.repetitionPercentage || 0,
    currentLesson: lessons.find((l) => !l.isCompleted && !l.isLocked)
      ? `HSK ${user?.hsk_level || 1} - Lesson ${lessons.find((l) => !l.isCompleted && !l.isLocked)?.lesson_number} - ${lessons.find((l) => !l.isCompleted && !l.isLocked)?.title}`
      : lessons[0]
      ? `HSK ${user?.hsk_level || 1} - Lesson ${lessons[0].lesson_number} - ${lessons[0].title}`
      : "No lessons available yet",
    completedItems: progress.completedLessons || 0,
    totalItems: lessons.length,
  };

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

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

  // Find first incomplete lesson to use for "Continue"
  const continueLesson =
    lessons.find((l) => !l.isCompleted && !l.isLocked) || lessons[0];

  if (loading) return <Loader fullScreen={true} />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-left">
      {/* TOP NAV BAR */}
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
              {getGreeting()}, {user?.name || "Learner"} 👋
            </h1>
            <StreakBadge count={dashboardStats.streakCount} />
          </div>
          <div className="w-12 h-12 rounded-full bg-[#E8453C] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "L"}
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: TODAY'S REVIEW */}
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

          {/* RIGHT: TRACKING METRICS */}
          <div className="flex flex-col gap-6">
            {/* WEEKLY ACTIVITY / QUICK STATS */}
            <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">Today's Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFAFA] p-4 rounded-xl text-center border border-[#E8E8F0]">
                  <p className="text-2xl font-black text-[#1A1A2E]">{dashboardStats.wordsLearnedToday}</p>
                  <p className="text-xs text-[#4A4A6A] font-medium mt-0.5">Words learned today</p>
                </div>
                <div className="bg-[#FAFAFA] p-4 rounded-xl text-center border border-[#E8E8F0]">
                  <p className="text-2xl font-black text-[#1A1A2E]">{dashboardStats.reviewedToday}</p>
                  <p className="text-xs text-[#4A4A6A] font-medium mt-0.5">Reviews today</p>
                </div>
              </div>
            </div>

            {/* QUICK STATS - RETENTION */}
            <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">Overall Engagement</h3>
              <div className="bg-[#FAFAFA] p-4 rounded-xl text-center border border-[#E8E8F0]">
                <p className="text-2xl font-black text-green-600">{dashboardStats.repetitionPercentage}%</p>
                <p className="text-xs text-[#4A4A6A] font-medium mt-0.5">Repetition percentage</p>
              </div>
            </div>
          </div>
        </div>

        {/* LESSON PROGRESS BAR */}
        <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-0.5">Lesson Progress</h3>
              <p className="text-xs text-[#9B9BB4] font-medium">{dashboardStats.currentLesson}</p>
            </div>
            <span className="text-xs font-bold text-[#4A4A6A]">
              {dashboardStats.completedItems} / {dashboardStats.totalItems}
            </span>
          </div>

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
              onClick={() =>
                continueLesson
                  ? navigate(`/lessons/${continueLesson.id}/study`)
                  : navigate("/lessons")
              }
            >
              Continue
            </Button>
          </div>
        </div>

        {/* LESSONS FROM API */}
        {lessons.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap size={20} className="text-[#E8453C]" />
                <h2 className="text-base font-bold text-[#1A1A2E]">
                  Your Lessons
                  <span className="ml-2 text-xs font-semibold text-[#9B9BB4] uppercase tracking-wide">
                    HSK {user?.hsk_level || 1}
                  </span>
                </h2>
              </div>
              <button
                onClick={() => navigate("/lessons")}
                className="text-xs font-bold text-[#E8453C] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.slice(0, 6).map((lesson) => {
                const isCompleted = lesson.isCompleted || false;
                const isLocked = lesson.isLocked || false;
                const wordCount =
                  lesson.wordCount ?? lesson.Vocabularies?.length ?? 0;

                return (
                  <div
                    key={lesson.id}
                    className={`bg-white border rounded-2xl p-5 flex flex-col justify-between h-44 transition-all duration-200
                      ${isLocked
                        ? "border-[#E8E8F0] opacity-60 bg-gray-50 select-none"
                        : "border-[#E8E8F0] hover:border-[#FFE2E0] hover:shadow-md cursor-pointer"
                      }`}
                    onClick={() => !isLocked && navigate(`/lessons/${lesson.id}/study`)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-[10px] font-bold text-[#9B9BB4] uppercase tracking-wider">
                          Lesson {lesson.lesson_number}
                        </p>
                        <h4 className="font-bold text-sm text-[#1A1A2E] line-clamp-2 leading-tight">
                          {lesson.title}
                        </h4>
                        <p className="text-[11px] text-[#9B9BB4] mt-0.5">
                          {wordCount} words
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isLocked ? (
                          <div className="p-1.5 rounded-xl bg-gray-200 text-gray-400">
                            <Lock size={15} />
                          </div>
                        ) : isCompleted ? (
                          <div className="p-1.5 rounded-xl bg-green-50 text-green-600">
                            <CheckCircle2 size={15} fill="currentColor" className="text-white" />
                          </div>
                        ) : (
                          <div className="text-[10px] font-black uppercase tracking-wider bg-[#FFF0EF] text-[#E8453C] px-2 py-1 rounded-lg">
                            Active
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      {isLocked ? (
                        <span className="text-[11px] text-gray-400 font-bold">Locked</span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lessons/${lesson.id}/study`);
                          }}
                          className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all
                            ${isCompleted
                              ? "border-[#E8E8F0] text-[#4A4A6A] hover:bg-gray-50"
                              : "bg-[#E8453C] border-[#E8453C] text-white hover:bg-[#d63b33] shadow-sm"
                            }`}
                        >
                          {isCompleted ? "Review" : "Study"}
                          {!isCompleted && <Play size={10} fill="currentColor" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EMPTY STATE — no lessons from API */}
        {lessons.length === 0 && !loading && (
          <div className="bg-white border border-[#E8E8F0] rounded-2xl p-10 text-center shadow-sm flex flex-col items-center gap-3">
            <BookOpen size={32} className="text-[#E8453C] opacity-40" />
            <p className="text-sm text-[#9B9BB4] font-medium">
              No lessons available yet. Check back soon!
            </p>
            <Button variant="outline" onClick={() => navigate("/lessons")}>
              Browse Lessons
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
