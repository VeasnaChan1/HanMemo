import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const ReviewIntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
      <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-4">Review Intro</h1>
        <p className="text-[#9B9BB4] mb-6">Review intro page coming soon...</p>
        <Button variant="primary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ReviewIntroPage;
