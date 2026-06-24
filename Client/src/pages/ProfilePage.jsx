import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full bg-white border-b border-[#E8E8F0] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="font-bold text-2xl text-[#E8453C] tracking-wide">
            Han<span className="text-[#1A1A2E]">MEMO</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-sm text-[#4A4A6A]">
            <span
              className="hover:text-[#E8453C] transition-colors cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Home
            </span>
            <span
              className="hover:text-[#E8453C] transition-colors cursor-pointer"
              onClick={() => navigate("/lessons")}
            >
              Lesson
            </span>
            <span
              className="hover:text-[#E8453C] transition-colors cursor-pointer"
              onClick={() => navigate("/reviews/session")}
            >
              Review
            </span>
            <span className="text-[#E8453C] font-bold border-b-2 border-[#E8453C] pb-1 cursor-pointer">
              Profile
            </span>
            <button
              onClick={handleLogout}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
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
            <p className="text-4xl font-black text-[#E8453C]">48</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">
              Current Streak
            </h3>
            <p className="text-4xl font-black text-[#E8453C]">7</p>
            <p className="text-xs text-[#9B9BB4] mt-1">days</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1A2E] mb-2">
              Retention Rate
            </h3>
            <p className="text-4xl font-black text-green-600">76%</p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E8F0] shadow-sm">
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">
            Account Settings
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-4 border-b border-[#E8E8F0]">
              <span className="text-[#4A4A6A]">Email Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-[#E8E8F0]">
              <span className="text-[#4A4A6A]">Daily Reminders</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between py-4">
              <span className="text-[#4A4A6A]">Dark Mode</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-[#E8453C] border-[#E8453C] hover:bg-[#FFF0EF]"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
