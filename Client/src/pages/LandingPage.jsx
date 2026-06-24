import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import { Brain, Flame, Globe } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleGetStarted = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between text-left">
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="w-full bg-white border-b border-[#E8E8F0] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="font-bold text-2xl text-[#E8453C] tracking-wide">
            Han<span className="text-[#1A1A2E]">MEMO</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 max-w-xs">
            <Button
              variant="primary"
              className="w-auto min-w-30 py-2 px-5 text-sm"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              className="w-auto min-w-30 py-2 px-5 text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* 2. HERO CONTENT SECTION */}
      <main className="grow max-w-6xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
        {/* Left Typography Block */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] leading-tight">
            Finally remember the <br /> Chinese you study
          </h1>
          <p className="text-base text-[#9B9BB4] max-w-md leading-relaxed">
            HanMemo uses spaced repetition science to make sure you never forget
            a word again. Structured language paths to maintain healthy daily
            study habits.
          </p>
          <div className="max-w-xs mt-4">
            <Button variant="primary" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>

        {/* Right Hero Image Asset Frame */}
        <div className="flex-1 w-full flex justify-center">
          <div className="relative rounded-2xl overflow-hidden border border-[#E8E8F0] bg-white p-2 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"
              alt="Learning Chinese Interface Mockup"
              className="rounded-xl max-w-full h-auto object-cover md:max-h-87.5"
            />
          </div>
        </div>
      </main>

      {/* 3. VALUE PROPOSITION FEATURE GRID SECTION */}
      <section className="w-full bg-[#FAFAFA] border-t border-[#E8E8F0] px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Smart Review */}
          <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-[#FFF0EF] text-[#E8453C] rounded-full flex items-center justify-center mb-4">
              <Brain size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#1A1A2E] mb-1">
              Smart Review
            </h3>
            <p className="text-sm text-[#4A4A6A]">Never forget words</p>
          </div>

          {/* Card 2: Daily Streaks */}
          <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-[#FFF0EF] text-[#E8453C] rounded-full flex items-center justify-center mb-4">
              <Flame size={24} fill="currentColor" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1A2E] mb-1">
              Daily streaks
            </h3>
            <p className="text-sm text-[#4A4A6A]">Built habits</p>
          </div>

          {/* Card 3: Khmer & English */}
          <div className="bg-white border border-[#E8E8F0] p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-[#FFF0EF] text-[#E8453C] rounded-full flex items-center justify-center mb-4">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#1A1A2E] mb-1">
              Khmer & English
            </h3>
            <p className="text-sm text-[#4A4A6A]">Your language</p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER COPY BLOCK */}
      <footer className="w-full border-t border-[#E8E8F0] bg-white px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-bold text-lg text-[#E8453C] tracking-wide">
            Han<span className="text-[#1A1A2E]">MEMO</span>
          </div>
          <p className="text-xs text-[#9B9BB4]">
            © 2026 HanMemo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
