import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import BackArrow from "../components/layout/BackArrow";
import Loader from "../components/common/Loader";
import LessonCard from "../components/lesson/LessonCard";
import { BookOpen, GraduationCap } from "lucide-react";
import { lessonApi } from "../api/lessonApi";
import { useAuth } from "../hooks/useAuth";

const LessonsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all lessons across all decks without passing a specific level
        const fetchedLessons = await lessonApi.getLessons();
        setLessons(fetchedLessons);
      } catch (err) {
        setError("Unable to load lessons right now.");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  const handleLessonLaunch = (lessonId) => {
    navigate(`/lessons/${lessonId}/study`);
  };

  // Group lessons by HSK Level (Deck)
  const groupedLessons = useMemo(() => {
    return lessons.reduce((acc, lesson) => {
      const level = lesson.Deck?.hsk_level || 1;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(lesson);
      return acc;
    }, {});
  }, [lessons]);

  const hskLevels = Object.keys(groupedLessons).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-left">
      <NavBar />

      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6 mb-16 md:mb-0">
        <div className="flex items-center justify-between border-b border-[#E8E8F0] pb-4">
          <div className="flex items-center gap-3">
            <BackArrow fallbackUrl="/dashboard" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <GraduationCap className="text-[#E8453C]" size={26} />
                Learning Paths
              </h1>
              <p className="text-xs font-semibold text-[#9B9BB4] uppercase tracking-wider mt-0.5">
                Explore all available HSK decks
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold bg-[#FFF0EF] text-[#E8453C] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <BookOpen size={12} /> Your Goal: HSK Level {user?.hsk_level || 1}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-[#9B9BB4] font-medium mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8453C] inline-block" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Locked
          </span>
        </div>

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
          <div className="flex flex-col gap-10">
            {hskLevels.map((level) => (
              <div key={level} className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[#1A1A2E] border-b border-[#E8E8F0] pb-2">
                  HSK Level {level}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedLessons[level].map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      onStartLesson={handleLessonLaunch}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonsPage;
