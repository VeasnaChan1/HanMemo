/**
 * AdminDashboard.jsx
 * Full admin console — all data fetched through adminApi service layer.
 * Refactored to import section components from `components/admin/`.
 */
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookCopy,
  BookOpen,
  Languages,
  Users,
  LogOut,
  UserCircle,
  Bell,
  HelpCircle,
} from "lucide-react";

import { SB_BG, BORDER, RED_MID } from "../components/admin/SharedAdminUI";
import DashboardSection from "../components/admin/DashboardSection";
import DecksSection from "../components/admin/DecksSection";
import LessonsSection from "../components/admin/LessonsSection";
import VocabularySection from "../components/admin/VocabularySection";
import UsersSection from "../components/admin/UsersSection";

// ════════════════════════════════════════════════════════════════════════════════
// SHELL — Sidebar + drill-down navigation state machine
// ════════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { id: "decks",      label: "Decks",      icon: BookCopy        },
  { id: "lessons",    label: "Lessons",    icon: BookOpen        },
  { id: "vocabulary", label: "Vocabulary", icon: Languages       },
  { id: "users",      label: "Users",      icon: Users           },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Top-level nav
  const [tab, setTab] = useState("dashboard");

  // Drill-down state: which deck / lesson is selected
  const [selectedDeck,   setSelectedDeck]   = useState(null); // Deck object
  const [selectedLesson, setSelectedLesson] = useState(null); // Lesson object

  // Redirect non-admin
  useEffect(() => {
    if (user && user.role !== "admin") navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // Switching top-level tab resets drill-down
  const switchTab = (id) => {
    setTab(id);
    setSelectedDeck(null);
    setSelectedLesson(null);
  };

  // Drill from Decks → Lessons
  const handleDrillLesson = (deck) => {
    setSelectedDeck(deck);
    setTab("lessons");
    setSelectedLesson(null);
  };

  // Drill from Lessons → Vocabulary
  const handleDrillVocab = (lesson) => {
    setSelectedLesson(lesson);
    setTab("vocabulary");
  };

  // Back from Lessons → Decks
  const handleBackFromLessons = () => {
    setSelectedDeck(null);
    setTab("decks");
  };

  // Back from Vocabulary → Lessons
  const handleBackFromVocab = () => {
    setSelectedLesson(null);
    setTab("lessons");
  };

  // Render the active section
  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return <DashboardSection />;
      case "decks":
        return <DecksSection onDrillLesson={handleDrillLesson} />;
      case "lessons":
        return (
          <LessonsSection
            deckFilter={selectedDeck}
            onBack={selectedDeck ? handleBackFromLessons : null}
            onDrillVocab={handleDrillVocab}
          />
        );
      case "vocabulary":
        return (
          <VocabularySection
            lessonFilter={selectedLesson}
            onBack={selectedLesson ? handleBackFromVocab : null}
          />
        );
      case "users":
        return <UsersSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside className="w-44 flex flex-col shrink-0 border-r" style={{ background: SB_BG, borderColor: BORDER }}>
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="font-black text-xl leading-none" style={{ color: RED_MID }}>
            Han<span className="text-[#1A1A2E]">Memo</span>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-[#9B9BB4] uppercase mt-0.5">
            Admin Console
          </div>
        </div>
        <div className="h-px mx-4 mb-3" style={{ background: BORDER }} />

        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => switchTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left w-full
                  ${active ? "text-white shadow-sm" : "text-[#4A4A6A] hover:bg-red-50 hover:text-[#C0392B]"}`}
                style={active ? { background: RED_MID } : {}}>
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 flex flex-col gap-0.5">
          <div className="h-px mb-3" style={{ background: BORDER }} />
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#4A4A6A]">
            <UserCircle size={16} />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold">Admin Profile</span>
              <span className="text-[10px] text-[#9B9BB4]">{user?.name || "Admin"}</span>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#4A4A6A] hover:bg-red-50 hover:text-[#C0392B] transition-all text-left w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-white flex items-center justify-end px-6 gap-4 shrink-0" style={{ borderColor: BORDER }}>
          <button className="text-[#9B9BB4] hover:text-[#4A4A6A] transition-colors"><Bell size={18} /></button>
          <button className="text-[#9B9BB4] hover:text-[#4A4A6A] transition-colors"><HelpCircle size={18} /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
