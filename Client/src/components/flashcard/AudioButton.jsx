import { useState } from "react";
import { Volume2 } from "lucide-react";

const AudioButton = ({ text, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e) => {
    // Prevent trigger events from bubbling up if wrapped inside a clickable flashcard container
    e.stopPropagation();

    if (!text) return;

    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech utterances
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN"; // Set Mandarin Chinese language locale

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={`p-2.5 rounded-full bg-[#FFF0EF] text-[#E8453C] hover:bg-[#FFE2E0] transition-all duration-200 shadow-sm border border-[#FFE2E0] focus:outline-none cursor-pointer ${className}`}
      title="Listen Pronunciation"
    >
      {isPlaying ? (
        <Volume2 size={20} className="animate-bounce" />
      ) : (
        <Volume2 size={20} />
      )}
    </button>
  );
};

export default AudioButton;
