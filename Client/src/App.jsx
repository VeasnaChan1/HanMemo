/* App main component */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// 1. Layout & Middleware Interceptors Components
import ProtectedRoute from "./components/layout/ProtectedRoute";

// 2. Public Presentation / Authentication Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LevelSelectionPage from "./pages/LevelSelectionPage";

// 3. Authenticated Learner Dashboard & Navigation Hub Pages
import DashboardPage from "./pages/DashboardPage";
import LessonsPage from "./pages/LessonsPage";
import FlashcardStudyPage from "./pages/FlashcardStudyPage";
import QuizPage from "./pages/QuizPage";
import ReviewSessionPage from "./pages/ReviewSessionPage";
import ProfilePage from "./pages/ProfilePage";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* =========================================================
            PUBLIC GUEST CHANNELS
           ========================================================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/level-selection" element={<LevelSelectionPage />} />

        {/* =========================================================
            PROTECTED USER INTERFACES (Requires valid JWT session tokens)
           ========================================================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <LessonsPage />
            </ProtectedRoute>
          }
        />

        {/* Dynamic parametric path matching for target lesson items study tracking */}
        <Route
          path="/lessons/:lessonId/study"
          element={
            <ProtectedRoute>
              <FlashcardStudyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lessons/:lessonId/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        {/* Active Spaced Repetition (SRS) live evaluation loop engine layout */}
        <Route
          path="/reviews/session"
          element={
            <ProtectedRoute>
              <ReviewSessionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* =========================================================
            FALLBACK ROUT ROUTING SAFETY CAPTURE
           ========================================================= */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
