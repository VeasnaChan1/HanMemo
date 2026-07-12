import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { progressApi } from "../api/progressApi";
import NavBar from "../components/layout/NavBar";

const Toggle = ({ defaultChecked }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E8453C]"></div>
  </label>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [progress, setProgress] = useState({
    wordsLearned: 0,
    streak: user?.streak || 0,
    retentionRate: 0,
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const p = await progressApi.getProgress();
        setProgress({
          wordsLearned: p.wordsLearned || 0,
          streak:
            p.computedStreak || p.streak || p.storedStreak || user?.streak || 0,
          retentionRate: p.retentionRate || 0,
        });
      } catch (err) {
        // ignore for now
      }
    };
    loadProgress();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Navigation Bar */}
      <NavBar />

      {/* Profile Content */}
      <main className="max-w-5xl w-full mx-auto px-6 pt-8 pb-24 md:pb-8 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#E8453C] flex items-center justify-center text-white font-bold text-3xl shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-[#1A1A2E]">
                {user?.name || "User"}
              </h1>
              <p className="text-[#9B9BB4]">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">
              Words Learned
            </h3>
            <p className="text-4xl font-black text-[#E8453C]">
              {progress.wordsLearned}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">
              Current Streak
            </h3>
            <p className="text-4xl font-black text-[#E8453C]">
              {progress.streak}
            </p>
            <p className="text-xs text-[#9B9BB4] mt-1">days</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">
              Retention Rate
            </h3>
            <p className="text-4xl font-black text-green-600">
              {progress.retentionRate}%
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">
            Account Settings
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-4 border-b border-[#E8E8F0]">
              <span className="text-[#4A4A6A]">Language</span>
              <select className="border border-gray-200 text-[#4A4A6A] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E8453C] bg-[#FAFAFA]">
                <option value="en">English</option>
                <option value="km">Khmer</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-[#E8E8F0]">
              <span className="text-[#4A4A6A]">Email Notifications</span>
              <Toggle defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-[#E8E8F0]">
              <span className="text-[#4A4A6A]">Daily Reminders</span>
              <Toggle defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between py-4">
              <span className="text-[#4A4A6A]">Dark Mode</span>
              <Toggle defaultChecked={false} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
