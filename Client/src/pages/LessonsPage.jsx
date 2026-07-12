import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import BackArrow from "../components/layout/BackArrow";
import Loader from "../components/common/Loader";
import LessonCard from "../components/lesson/LessonCard";
import { BookOpen, GraduationCap, Lock, Play, CheckCircle2 } from "lucide-react";
import { lessonApi } from "../api/lessonApi";
import { useAuth } from "../hooks/useAuth";

const LessonsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true);
      setError("");
      try {
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

  const groupedLessons = useMemo(() => {
    return lessons.reduce((acc, lesson) => {
      const level = lesson.Deck?.hsk_level || 1;
      if (!acc[level]) acc[level] = [];
      acc[level].push(lesson);
      return acc;
    }, {});
  }, [lessons]);

  const renderDecksView = () => {
    const levelsToRender = [1, 2, 3, 4, 5, 6];
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {levelsToRender.map((level) => {
          const deckLessons = groupedLessons[level];
          const hasData = deckLessons && deckLessons.length > 0;
          
          if (!hasData) {
            // Stop rendering further empty levels if we are past level 4
            if (level > 4) return null;
            return (
              <div key={level} className="w-full p-6 rounded-2xl border border-[#E8E8F0] bg-gray-50 flex flex-col justify-between h-56 opacity-70">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-[#1A1A2E]">HSK Level {level}</h3>
                  <Lock size={18} className="text-gray-400" />
                </div>
                <div className="mt-4 flex flex-col gap-2 items-center justify-center h-full text-center px-2">
                  <p className="text-xs font-semibold text-[#9B9BB4]">Wait, the lessons will be coming up soon!</p>
                </div>
              </div>
            );
          }

          const totalWords = deckLessons.reduce((acc, l) => acc + (l.wordCount || 0), 0);
          const completedWords = deckLessons.reduce((acc, l) => acc + (l.isCompleted ? (l.wordCount || 0) : (l.completed_words || 0)), 0);
          const progressPct = totalWords > 0 ? Math.min(Math.max((completedWords / totalWords) * 100, 0), 100) : 0;
          const allCompleted = deckLessons.every(l => l.isCompleted);
          
          let isDeckLocked = false;
          if (level > 1) {
            const prevDeck = groupedLessons[level - 1];
            if (!prevDeck || prevDeck.length === 0 || !prevDeck.every(l => l.isCompleted)) {
              isDeckLocked = true;
            }
          }

          return (
            <div key={level} 
              className={`w-full p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-56 bg-white
                ${isDeckLocked ? "border-[#E8E8F0] bg-gray-50 opacity-70" : "border-[#E8E8F0] hover:border-[#FFE2E0] hover:shadow-md cursor-pointer"}
                ${!isDeckLocked && level === user?.hsk_level ? "ring-2 ring-[#E8453C] ring-offset-2" : ""}
              `}
              onClick={() => !isDeckLocked && setSelectedLevel(level)}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-xl text-[#1A1A2E]">HSK Level {level}</h3>
                  <p className="text-xs font-semibold text-[#9B9BB4]">{totalWords} vocabulary words</p>
                </div>
                {isDeckLocked ? (
                  <Lock size={18} className="text-gray-400" />
                ) : allCompleted ? (
                  <div className="text-[10px] leading-none font-black uppercase tracking-wider bg-green-50 text-green-600 px-2.5 py-1 rounded-lg flex items-center justify-center gap-1 shrink-0">
                    <CheckCircle2 size={12} fill="currentColor" className="text-white relative top-[0.5px]" /> 
                    <span className="pt-[1px]">Completed</span>
                  </div>
                ) : (
                  <div className="text-[10px] leading-none font-black uppercase tracking-wider bg-[#FFF0EF] text-[#E8453C] px-2.5 py-1 rounded-lg flex items-center justify-center gap-1 shrink-0">
                    <Play size={10} fill="currentColor" className="relative top-[0.5px]" /> 
                    <span className="pt-[1px]">Active</span>
                  </div>
                )}
              </div>

              {!isDeckLocked ? (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="w-full flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-[#4A4A6A]">
                      <span>{allCompleted ? "Mastery" : "Progress"}</span>
                      <span className={allCompleted ? "text-green-600" : "text-[#E8453C]"}>
                        {allCompleted ? "100%" : `${completedWords}/${totalWords}`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${allCompleted ? "bg-green-500" : "bg-[#E8453C]"}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                  <button className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2
                    ${allCompleted ? "text-[#4A4A6A] bg-gray-50 hover:bg-gray-100 border-[#E8E8F0]" : "text-white bg-[#E8453C] border-[#E8453C] hover:bg-[#d63b33]"}`}>
                    {allCompleted ? "Review Again ↻" : "Continue Learning →"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                   <div className="w-full flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-[#9B9BB4]">
                      <span>Locked</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden" />
                  </div>
                  <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-400 bg-gray-100 border border-transparent">
                    Complete HSK {level - 1} First
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderLessonsView = () => {
    const levelLessons = groupedLessons[selectedLevel] || [];
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-[#1A1A2E] border-b border-[#E8E8F0] pb-2">
          HSK Level {selectedLevel}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levelLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onStartLesson={handleLessonLaunch}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-left">
      <NavBar />

      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex flex-col gap-6 mb-16 md:mb-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E8E8F0] pb-4 gap-4">
          <div className="flex items-center gap-3">
            {selectedLevel ? (
              <button 
                onClick={() => setSelectedLevel(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
            ) : (
              <BackArrow fallbackUrl="/dashboard" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <GraduationCap className="text-[#E8453C]" size={26} />
                Learning Paths
              </h1>
              <p className="text-xs font-semibold text-[#9B9BB4] uppercase tracking-wider mt-0.5">
                {selectedLevel ? `Explore all available HSK Decks` : `Explore all HSK levels`}
              </p>
            </div>
          </div>

          <div className="text-right">
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
        ) : lessons.length === 0 ? (
          <div className="w-full text-center bg-white border border-[#E8E8F0] p-12 rounded-2xl shadow-sm">
            <h3 className="font-bold text-base text-[#1A1A2E]">
              No Lessons Found
            </h3>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {selectedLevel ? renderLessonsView() : renderDecksView()}
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonsPage;
