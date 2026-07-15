import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../api/authApi";

const LevelSelectionPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState(user?.hsk_level ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const levels = [
    {
      id: 1,
      title: "HSK 1",
      desc: "Absolute beginner — 150 basic vocabulary words",
      badge: "150 words",
    },
    {
      id: 2,
      title: "HSK 2",
      desc: "Elementary — 300 vocabulary words",
      badge: "300 words",
    },
    {
      id: 3,
      title: "HSK 3",
      desc: "Pre-intermediate — 600 vocabulary words",
      badge: "600 words",
    },
    {
      id: 4,
      title: "HSK 4",
      desc: "Intermediate — 1,200 vocabulary words",
      badge: "1,200 words",
    },
    {
      id: 5,
      title: "HSK 5",
      desc: "Upper-intermediate — 2,500 vocabulary words",
      badge: "2,500 words",
    },
    {
      id: 6,
      title: "HSK 6",
      desc: "Advanced — 5,000+ vocabulary words",
      badge: "5,000+ words",
    },
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleSaveLevel = async () => {
    setError("");
    setLoading(true);

    try {
      await authApi.updateProfile({ hsk_level: selectedLevel });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save your level right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm text-center">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">
          What is your current HSK level?
        </h2>
        <p className="text-sm text-[#4A4A6A] mb-6">
          We will set up your personal learning path starting from your chosen level
        </p>

        {/* Vertical stacked radio selection cards */}
        <div className="flex flex-col gap-3 mb-6">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id)}
                className={`w-full px-4 py-3 rounded-xl text-left border transition-all duration-200 cursor-pointer flex justify-between items-center outline-none
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

                <div className="flex items-center gap-2 shrink-0">
                  {/* Word count badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-[#E8453C] text-white" : "bg-gray-100 text-[#9B9BB4]"}`}
                  >
                    {lvl.badge}
                  </span>

                  {/* Custom radio indicator circle */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected ? "border-[#E8453C] bg-[#E8453C]" : "border-[#9B9BB4]"}`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-[#FFF0EF] p-3 text-sm font-medium text-[#E8453C]">
            {error}
          </div>
        )}

        <Button variant="primary" onClick={handleSaveLevel} disabled={loading}>
          {loading ? "Saving..." : "Start Learning →"}
        </Button>
      </div>
    </div>
  );
};

export default LevelSelectionPage;
