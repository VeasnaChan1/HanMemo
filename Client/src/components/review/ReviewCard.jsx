import { useState, useEffect } from "react";
import AudioButton from "../flashcard/AudioButton";
import RatingButtons from "./RatingButtons";

const ReviewCard = ({ reviewData, onScoreSubmitted }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const {
    id,
    character = "家",
    pinyin = "jiā",
    translationKm = "ផ្ទះ / គ្រួសារ",
    translationEn = "Family / Home",
    exampleSentence = "我家有三口人。",
    exampleSentencePinyin = "Wǒ jiā yǒu sān kǒu rén.",
  } = reviewData || {};

  // Automatically hide answers when a new word is requested
  useEffect(() => {
    setShowAnswer(false);
  }, [id]);

  const handleRatingSubmission = (scoreValue) => {
    if (onScoreSubmitted) {
      onScoreSubmitted({
        vocabularyId: id,
        rating: scoreValue,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5">
      {/* Main interactive information viewport block */}
      <div className="w-full min-h-70 bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm flex flex-col justify-between text-left transition-all duration-300">
        {/* Upper metadata/action row layer */}
        <div className="flex justify-between items-center w-full">
          <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-[#4A4A6A] px-2.5 py-1 rounded-lg">
            SRS Card
          </span>
          <AudioButton text={character} />
        </div>

        {/* Dynamic target rendering view zone */}
        <div className="grow flex flex-col justify-center items-center py-4">
          <h2 className="text-6xl font-bold text-[#1A1A2E] mb-2">
            {character}
          </h2>

          {!showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="text-xs font-bold text-[#E8453C] bg-[#FFF0EF] hover:bg-[#FFE2E0] px-4 py-2 rounded-xl transition-colors duration-200 mt-2 cursor-pointer"
            >
              Show Answer
            </button>
          )}
        </div>

        {/* Revealed details container context */}
        <div
          className={`flex flex-col gap-4 border-t border-[#E8E8F0] pt-4 transition-all duration-300
            ${showAnswer ? "opacity-100 max-h-40 visible" : "opacity-0 max-h-0 overflow-hidden invisible"}`}
        >
          <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-black text-[#E8453C]">{pinyin}</h3>
            <div className="text-right">
              <p className="text-sm font-bold text-[#1A1A2E]" lang="km">
                {translationKm}
              </p>
              <p className="text-xs text-[#4A4A6A] font-medium">
                {translationEn}
              </p>
            </div>
          </div>

          {exampleSentence && (
            <div className="bg-[#FAFAFA] p-2.5 rounded-xl border border-[#E8E8F0]">
              <span className="text-[10px] text-[#9B9BB4] font-bold uppercase tracking-wider block mb-0.5">
                Example Usage
              </span>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {exampleSentence}
              </p>
              <p className="text-xs text-[#4A4A6A] italic mt-0.5">
                {exampleSentencePinyin}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Render SRS evaluation choices control grid inline only if answer is revealed */}
      <div
        className={`transition-opacity duration-200 ${showAnswer ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <RatingButtons onRate={handleRatingSubmission} disabled={!showAnswer} />
      </div>
    </div>
  );
};

export default ReviewCard;
