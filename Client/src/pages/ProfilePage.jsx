import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { progressApi } from "../api/progressApi";
import NavBar from "../components/layout/NavBar";

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

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    hsk_level: user?.hsk_level || 1,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#E8453C] flex items-center justify-center text-white font-bold text-3xl shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col gap-2">
              {!editing ? (
                <>
                  <h1 className="text-3xl font-bold text-[#1A1A2E]">
                    {user?.name || "User"}
                  </h1>
                  <p className="text-[#9B9BB4]">
                    {user?.email || "user@example.com"}
                  </p>
                </>
              ) : (
                <div className="flex flex-col gap-2 w-full max-w-md">
                  <input
                    className="border p-2 rounded-lg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <select
                    className="border p-2 rounded-lg"
                    value={formData.hsk_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hsk_level: Number(e.target.value),
                      })
                    }
                  >
                    <option value={1}>HSK 1</option>
                    <option value={2}>HSK 2</option>
                    <option value={3}>HSK 3</option>
                  </select>
                </div>
              )}
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
          {!editing ? (
            <>
              <Button
                variant="outline"
                className="text-[#E8453C] border-[#E8453C] hover:bg-[#FFF0EF]"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
              <Button variant="primary" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-[#E8453C] border-[#E8453C] hover:bg-[#FFF0EF]"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  setSaving(true);
                  setMessage("");
                  try {
                    await updateProfile({
                      name: formData.name,
                      hsk_level: formData.hsk_level,
                    });
                    setMessage("Profile updated.");
                    setEditing(false);
                  } catch (err) {
                    setMessage(
                      err.response?.data?.message ||
                        "Failed to update profile.",
                    );
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
        {message && (
          <div className="mt-3 text-sm text-[#4A4A6A]">{message}</div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
