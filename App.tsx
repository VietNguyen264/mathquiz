
import React, { useState } from 'react';
import { OperationType, Question, GameStats } from './types';
import { generateQuestion } from './services/mathEngine';
import { EmojiRain } from './component/EmojiRain';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'SUMMARY'>('START');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    totalQuestions: 0,
    streak: 0,
    bestStreak: 0
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [selectedType, setSelectedType] = useState<OperationType | 'MIXED'>('MIXED');

  const startNewGame = (type: OperationType | 'MIXED') => {
    setSelectedType(type);
    setStats({ score: 0, totalQuestions: 0, streak: 0, bestStreak: 0 });
    setGameState('PLAYING');
    nextQuestion(type);
  };

  const nextQuestion = (type?: OperationType | 'MIXED') => {
    const activeType = type || selectedType;
    let questionType: OperationType;
    
    if (activeType === 'MIXED') {
      const types = Object.values(OperationType);
      questionType = types[Math.floor(Math.random() * types.length)];
    } else {
      questionType = activeType as OperationType;
    }

    setCurrentQuestion(generateQuestion(questionType));
    setLastAnswerCorrect(null);
  };

  const handleAnswer = (option: number) => {
    if (!currentQuestion) return;

    const isCorrect = option === currentQuestion.answer;
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      setStats(prev => {
        const newStreak = prev.streak + 1;
        return {
          ...prev,
          score: prev.score + 1,
          totalQuestions: prev.totalQuestions + 1,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak)
        };
      });
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        nextQuestion();
      }, 1200);
    } else {
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        streak: 0
      }));
      // Just a small pause for feedback before moving on
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    }

    if (stats.totalQuestions + 1 >= 10) {
      setTimeout(() => setGameState('SUMMARY'), 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {showCelebration && <EmojiRain />}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
        {gameState === 'START' && (
          <div className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">🍎</div>
            <h1 className="text-4xl font-bold text-sky-600">Math Adventure</h1>
            <p className="text-slate-500 text-lg">Pick a math world to explore!</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => startNewGame(OperationType.ADDITION)}
                className="p-4 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-2xl transition-all border-b-4 border-orange-300 active:translate-y-1 font-bold"
              >
                ➕ Plus
              </button>
              <button 
                onClick={() => startNewGame(OperationType.SUBTRACTION)}
                className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl transition-all border-b-4 border-blue-300 active:translate-y-1 font-bold"
              >
                ➖ Minus
              </button>
              <button 
                onClick={() => startNewGame(OperationType.MULTIPLICATION)}
                className="p-4 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-2xl transition-all border-b-4 border-purple-300 active:translate-y-1 font-bold"
              >
                ✖️ Times
              </button>
              <button 
                onClick={() => startNewGame(OperationType.DIVISION)}
                className="p-4 bg-green-100 hover:bg-green-200 text-green-600 rounded-2xl transition-all border-b-4 border-green-300 active:translate-y-1 font-bold"
              >
                ➗ Sharing
              </button>
            </div>
            <button 
              onClick={() => startNewGame('MIXED')}
              className="w-full p-6 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl transition-all border-b-4 border-sky-700 active:translate-y-1 font-bold text-xl"
            >
              🌈 Mixed Surprise!
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && currentQuestion && (
          <div className="p-8 flex flex-col items-center">
            {/* Header / Progress */}
            <div className="w-full flex justify-between items-center mb-8">
              <div className="bg-sky-100 px-4 py-2 rounded-full font-bold text-sky-600">
                Score: {stats.score}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-3 w-3 rounded-full ${i < stats.totalQuestions ? 'bg-sky-500' : 'bg-slate-200'}`} 
                  />
                ))}
              </div>
            </div>

            {/* Question Display */}
            <div key={currentQuestion.id} className={`text-6xl font-black mb-12 py-8 px-12 bg-slate-50 rounded-3xl border-2 border-slate-100 bounce-in ${lastAnswerCorrect === true ? 'text-green-500 correct-pop' : lastAnswerCorrect === false ? 'text-red-400' : 'text-slate-700'}`}>
              {currentQuestion.a} {currentQuestion.op} {currentQuestion.b} = ?
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4 w-full">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt}
                  disabled={lastAnswerCorrect !== null}
                  onClick={() => handleAnswer(opt)}
                  className={`
                    py-5 text-3xl font-bold rounded-2xl transition-all border-b-4 active:translate-y-1
                    ${lastAnswerCorrect === null 
                      ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' 
                      : opt === currentQuestion.answer 
                        ? 'bg-green-500 border-green-700 text-white' 
                        : 'bg-slate-100 border-slate-300 text-slate-400 opacity-50'}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback Message */}
            <div className="mt-8 min-h-[32px]">
              {lastAnswerCorrect === true && (
                <div className="text-green-500 font-bold text-xl animate-bounce">
                  ✨ Perfect! Amazing! ✨
                </div>
              )}
              {lastAnswerCorrect === false && (
                <div className="text-red-400 font-bold text-xl">
                  Oops! Try again! 💫
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'SUMMARY' && (
          <div className="p-10 text-center space-y-6">
            <h2 className="text-4xl font-bold text-sky-600">Great Job!</h2>
            <div className="text-7xl">🏆</div>
            <div className="bg-sky-50 p-6 rounded-3xl space-y-3">
              <p className="text-xl">You got <span className="text-3xl font-bold text-sky-600">{stats.score}</span> out of 10!</p>
              <p className="text-lg text-slate-500">Best Streak: {stats.bestStreak} 🔥</p>
            </div>
            <button
              onClick={() => setGameState('START')}
              className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white text-2xl font-bold rounded-2xl transition-all border-b-4 border-orange-700 active:translate-y-1"
            >
              Play Again! 🚀
            </button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-slate-400 text-sm font-medium">
        Made with ❤️ for First Grade Math Wizards
      </footer>
    </div>
  );
};

export default App;
