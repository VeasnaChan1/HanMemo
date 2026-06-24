import { useState, useEffect } from "react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

const QuizQuestion = ({ questionData, onAnswerSelected }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Fallback defaults structure mapping if keys are empty
  const {
    id,
    promptText = "What does this mean?",
    targetWord = "家",
    options = [
      { id: "1", text: "Family / Home", isCorrect: true },
      { id: "2", text: "Water", isCorrect: false },
      { id: "3", text: "School", isCorrect: false },
      { id: "4", text: "Friend", isCorrect: false },
    ],
  } = questionData || {};

  // Reset selected configurations if parent slides into a new question card entity context
  useEffect(() => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
  }, [id]);

  const handleOptionClick = (option) => {
    if (hasSubmitted) return; // Prevent clicking again once submitted

    setSelectedOptionId(option.id);
    setHasSubmitted(true);

    // Bubble up selected metadata results back to the master page loop controller state after a slight delay
    if (onAnswerSelected) {
      setTimeout(() => {
        onAnswerSelected({
          questionId: id,
          optionId: option.id,
          isCorrect: option.isCorrect,
        });
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-[#E8E8F0] p-6 rounded-2xl shadow-sm text-left flex flex-col gap-6">
      {/* Top Header Row Info Segment */}
      <div className="flex items-center gap-2 text-sm font-bold text-[#4A4A6A]">
        <HelpCircle size={16} className="text-[#E8453C]" />
        <span>{promptText}</span>
      </div>

      {/* Primary Prominent Central Question Graphic Text Box */}
      <div className="bg-[#FAFAFA] border border-[#E8E8F0] rounded-xl p-8 text-center">
        <h2 className="text-5xl font-black text-[#1A1A2E] tracking-tight">
          {targetWord}
        </h2>
      </div>

      {/* Grid List Matrix Selection Option Buttons */}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isCurrentChoice = selectedOptionId === option.id;

          // Compute option dynamic conditional theme styles based on evaluation states
          let buttonStyles =
            "border-[#E8E8F0] hover:border-[#FFE2E0] hover:bg-[#FFF0EF]/20 text-[#1A1A2E]";
          let IconComponent = null;

          if (hasSubmitted) {
            if (option.isCorrect) {
              // Highlight the true answer target regardless of choice
              buttonStyles =
                "border-green-500 bg-green-50 text-green-700 font-semibold shadow-sm";
              IconComponent = (
                <CheckCircle size={18} className="text-green-600" />
              );
            } else if (isCurrentChoice && !option.isCorrect) {
              // Highlight wrong choices if chosen explicitly by user
              buttonStyles =
                "border-red-500 bg-red-50 text-red-700 font-semibold shadow-sm";
              IconComponent = <XCircle size={18} className="text-red-600" />;
            } else {
              // Dim downstream idle wrong options
              buttonStyles = "border-[#E8E8F0] opacity-50 text-[#4A4A6A]";
            }
          } else if (isCurrentChoice) {
            // Selected active accent color
            buttonStyles =
              "border-[#E8453C] bg-[#FFF0EF] text-[#E8453C] font-semibold";
          }

          return (
            <button
              key={option.id}
              disabled={hasSubmitted}
              onClick={() => handleOptionClick(option)}
              className={`w-full p-4 rounded-xl border text-base transition-all duration-200 flex items-center justify-between text-left focus:outline-none font-medium
                ${hasSubmitted ? "cursor-default" : "cursor-pointer"}
                ${buttonStyles}`}
            >
              <span
                className={
                  option.text.match(/[\u4e00-\u9fa5]/)
                    ? "text-lg font-bold"
                    : "text-sm font-medium"
                }
              >
                {option.text}
              </span>
              {IconComponent}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;
