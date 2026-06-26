import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackArrow from "../components/layout/BackArrow";
import Button from "../components/common/Button";
import FlashCard from "../components/flashcard/FlashCard";
import { ArrowLeft, ArrowRight, BookOpen, Award } from "lucide-react";

const FlashcardStudyPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams(); // Collect dynamic parameter string from route stack
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock array simulating real database rows loaded from userLessonApi / hsk1_complete.json
  const mockLessonVocabulary = [
    {
      id: "vocab-1",
      character: "家",
      pinyin: "jiā",
      translationKm: "ផ្ទះ / គ្រួសារ",
      translationEn: "Family / Home",
      exampleSentence: "我家有三口人。",
      exampleSentencePinyin: "Wǒ jiā yǒu sān kǒu rén.",
    },
    {
      id: "vocab-2",
      character: "爸爸",
      pinyin: "bàba",
      translationKm: "ឪពុក / ប៉ា",
      translationEn: "Father",
      exampleSentence: "我爸爸是老师。",
      exampleSentencePinyin: "Wǒ bàba shì lǎoshī.",
    },
    {
      id: "vocab-3",
      character: "妈妈",
      pinyin: "māma",
      translationKm: "ម្តាយ / ម៉ាក់",
      translationEn: "Mother",
      exampleSentence: "我妈妈喜欢喝茶。",
      exampleSentencePinyin: "Wǒ māma xǐhuān hē chá.",
    },
  ];

  const totalCards = mockLessonVocabulary.length;
  const currentCard = mockLessonVocabulary[currentIndex];

  // Safe progressive track percentage bounds calculation
  const sessionProgress =
    totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinishStudy = () => {
    // 1. Get existing items in the review queue or initialize an empty array
    const existingQueue =
      JSON.parse(localStorage.getItem("hanmemo_review_queue")) || [];

    // 2. Prevent adding duplicates by checking if the item ID already exists
    const updatedQueue = [...existingQueue];
    mockLessonVocabulary.forEach((vocab) => {
      if (!updatedQueue.some((item) => item.id === vocab.id)) {
        updatedQueue.push(vocab);
      }
    });

    // 3. Save back to localStorage to simulate pushing to the backend database
    localStorage.setItem("hanmemo_review_queue", JSON.stringify(updatedQueue));

    // 4. Route onward to the quiz or straight to reviews for testing
    navigate(`/lessons/${lessonId || "3"}/quiz`);
  };

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
                HSK1 - Lesson 3
              </p>
            </div>
          </div>

          {/* Dynamic Tracker Floating Badge Labels */}
          <span className="text-xs font-black bg-gray-100 text-[#4A4A6A] px-3 py-1.5 rounded-xl font-mono">
            {currentIndex + 1} / {totalCards}
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
          {currentCard ? (
            <FlashCard cardData={currentCard} />
          ) : (
            <div className="text-center p-6 bg-white border rounded-2xl shadow-sm">
              <p className="text-sm text-[#4A4A6A] font-medium">
                No vocabulary words found in this section.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 3. STEPPER CONTROLS ACTION TOOLBAR ROW */}
      <footer className="w-full bg-white border-t border-[#E8E8F0] px-6 py-5 sticky bottom-0">
        <div className="max-w-md mx-auto flex justify-between items-center gap-4">
          {/* Back Step Trigger Button */}
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={handlePrevious}
            className="flex-1 py-3 text-sm flex items-center justify-center gap-2 border-[#E8E8F0] text-[#4A4A6A] hover:bg-gray-50 disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Prev
          </Button>

          {/* Forward Step OR Finish Call-to-Action */}
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
    </div>
  );
};

export default FlashcardStudyPage;
