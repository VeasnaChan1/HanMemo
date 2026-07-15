import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import { Brain, Headphones, GraduationCap, Globe, CheckCircle2, ChevronDown, PlayCircle, BarChart, Clock, ShieldCheck, Quote } from "lucide-react";
import { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#E8E8F0] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center text-left focus:outline-none"
      >
        <span className="font-semibold text-lg text-[#1D1D1F]">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#9B9BB4] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        <p className="text-[#4A4A6A] leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans selection:bg-[#F4C95D] selection:text-[#1D1D1F] overflow-x-hidden">

      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#E8E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-[#D64A43] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">汉</span>
            </div>
            <div className="font-bold text-2xl text-[#1D1D1F] tracking-tight">
              Han<span className="text-[#D64A43]">Memo</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#4A4A6A]">
            <a href="#features" className="hover:text-[#D64A43] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#D64A43] transition-colors">How it Works</a>
            <a href="#reviews" className="hover:text-[#D64A43] transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-[#D64A43] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block px-5 py-2.5 text-[15px] font-semibold text-[#1D1D1F] hover:text-[#D64A43] transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-[#D64A43] hover:bg-[#c23f38] text-white text-[15px] font-semibold rounded-full shadow-[0_4px_14px_0_rgba(214,74,67,0.25)] transition-all hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 flex flex-col gap-6 lg:pr-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4C95D]/20 text-[#b58c22] font-semibold text-sm w-fit animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4C95D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4C95D]"></span>
            </span>
            Built for Cambodian Learners
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1D1D1F] leading-[1.1] tracking-tight animate-fade-in-up animation-delay-100">
            Learn Chinese.<br />
            <span className="text-[#D64A43]">Remember it forever.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#4A4A6A] max-w-lg leading-relaxed animate-fade-in-up animation-delay-200">
            Master HSK 1-6 vocabulary with a smart spaced repetition system designed specifically for Khmer speakers.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 animate-fade-in-up animation-delay-300">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-[#D64A43] hover:bg-[#c23f38] text-white text-lg font-bold rounded-full shadow-[0_8px_24px_0_rgba(214,74,67,0.3)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Learning
            </button>
            <button
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E8E8F0] hover:border-[#D64A43] text-[#1D1D1F] text-lg font-bold rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" /> See how it works
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative animate-fade-in-up animation-delay-400">
          <div className="relative mx-auto max-w-lg rounded-[2.5rem] bg-white border border-[#E8E8F0] p-3 shadow-2xl shadow-[#D64A43]/5 rotate-1 hover:rotate-0 transition-transform duration-500 animate-float">
            <div className="rounded-[2rem] overflow-hidden bg-[#FAFAFA] border border-[#F5F5F5]">
              {/* Placeholder for actual app screenshot */}
              <img src="https://i.pinimg.com/736x/1c/15/6c/1c156c577c8f720e3410b54d563b2b2f.jpg" alt="HanMemo App Interface" className="w-full h-auto object-cover rounded-2xl" />
            </div>

            {/* Floating Element */}
            <div className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-[#E8E8F0] flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-10 h-10 bg-[#4D8B6C]/10 rounded-full flex items-center justify-center text-[#4D8B6C]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1D1D1F]">HSK 3 Mastery</p>
                <p className="text-xs text-[#9B9BB4]">100% complete</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST SECTION */}
      <section className="w-full border-y border-[#E8E8F0] bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-transparent md:divide-[#E8E8F0]">
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-3xl font-extrabold text-[#1D1D1F]">5,000+</span>
            <span className="text-sm font-medium text-[#9B9BB4] mt-1">Vocabulary Words</span>
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-3xl font-extrabold text-[#1D1D1F]">HSK 1-6</span>
            <span className="text-sm font-medium text-[#9B9BB4] mt-1">Full Curriculum</span>
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-3xl font-extrabold text-[#1D1D1F]">Khmer</span>
            <span className="text-sm font-medium text-[#9B9BB4] mt-1">Native Support</span>
          </div>
          <div className="flex flex-col items-center text-center px-4 justify-center">
            <img src="https://i.pinimg.com/736x/e6/04/25/e604250b6e4ffd2471bb8e438fff0d3e.jpg" alt="HSK Logo" className="h-16 md:h-20 object-contain" />
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM */}
      <section className="w-full max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] mb-12">
          The traditional way is broken.
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-[#1D1D1F] font-bold text-xl">100%</div>
            <p className="font-semibold text-[#1D1D1F]">You study today.</p>
          </div>
          <div className="h-10 w-0.5 md:h-0.5 md:w-16 bg-[#E8E8F0]"></div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-[#9B9BB4] font-bold text-xl opacity-60">50%</div>
            <p className="font-semibold text-[#1D1D1F]">Tomorrow...</p>
            <p className="text-sm text-[#9B9BB4]">Half the words are gone.</p>
          </div>
          <div className="h-10 w-0.5 md:h-0.5 md:w-16 bg-[#E8E8F0]"></div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-[#E8E8F0] font-bold text-xl opacity-30">10%</div>
            <p className="font-semibold text-[#1D1D1F]">A week later...</p>
            <p className="text-sm text-[#9B9BB4]">Almost everything is forgotten.</p>
          </div>
        </div>
      </section>

      {/* 5. THE SOLUTION */}
      <section className="w-full bg-[#4D8B6C]/5 py-24 border-y border-[#4D8B6C]/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] mb-6">
            The HanMemo Solution
          </h2>
          <p className="text-lg text-[#4A4A6A] max-w-2xl mx-auto mb-16">
            We use active recall and spaced repetition to interrupt the forgetting curve. You review words just before your brain is about to forget them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8E8F0]">
              <div className="text-2xl font-bold text-[#4D8B6C] mb-2">1. Learn</div>
              <p className="text-sm text-[#4A4A6A]">Study new HSK vocabulary in context.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8E8F0] relative md:top-4">
              <div className="text-2xl font-bold text-[#4D8B6C] mb-2">2. Review</div>
              <p className="text-sm text-[#4A4A6A]">Practice only what you need to, exactly when you need to.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8E8F0] relative md:top-8">
              <div className="text-2xl font-bold text-[#4D8B6C] mb-2">3. Repeat</div>
              <p className="text-sm text-[#4A4A6A]">Intervals increase as your memory strengthens.</p>
            </div>
            <div className="bg-[#4D8B6C] p-6 rounded-2xl shadow-lg relative md:top-12">
              <div className="text-2xl font-bold text-white mb-2">4. Retain</div>
              <p className="text-sm text-[#FFFDF9]/80">Long-term memory is achieved. Never forget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] mb-4">Everything you need to master Chinese.</h2>
          <p className="text-lg text-[#4A4A6A]">Designed thoughtfully for an uninterrupted learning experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#E8E8F0] hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#FFF0EF] text-[#D64A43] rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Smart Flashcards</h3>
            <p className="text-[#4A4A6A] leading-relaxed">Practice vocabulary efficiently. Our cards include Hanzi, Pinyin, English, and Khmer definitions, plus example sentences.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#E8E8F0] hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#4D8B6C]/10 text-[#4D8B6C] rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Spaced Repetition</h3>
            <p className="text-[#4A4A6A] leading-relaxed">Stop wasting time reviewing words you already know. Our algorithm schedules reviews mathematically.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#E8E8F0] hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#F4C95D]/20 text-[#b58c22] rounded-2xl flex items-center justify-center mb-6">
              <Headphones className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Audio Pronunciation</h3>
            <p className="text-[#4A4A6A] leading-relaxed">Hear native Chinese pronunciation for every character and example sentence to perfect your tones.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#E8E8F0] hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Progress Tracking</h3>
            <p className="text-[#4A4A6A] leading-relaxed">Watch your HSK journey unfold with detailed analytics, daily streaks, and completion graphs.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#E8E8F0] hover:shadow-md transition-shadow lg:col-span-2 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Made for Cambodia</h3>
              <p className="text-[#4A4A6A] leading-relaxed">We understand that learning Chinese through English isn't always ideal. HanMemo provides fully translated Khmer definitions and context.</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px] bg-[#FAFAFA] p-4 rounded-xl border border-[#E8E8F0]">
              <div className="flex items-center gap-3"><span className="text-2xl">🇨🇳</span> <span className="font-semibold text-[#1D1D1F]">Chinese</span></div>
              <div className="flex items-center gap-3"><span className="text-2xl">🇬🇧</span> <span className="font-semibold text-[#1D1D1F]">English</span></div>
              <div className="flex items-center gap-3"><span className="text-2xl">🇰🇭</span> <span className="font-semibold text-[#1D1D1F]">Khmer</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section id="how-it-works" className="w-full bg-white border-y border-[#E8E8F0] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] mb-4">How it works</h2>
            <p className="text-lg text-[#4A4A6A]">A simple, proven process for language acquisition.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-between relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gray-100 -z-10"></div>

            {[
              { num: "1", title: "Choose Level", desc: "Select your target HSK level from 1 to 6." },
              { num: "2", title: "Study Cards", desc: "Learn new vocabulary with full context." },
              { num: "3", title: "Daily Review", desc: "Complete your daily spaced repetition queue." },
              { num: "4", title: "Remember", desc: "Words enter your permanent memory." }
            ].map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center bg-[#FFFDF9] md:bg-transparent p-6 md:p-0 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#D64A43] flex items-center justify-center text-2xl font-black text-[#D64A43] mb-6 shadow-sm">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">{step.title}</h3>
                <p className="text-sm text-[#4A4A6A]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section id="reviews" className="w-full max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] text-center mb-16">
          Loved by Cambodian Students
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Sokha T.", role: "CADT Student", quote: "I used to spend hours writing characters on paper only to forget them the next day. HanMemo's smart reviews changed everything." },
            { name: "Panha M.", role: "HSK 4 Candidate", quote: "Having Khmer definitions makes understanding the subtle differences between Chinese words so much easier. Highly recommended!" },
            { name: "Bopha K.", role: "Language Enthusiast", quote: "The interface is so clean and distraction-free. I look forward to doing my daily reviews every morning with my coffee." }
          ].map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#E8E8F0] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#F4C95D] mb-4">
                  {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
                </div>
                <p className="text-[#1D1D1F] font-medium leading-relaxed mb-8">"{review.quote}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#4A4A6A] font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1D1D1F]">{review.name}</p>
                  <p className="text-xs text-[#9B9BB4]">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="w-full bg-white border-y border-[#E8E8F0] py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-2">
            <FAQItem question="What HSK levels are available?" answer="HanMemo currently supports the full curriculum for HSK Level 1 through HSK Level 6, totaling over 5,000 vocabulary words." />
            <FAQItem question="How does spaced repetition work?" answer="Spaced repetition (SRS) is a learning technique that incorporates increasing intervals of time between subsequent review of previously learned material. If you get a word correct, you'll see it less often. If you struggle, you'll see it more often." />
            <FAQItem question="Is there Khmer language support?" answer="Yes! HanMemo is specifically built for Cambodian learners. We provide both English and Khmer translations and context for Chinese vocabulary." />
            <FAQItem question="Is HanMemo free?" answer="Yes, you can create an account and start learning immediately for free." />
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="bg-[#1D1D1F] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1D1D1F] to-[#2d2d30] z-0"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Ready to remember every <br /> Chinese word?
            </h2>
            <p className="text-[#9B9BB4] text-lg mb-10 max-w-lg mx-auto">
              Join students across Cambodia mastering the Chinese language with smart spaced repetition.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-5 bg-[#D64A43] hover:bg-[#c23f38] text-white text-lg font-bold rounded-full shadow-[0_8px_24px_0_rgba(214,74,67,0.3)] transition-all hover:-translate-y-1"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="w-full bg-[#FFFDF9] border-t border-[#E8E8F0] px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#D64A43] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs leading-none">汉</span>
            </div>
            <div className="font-bold text-lg text-[#1D1D1F] tracking-tight">
              Han<span className="text-[#D64A43]">Memo</span>
            </div>
          </div>

          <div className="flex gap-6 text-sm font-medium text-[#4A4A6A]">
            <a href="#" className="hover:text-[#D64A43] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#D64A43] transition-colors">Terms</a>
            <a href="https://github.com/VeasnaChan1/HanMemo" target="_blank" rel="noopener noreferrer" className="hover:text-[#D64A43] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#D64A43] transition-colors">Contact</a>
          </div>

          <p className="text-xs font-medium text-[#9B9BB4]">
            © 2026 HanMemo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
