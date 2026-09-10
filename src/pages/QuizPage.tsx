import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Award, RefreshCw, Compass, CandlestickChart, ArrowRight, BookOpen } from 'lucide-react';
import { MODULES_DATA } from '../data/modulesData';
import { useApp } from '../context/AppContext';

export const QuizPage: React.FC<{
  conceptId: string;
  onBackToModule: () => void;
  onGoToRoadmap: () => void;
  onGoToSimulator: () => void;
}> = ({ conceptId, onBackToModule, onGoToRoadmap, onGoToSimulator }) => {
  const { completeModuleQuiz } = useApp();

  const module = MODULES_DATA.find(m => m.id === conceptId) || MODULES_DATA[0];
  const questions = module.quiz;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    const nextAnswers = [...userAnswers];
    nextAnswers[currentIndex] = selectedOption;
    setUserAnswers(nextAnswers);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      userAnswers.forEach((ans, idx) => {
        if (ans === questions[idx].correctAnswer) {
          correctCount++;
        }
      });
      // Include current question if confirmed
      if (selectedOption === currentQuestion.correctAnswer) {
        correctCount++;
      }

      const scorePercent = Math.round((correctCount / questions.length) * 100);
      completeModuleQuiz(module.id, scorePercent);
      setIsCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers(new Array(questions.length).fill(null));
    setIsCompleted(false);
  };

  // QUIZ SCORE SUMMARY SCREEN
  if (isCompleted) {
    let correctCount = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) {
        correctCount++;
      }
    });
    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const isPassed = scorePercent >= 70;
    const earnedXP = isPassed ? module.xpReward + (scorePercent === 100 ? 50 : 0) : 0;

    return (
      <div className="max-w-2xl mx-auto space-y-8 py-8 px-4 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-indigo-500/10 border-2 border-indigo-500/30">
            {isPassed ? (
              <Award className="w-10 h-10 text-amber-400 animate-bounce" />
            ) : (
              <RefreshCw className="w-10 h-10 text-slate-400" />
            )}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">Quiz Completed</span>
            <h2 className="text-3xl font-extrabold text-white">
              {isPassed ? 'Congratulations! Concept Mastered 🎉' : 'Keep Going! Practice Makes Perfect'}
            </h2>
            <p className="text-xs text-slate-400">
              You scored <strong className="text-white">{scorePercent}%</strong> ({correctCount} of {questions.length} questions correct).
            </p>
          </div>

          {isPassed && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center justify-around text-xs font-bold text-emerald-400">
              <span>+ {earnedXP} XP Earned</span>
              <span>•</span>
              <span>Concept Status: MASTERED</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={onGoToRoadmap}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Back to Roadmap</span>
            </button>
            <button
              onClick={onGoToSimulator}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CandlestickChart className="w-4 h-4" />
              <span>Practice in Simulator</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE QUESTION SCREEN
  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Quiz Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToModule}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-extrabold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> +{module.xpReward} XP
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div style={{ width: `${progressPercent}%` }} className="h-full bg-brand-500 transition-all duration-300" />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, oIdx) => {
            let optionStyle = 'bg-slate-800/40 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

            if (isAnswerSubmitted) {
              if (oIdx === currentQuestion.correctAnswer) {
                optionStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 font-bold';
              } else if (oIdx === selectedOption) {
                optionStyle = 'bg-rose-950/40 border-rose-500/80 text-rose-300 font-bold';
              } else {
                optionStyle = 'bg-slate-800/20 border-slate-800 text-slate-500 opacity-50';
              }
            } else if (selectedOption === oIdx) {
              optionStyle = 'bg-brand-600/20 border-brand-500 text-white font-bold ring-2 ring-brand-500/40';
            }

            return (
              <button
                key={oIdx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(oIdx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
              >
                <span>{option}</span>
                {isAnswerSubmitted && oIdx === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && oIdx === selectedOption && oIdx !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Answer Explanation Snippet */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 animate-fade-in ${
            isCorrect ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
          }`}>
            <strong className="font-bold flex items-center gap-1.5">
              {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isCorrect ? 'Correct Answer!' : 'Incorrect — Here is why:'}
            </strong>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Question Footer Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onBackToModule}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
          >
            <BookOpen className="w-4 h-4 text-slate-500" /> Re-read Study Lesson
          </button>

          {!isAnswerSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleConfirmAnswer}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedOption !== null
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-brand-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Quiz Summary'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
