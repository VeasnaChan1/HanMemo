import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Modular Page Layers
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LevelSelectionPage from "./pages/LevelSelectionPage";
import DashboardPage from "./pages/DashboardPage"; // We'll build this next!

function App() {
  const { token } = useAuth(); // Read global login token state

  return (
    <Router>
      <Routes>
        {/* Public Authentication Gates - Redirects out if already logged in */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={
            token ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          }
        />

        {/* Protected Learner Workflow Layers */}
        <Route element={<ProtectedRoute allowRoles={["learner", "admin"]} />}>
          <Route path="/level-selection" element={<LevelSelectionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Global Wildcard Fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
