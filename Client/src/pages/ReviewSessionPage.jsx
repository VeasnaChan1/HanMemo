import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../components/review/ReviewCard";
import BackArrow from "../components/layout/BackArrow";
import NavBar from "../components/layout/NavBar";
import Loader from "../components/common/Loader";
import { BookOpen } from "lucide-react";
import { reviewApi } from "../api/reviewApi";

const ReviewSessionPage = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch due-review cards from the real API on mount
  useEffect(() => {
    const loadDueWords = async () => {
      setLoading(true);
      setError("");
      try {
        const cards = await reviewApi.getDueWords();
        setQueue(cards || []);
      } catch {
        setError("Could not load your review queue. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadDueWords();
  }, []);

  const handleScoreSubmitted = async ({ reviewSessionId, rating }) => {
    // Submit rating to the backend (fire-and-forget; don't block UI)
    reviewApi.submitCardRating(reviewSessionId, rating).catch(console.error);

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    if (nextIndex >= queue.length) {
      navigate("/review-complete");
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) return <Loader fullScreen />;

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm max-w-md flex flex-col gap-4">
          <p className="text-sm text-[#9B9BB4]">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-[#E8453C] text-white py-2.5 rounded-xl font-bold hover:bg-[#d63b32] transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Empty queue ────────────────────────────────────────────────────────────
  if (queue.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm max-w-md">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">
            Your Queue is Empty!
          </h1>
          <p className="text-[#9B9BB4] mb-6 text-sm">
            You don't have any flashcards to review yet. Go finish a lesson
            first to push new words here!
          </p>
          <button
            onClick={() => navigate("/lessons")}
            className="w-full bg-[#E8453C] text-white py-2.5 rounded-xl font-bold hover:bg-[#d63b32] transition-colors cursor-pointer"
          >
            Go to Lessons
          </button>
        </div>
      </div>
    );
  }

  // Safety guard against array out-of-bounds rendering
  if (currentIndex >= queue.length) return null;

  const currentCard = queue[currentIndex];
  const progressPercent = ((currentIndex + 1) / queue.length) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <NavBar />
      <div className="flex flex-col justify-between grow py-6 px-4">
        {/* HEADER SECTION WITH PROGRESS TRACKER */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between mb-4">
          <BackArrow fallbackUrl="/dashboard" />

        <div className="text-right">
          <span className="text-xs font-bold text-[#4A4A6A] flex items-center gap-1 justify-end">
            <BookOpen size={12} /> Card {currentIndex + 1} of {queue.length}
          </span>
          <div className="w-32 bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-[#E8453C] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* RENDER CURRENT SRS INTERACTIVE CARD */}
      <div className="grow flex items-center justify-center w-full">
        <ReviewCard
          reviewData={currentCard}
          onScoreSubmitted={handleScoreSubmitted}
        />
      </div>

        {/* BOTTOM FOOTER TIP */}
        <div className="w-full max-w-md mx-auto text-center mt-4 mb-16 md:mb-0">
          <span className="text-[11px] text-[#9B9BB4] font-medium tracking-wide">
            Tip: Tap "Show Answer" to reveal meaning details and make your score
            rating selection.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewSessionPage;
