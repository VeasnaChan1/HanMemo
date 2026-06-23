import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import axiosInstance from "../api/axios";
import ReviewCard from "../components/review/ReviewCard";
import Loader from "../components/common/Loader";
import BackArrow from "../components/layout/BackArrow";

const ReviewSessionPage = () => {
  const navigate = useNavigate();

  // Fetch due cards from the SRS review queue endpoint
  const { data: queue, loading, error } = useFetch("/api/reviews/queue");

  // Track index of the active card being reviewed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically forward to completion page if queue finishes or is empty
  useEffect(() => {
    if (queue && queue.length > 0 && currentIndex >= queue.length) {
      navigate("/review-complete");
    }
  }, [currentIndex, queue, navigate]);

  const handleScoreSubmitted = async ({ vocabularyId, rating }) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Send the SM-2 evaluation rating to your backend
      await axiosInstance.post("/api/reviews/submit", {
        vocabularyId,
        rating, // 1: Again, 2: Hard, 3: Good, 4: Easy
      });

      // Move onto the next flashcard item in line
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (err) {
      console.error("Failed to submit card review rating score:", err);
      alert("Could not save your rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Failed to Load Reviews
          </h2>
          <p className="text-[#4A4A6A] text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#E8453C] text-white py-2.5 rounded-xl font-bold hover:bg-[#d63b32] transition-colors cursor-pointer"
          >
            Retry Session
          </button>
        </div>
      </div>
    );
  }

  // Handle case where there are no cards currently due for review
  if (!queue || queue.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm max-w-md">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">
            All Caught Up!
          </h1>
          <p className="text-[#9B9BB4] mb-6 text-sm">
            You don't have any flashcards due for review right now. Keep
            finishing new lessons to add more items to your queue.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-[#1A1A2E] text-white py-2.5 rounded-xl font-bold hover:bg-[#2A2A4E] transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Guard against out-of-bounds rendering during final redirection cycles
  if (currentIndex >= queue.length) return null;

  const currentCard = queue[currentIndex];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-between py-6 px-4">
      {/* Top Header Row */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <BackArrow to="/dashboard" />

        {/* Progress HUD indicator bar */}
        <div className="text-right">
          <span className="text-xs font-bold text-[#4A4A6A]">
            Card {currentIndex + 1} of {queue.length}
          </span>
          <div className="w-32 bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-[#E8453C] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Card Subsystem Container */}
      <div
        className={`grow flex items-center justify-center w-full ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}
      >
        <ReviewCard
          reviewData={currentCard}
          onScoreSubmitted={handleScoreSubmitted}
        />
      </div>

      {/* Bottom Status Info Spacer node */}
      <div className="w-full max-w-md text-center mt-4">
        <span className="text-[11px] text-[#9B9BB4] font-medium tracking-wide">
          Tip: Tap "Show Answer" to reveal meaning details and make your score
          rating selection.
        </span>
      </div>
    </div>
  );
};

export default ReviewSessionPage;
