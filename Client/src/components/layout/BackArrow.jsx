/* BackArrow component */
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackArrow = ({ fallbackUrl, className = "" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If there's single-item history depth (opened page directly), use fallback
    if (window.history.length <= 1 && fallbackUrl) {
      navigate(fallbackUrl);
    } else {
      navigate(-1); // Native stack step back
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`p-2 rounded-xl text-[#1A1A2E] hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center cursor-pointer border border-transparent hover:border-[#E8E8F0] ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
    </button>
  );
};

export default BackArrow;
