import React, { useEffect, useState } from "react";
import NavBar from "../components/layout/NavBar";
import BackArrow from "../components/layout/BackArrow";
import Loader from "../components/common/Loader";
import { progressApi } from "../api/progressApi";

const StatCard = ({ title, value, sub }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
    <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">{title}</h3>
    <p className="text-3xl font-black text-[#E8453C]">{value}</p>
    {sub && <p className="text-xs text-[#9B9BB4] mt-1">{sub}</p>}
  </div>
);

const ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const p = await progressApi.getProgress();
      setProgress(p || {});
    } catch (err) {
      console.error("Failed to load progress", err);
      setError("Unable to load progress. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-left">
      <NavBar />

      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6 mb-16 md:mb-0">
        <div className="flex items-center justify-between border-b border-[#E8E8F0] pb-4">
          <div className="flex items-center gap-3">
            <BackArrow fallbackUrl="/dashboard" />
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">Progress</h1>
              <p className="text-xs font-semibold text-[#9B9BB4] uppercase tracking-wider mt-0.5">
                Your learning statistics
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center min-h-[300px]">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="w-full max-w-md mx-auto text-center bg-white border border-[#E8E8F0] p-8 rounded-2xl shadow-sm my-12 flex flex-col items-center gap-4">
            <p className="text-sm text-[#9B9BB4]">{error}</p>
            <button className="text-[#E8453C] underline" onClick={load}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard title="Due Reviews" value={progress.dueReviews ?? 0} />
              <StatCard
                title="Words Learned"
                value={progress.wordsLearned ?? 0}
              />
              <StatCard
                title="Completed Lessons"
                value={progress.completedLessons ?? 0}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard
                title="Current Streak"
                value={progress.computedStreak ?? progress.streak ?? 0}
                sub="days"
              />
              <StatCard
                title="Retention Rate"
                value={`${progress.retentionRate ?? 0}%`}
              />
              <StatCard
                title="Last Active"
                value={progress.lastActive ?? "-"}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-3">
                Last 7 days activity
              </h3>
              <div className="flex gap-2">
                {(progress.streakDays || []).map((d) => (
                  <div key={d.date} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-lg ${d.active ? "bg-[#E8453C]" : "bg-[#F1F1F6]"}`}
                    ></div>
                    <div className="text-xs text-[#9B9BB4] mt-1">
                      {d.date.split("-").slice(1).join("/")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProgressPage;
