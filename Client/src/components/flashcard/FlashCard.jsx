import { useState } from "react";
import AudioButton from "./AudioButton";

const FlashCard = ({ cardData }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock safety values fallback structure
  const {
    character = "",
    pinyin = "",
    translationKm = "",
    translationEn = "",
    exampleSentence = "",
    exampleSentencePinyin = "",
    exampleTranslationEn = "",
    exampleTranslationKm = "",
  } = cardData || {};

  return (
    <div
      className="w-full max-w-md h-80 mx-auto cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Card Inner Rotator Wrapper Container */}
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out select-none"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT SIDE (Character view block) */}
        <div
          className="absolute w-full h-full bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Top Audio Layer Action Row */}
          <div className="flex justify-end w-full">
            <AudioButton text={character} />
          </div>

          {/* Core Hanzi Render Zone */}
          <div className="text-center grow flex flex-col justify-center items-center -mt-4">
            <h2 className="text-6xl font-bold text-[#1A1A2E] tracking-normal mb-2">
              {character}
            </h2>
            <p className="text-sm text-[#9B9BB4] tracking-wider uppercase">
              Click to reveal meaning
            </p>
          </div>
        </div>

        {/* BACK SIDE (Translations and semantic details context) */}
        <div
          className="absolute w-full h-full bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm flex flex-col justify-between text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Top Section - Simplified Pinyin Metadata */}
          <div>
            <span className="text-xs font-semibold bg-[#FFF0EF] text-[#E8453C] px-3 py-1 rounded-full uppercase tracking-wider">
              Pinyin
            </span>
            <h3 className="text-2xl font-black text-[#E8453C] mt-2.5">
              {pinyin}
            </h3>
          </div>

          {/* Middle Section - Language Translation Strings */}
          <div className="flex flex-col gap-2 my-2">
            <p className="text-xl font-bold text-[#1A1A2E]" lang="km">
              {translationKm}
            </p>
            <p className="text-base text-[#4A4A6A] font-medium">
              {translationEn}
            </p>
          </div>

          {/* Bottom Section - Context Sentence Box */}
          {exampleSentence && (
            <div className="border-t border-[#E8E8F0] pt-3 text-left">
              <span className="text-[11px] text-[#9B9BB4] font-bold uppercase tracking-wider block mb-0.5">
                Example Context
              </span>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {exampleSentence}
              </p>
              <p className="text-xs text-[#4A4A6A] italic mt-0.5">
                {exampleSentencePinyin}
              </p>
              <div className="mt-1.5 flex flex-col gap-0.5">
                {exampleTranslationKm && (
                  <p className="text-xs text-[#4A4A6A]" lang="km">
                    {exampleTranslationKm}
                  </p>
                )}
                {exampleTranslationEn && (
                  <p className="text-xs text-[#9B9BB4]">
                    {exampleTranslationEn}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
