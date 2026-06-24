import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const LevelSelectionPage = () => {
  const navigate = useNavigate();
  // State to track which card index is highlighted/selected
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Content matching your exact Figma text strings
  const levels = [
    {
      id: 1,
      title: "Complete Beginner",
      desc: "I have never studied Chinese",
    },
    {
      id: 2,
      title: "I know some basics",
      desc: "I know some HSK 1 vocabulary",
    },
    {
      id: 3,
      title: "Intermediate",
      desc: "I am around HSK 2 to 3 level",
    },
  ];

  const handleSaveLevel = () => {
    // Navigates straight to the student home dashboard upon confirmation
    navigate("/dashboard");
  };

  return (
    // Outer canvas matching page background color (#FAFAFA)
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA]">
      {/* Central Card Wrapper with gray border layout line (#E8E8F0) */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm text-center">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">
          What is your current level?
        </h2>
        <p className="text-sm text-[#4A4A6A] mb-6">
          We will set up your personal learning path
        </p>

        {/* Vertical stacked radio selection cards */}
        <div className="flex flex-col gap-4 mb-6">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id)}
                className={`w-full p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer flex justify-between items-center outline-none
                  ${
                    isSelected
                      ? "border-[#E8453C] bg-[#FFF0EF] ring-1 ring-[#E8453C]"
                      : "border-[#E8E8F0] bg-white hover:bg-[#FAFAFA]"
                  }`}
              >
                <div>
                  <h3
                    className={`font-bold text-base ${isSelected ? "text-[#E8453C]" : "text-[#1A1A2E]"}`}
                  >
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-[#4A4A6A] mt-0.5">{lvl.desc}</p>
                </div>

                {/* Custom radio indicator circle icon */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? "border-[#E8453C] bg-[#E8453C]" : "border-[#9B9BB4]"}`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Global Action Confirmation Button */}
        <Button variant="primary" onClick={handleSaveLevel}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default LevelSelectionPage;
