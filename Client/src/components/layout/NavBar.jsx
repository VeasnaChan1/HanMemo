/* NavBar component */
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Home, BookOpen, Layers, User, LogOut } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: "Home", path: "/dashboard", icon: Home },
    { label: "Lesson", path: "/lessons", icon: BookOpen },
    { label: "Review", path: "/reviews", icon: Layers },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* =========================================================
          DESKTOP MANAGEMENT: TOP HORIZONTAL BAR (Hidden on Mobile)
         ========================================================= */}
      <nav className="hidden md:block w-full bg-white border-b border-[#E8E8F0] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {/* Logo brand */}
          <div
            className="font-bold text-2xl text-[#E8453C] tracking-wide cursor-pointer select-none"
            onClick={() => navigate("/dashboard")}
          >
            Han<span className="text-[#1A1A2E]">MEMO</span>
          </div>

          {/* Nav Actions Row */}
          <div className="flex items-center gap-6 font-medium text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <span
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer pb-1 border-b-2 font-semibold ${
                    active
                      ? "text-[#E8453C] border-[#E8453C]"
                      : "text-[#4A4A6A] border-transparent hover:text-[#E8453C]"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </span>
              );
            })}
            <button
              onClick={logout}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={12} />
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================================
          MOBILE MANAGEMENT: BOTTOM STICKY BAR (Hidden on Desktop)
         ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8F0] px-2 py-2 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-colors cursor-pointer
                  ${active ? "text-[#E8453C]" : "text-[#9B9BB4] hover:text-[#4A4A6A]"}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-bold tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Margin Spacer Offset to prevent viewport overlay bottom blocking */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default NavBar;
