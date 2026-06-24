import React from "react";
import { useNavigate } from "react-router-dom";
// import useFetch from "../hooks/useFetch"; // Commented out temporarily for testing
import { testLessonsData } from "../data/mockLessons"; // Clear mock data file input target
import NavBar from "../components/layout/NavBar";
import BackArrow from "../components/layout/BackArrow";
import Loader from "../components/common/Loader";
import LessonCard from "../components/lesson/LessonCard";
import { BookOpen, GraduationCap } from "lucide-react";

const LessonsPage = () => {
  const navigate = useNavigate();

  // --- Live Mode Handler Loop (Toggle on when ready) ---
  // const { data: lessons, loading, error, refetch } = useFetch("/lessons");

  // --- Test Simulation Variables ---
  const lessons = testLessonsData;
  const loading = false;
  const error = null;

  const handleLessonLaunch = (lessonId) => {
    navigate(`/lessons/${lessonId}/study`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-left">
      {/* Horizontal Desktop Navbar / Bottom Mobile Tracker Layout wrapper */}
      <NavBar />

      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6 mb-16 md:mb-0">
        {/* Upper Header Grid Subsections Context */}
        <div className="flex items-center justify-between border-b border-[#E8E8F0] pb-4">
          <div className="flex items-center gap-3">
            <BackArrow fallbackUrl="/dashboard" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <GraduationCap className="text-[#E8453C]" size={26} />
                Learning Paths
              </h1>
              <p className="text-xs font-semibold text-[#9B9BB4] uppercase tracking-wider mt-0.5">
                Testing responsive states, lock and completion cards
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold bg-[#FFF0EF] text-[#E8453C] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <BookOpen size={12} /> HSK Level 1
            </span>
          </div>
        </div>

        {/* Evaluation Conditional Switches Render Matrix */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center min-h-[300px]">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="w-full max-w-md mx-auto text-center bg-white border border-[#E8E8F0] p-8 rounded-2xl shadow-sm my-12 flex flex-col items-center gap-4">
            <p className="text-sm text-[#9B9BB4]">{error}</p>
          </div>
        ) : !lessons || lessons.length === 0 ? (
          <div className="w-full text-center bg-white border border-[#E8E8F0] p-12 rounded-2xl shadow-sm">
            <h3 className="font-bold text-base text-[#1A1A2E]">
              No Lessons Found
            </h3>
          </div>
        ) : (
          /* Cards Layout Core Loop Grid System viewport view wrapper */
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
