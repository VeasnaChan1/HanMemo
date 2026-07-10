import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lessonApi } from "../api/lessonApi";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from "lucide-react";

const QuizPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await lessonApi.getLessonQuiz(lessonId);
        setQuestions(quizData);
      } catch (err) {
        console.error("Failed to load quiz", err);
        setError("Failed to generate quiz. Have you completed the study phase?");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleAnswerSelect = (option) => {
    if (isAnswerChecked) return; // Prevent changing answer after checking
    setSelectedAnswer(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswerChecked(true);
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      // Quiz finished, show score screen and mark complete
      setIsCompleting(true);
      try {
        await lessonApi.completeLesson(lessonId);
      } catch (err) {
        console.error("Failed to complete lesson", err);
      } finally {
        setIsCompleting(false);
        setQuizFinished(true);
      }
    }
  };

  const handleFinish = () => {
    navigate("/lessons", { replace: true });
  };

  if (loading) return <Loader fullScreen={true} />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
        <div className="bg-white p-8 rounded-2xl border border-[#E8E8F0] shadow-sm max-w-md text-center">
          <BookOpen className="text-[#E8453C] mx-auto mb-4" size={48} />
          <h1 className="text-xl font-bold text-[#1A1A2E] mb-2">Quiz Error</h1>
          <p className="text-[#9B9BB4] mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate("/lessons")}>
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
        <p className="text-[#9B9BB4]">No quiz questions available.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/lessons")}>Back</Button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-[#E8E8F0] p-8 text-center flex flex-col items-center">
          <CheckCircle2 className="text-green-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Quiz Completed!</h1>
          <p className="text-[#9B9BB4] mb-6">You scored</p>
          <div className="text-5xl font-black text-[#E8453C] mb-8">
            {score} / {questions.length}
          </div>
          <Button variant="primary" className="w-full py-4 rounded-xl text-lg" onClick={handleFinish}>
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-[#E8E8F0] overflow-hidden flex flex-col h-[600px]">
        
        {/* Header & Progress */}
        <div className="px-6 py-4 border-b border-[#E8E8F0] flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-bold text-[#4A4A6A]">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate("/lessons")} 
                className="hover:bg-gray-100 p-1 rounded-full transition-colors"
                title="Back to Lessons"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <span>Quiz</span>
            </div>
            <span>{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#E8453C] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="w-full flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              let optionClass = "border-[#E8E8F0] text-[#1A1A2E] hover:border-[#E8453C] hover:bg-[#FFF0EF]";
              
              if (isAnswerChecked) {
                if (isCorrect) {
                  optionClass = "border-green-500 bg-green-50 text-green-700";
                } else if (isSelected && !isCorrect) {
                  optionClass = "border-red-500 bg-red-50 text-red-700";
                } else {
                  optionClass = "border-[#E8E8F0] text-gray-400 opacity-50";
                }
              } else if (isSelected) {
                optionClass = "border-[#E8453C] bg-[#FFF0EF] text-[#E8453C]";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswerChecked}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex justify-between items-center ${optionClass}`}
                >
                  <span>{option}</span>
                  {isAnswerChecked && isCorrect && <CheckCircle2 size={20} className="text-green-500" />}
                  {isAnswerChecked && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-6 border-t border-[#E8E8F0] bg-gray-50 flex items-center justify-center">
          {!isAnswerChecked ? (
            <Button 
              variant="primary" 
              className="w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2"
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
            >
              Check Answer
            </Button>
          ) : (
            <Button 
              variant={selectedAnswer === currentQuestion.correctAnswer ? "primary" : "outline"}
              className={`w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2 ${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? "" 
                  : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
              }`}
              onClick={handleNextQuestion}
              disabled={isCompleting}
            >
              {isCompleting ? "Finishing..." : "Continue"} <ArrowRight size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
