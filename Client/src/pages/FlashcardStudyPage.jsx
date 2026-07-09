import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrow from "../components/layout/BackArrow";
import Button from "../components/common/Button";
import FlashCard from "../components/flashcard/FlashCard";
import Loader from "../components/common/Loader";
import { ArrowLeft, ArrowRight, BookOpen, Award } from "lucide-react";
import { lessonApi } from "../api/lessonApi";

const FlashcardStudyPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vocabulary, setVocabulary] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await lessonApi.getLessonById(lessonId);
        setLesson(data);
        // Map server fields → FlashCard shape
        const vocabList = (data?.Vocabularies || data?.vocabulary || []).map((v) => ({
          id: v.id,
          character: v.hanzi,
          pinyin: v.pinyin,
          translationKm: v.definition_km || "",
          translationEn: v.definition_en || "",
          exampleSentence: v.example_cn || "",
          exampleSentencePinyin: v.example_pinyin || "",
          exampleTranslationEn: v.example_en || "",
          exampleTranslationKm: v.example_km || "",
        }));
        setVocabulary(vocabList);
      } catch {
        setError("Could not load this lesson. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (lessonId) loadLesson();
  }, [lessonId]);

  const totalCards = vocabulary.length;
  const currentCard = vocabulary[currentIndex];

  const sessionProgress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < totalCards - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleFinishStudy = () => {
    navigate(`/lessons/${lessonId}/quiz`);
  };

  const lessonLabel = lesson
    ? `HSK ${lesson.Deck?.hsk_level || ""} · Lesson ${lesson.lesson_number} — ${lesson.title}`
    : `Lesson ${lessonId}`;

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E8E8F0] rounded-2xl p-10 text-center max-w-sm shadow-sm flex flex-col gap-4">
          <p className="text-sm text-[#9B9BB4]">{error}</p>
          <Button variant="outline" onClick={() => navigate("/lessons")}>
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between text-left">
      {/* 1. SESSION STICKY TOP MANAGEMENT HEADER */}
      <header className="w-full bg-white border-b border-[#E8E8F0] px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackArrow fallbackUrl="/lessons" />
            <div>
              <h2 className="text-sm font-bold text-[#1A1A2E] flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#E8453C]" />
                Learning New Words
              </h2>
              <p className="text-[11px] font-bold text-[#9B9BB4] uppercase tracking-wider">
                {lessonLabel}
              </p>
            </div>
          </div>

          <span className="text-xs font-black bg-gray-100 text-[#4A4A6A] px-3 py-1.5 rounded-xl font-mono">
            {totalCards > 0 ? `${currentIndex + 1} / ${totalCards}` : "—"}
          </span>
        </div>

        {/* Micro Session Horizontal Progress Indicator */}
        <div className="max-w-xl mx-auto w-full bg-gray-100 h-1 mt-4 rounded-full overflow-hidden">
          <div
            className="bg-[#E8453C] h-full transition-all duration-300 ease-out"
            style={{ width: `${sessionProgress}%` }}
          />
        </div>
      </header>

      {/* 2. CARD VIEWPORT INTERFACE DISPLAY */}
      <main className="grow flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {totalCards === 0 ? (
            <div className="text-center p-8 bg-white border border-[#E8E8F0] rounded-2xl shadow-sm flex flex-col gap-4">
              <p className="text-sm text-[#4A4A6A] font-medium">
                No vocabulary words found in this lesson yet.
              </p>
              <Button variant="outline" onClick={() => navigate("/lessons")}>
                Back to Lessons
              </Button>
            </div>
          ) : currentCard ? (
            <FlashCard cardData={currentCard} />
          ) : null}
        </div>
      </main>

      {/* 3. STEPPER CONTROLS ACTION TOOLBAR ROW */}
      {totalCards > 0 && (
        <footer className="w-full bg-white border-t border-[#E8E8F0] px-6 py-5 sticky bottom-0">
          <div className="max-w-md mx-auto flex justify-between items-center gap-4">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={handlePrevious}
              className="flex-1 py-3 text-sm flex items-center justify-center gap-2 border-[#E8E8F0] text-[#4A4A6A] hover:bg-gray-50 disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Prev
            </Button>

            {currentIndex === totalCards - 1 ? (
              <Button
                variant="primary"
                onClick={handleFinishStudy}
                className="flex-1 py-3 text-sm flex items-center justify-center gap-2 bg-green-600 border-green-600 hover:bg-green-700 shadow-sm text-white font-bold"
              >
                Take Quiz <Award size={16} />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex-1 py-3 text-sm flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};

export default FlashcardStudyPage;
