/* LessonsPage component */
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import NavBar from "../components/layout/NavBar";
import BackArrow from "../components/layout/BackArrow";
import Loader from "../components/common/Loader";
import LessonCard from "../components/lesson/LessonCard";
import { BookOpen, GraduationCap } from "lucide-react";

const LessonsPage = () => {
  const navigate = useNavigate();

  // Dynamic request using our custom fetch hook mapping the global backend API route
  const { data: lessons, loading, error, refetch } = useFetch("/lessons");

  const handleLessonLaunch = (lessonId) => {
    // Navigates learners to the intermediate introductory brief or study screen
    navigate(`/lessons/${lessonId}/study`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-left">
      {/* 1. LAYOUT RESPONSIVE TOP NAV BAR HEADERS */}
      <NavBar />

      {/* 2. MAIN HUB CURRICULUM PORT VIEWPORT GRID */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6 mb-16 md:mb-0">
        {/* Top Context Subheader Controls Layer */}
        <div className="flex items-center justify-between border-b border-[#E8E8F0] pb-4">
          <div className="flex items-center gap-3">
            <BackArrow fallbackUrl="/dashboard" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <GraduationCap className="text-[#E8453C]" size={26} />
                Learning Paths
              </h1>
              <p className="text-xs font-semibold text-[#9B9BB4] uppercase tracking-wider mt-0.5">
                Structured Curriculum Levels
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold bg-[#FFF0EF] text-[#E8453C] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <BookOpen size={12} /> HSK Level 1
            </span>
          </div>
        </div>

        {/* Asynchronous Lifecycle UI Status Checks Switch Matrix */}
        {loading ? (
          <div className="grow flex items-center justify-center min-h-75">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="w-full max-w-md mx-auto text-center bg-white border border-[#E8E8F0] p-8 rounded-2xl shadow-sm my-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xl">
              !
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#1A1A2E]">
                Failed to load curriculum
              </h3>
              <p className="text-sm text-[#9B9BB4] mt-1">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="text-xs font-bold bg-[#E8453C] hover:bg-[#d63b33] text-white px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Try Again Refresh
            </button>
          </div>
        ) : !lessons || lessons.length === 0 ? (
          // Empty State Fallback Rendering Zone
          <div className="w-full text-center bg-white border border-[#E8E8F0] p-12 rounded-2xl shadow-sm">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#1A1A2E]">
              No Lessons Available
            </h3>
            <p className="text-xs text-[#9B9BB4] mt-0.5">
              There are no learning modules attached to this path yet.
            </p>
          </div>
        ) : (
          // Standard Grid Rendering Target Core Container Loop
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStartLesson={handleLessonLaunch}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonsPage;
