
import React, { useState } from 'react';
import { OperationType, Question, GameStats, Difficulty } from './types';
import { generateQuestion } from './services/mathEngine';
import { EmojiRain } from './components/EmojiRain';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'START' | 'DIFFICULTY' | 'PLAYING' | 'SUMMARY'>('START');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    totalQuestions: 0,
    streak: 0,
    bestStreak: 0
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [selectedType, setSelectedType] = useState<OperationType | 'MIXED'>('MIXED');

  const handleOperationSelect = (type: OperationType | 'MIXED') => {
    setSelectedType(type);
    setGameState('DIFFICULTY');
  };

  const startNewGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setStats({ score: 0, totalQuestions: 0, streak: 0, bestStreak: 0 });
    setGameState('PLAYING');
    nextQuestion(selectedType, diff);
  };

  const nextQuestion = (type?: OperationType | 'MIXED', diff?: Difficulty) => {
    const activeType = type || selectedType;
    const activeDiff = diff || difficulty;
    let questionType: OperationType;
    
    if (activeType === 'MIXED') {
      const types = Object.values(OperationType);
      questionType = types[Math.floor(Math.random() * types.length)];
    } else {
      questionType = activeType as OperationType;
    }

    setCurrentQuestion(generateQuestion(questionType, activeDiff));
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
        if (stats.totalQuestions + 1 < 10) {
          nextQuestion();
        }
      }, 1200);
    } else {
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        streak: 0
      }));
      setTimeout(() => {
        if (stats.totalQuestions + 1 < 10) {
          nextQuestion();
        }
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
            <h1 className="text-4xl font-bold text-sky-600">Toán Vui Khám Phá</h1>
            <p className="text-slate-500 text-lg font-medium">Chọn một thế giới toán học để bắt đầu nhé!</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOperationSelect(OperationType.ADDITION)}
                className="p-4 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-2xl transition-all border-b-4 border-orange-300 active:translate-y-1 font-bold"
              >
                ➕ Phép Cộng
              </button>
              <button 
                onClick={() => handleOperationSelect(OperationType.SUBTRACTION)}
                className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl transition-all border-b-4 border-blue-300 active:translate-y-1 font-bold"
              >
                ➖ Phép Trừ
              </button>
              <button 
                onClick={() => handleOperationSelect(OperationType.MULTIPLICATION)}
                className="p-4 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-2xl transition-all border-b-4 border-purple-300 active:translate-y-1 font-bold"
              >
                ✖️ Phép Nhân
              </button>
              <button 
                onClick={() => handleOperationSelect(OperationType.DIVISION)}
                className="p-4 bg-green-100 hover:bg-green-200 text-green-600 rounded-2xl transition-all border-b-4 border-green-300 active:translate-y-1 font-bold"
              >
                ➗ Phép Chia
              </button>
            </div>
            <button 
              onClick={() => handleOperationSelect('MIXED')}
              className="w-full p-6 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl transition-all border-b-4 border-sky-700 active:translate-y-1 font-bold text-xl shadow-lg"
            >
              🌈 Kết Hợp Ngẫu Nhiên
            </button>
          </div>
        )}

        {gameState === 'DIFFICULTY' && (
          <div className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-3xl font-bold text-sky-600">Chọn Mức Độ Khó</h2>
            <p className="text-slate-500 font-medium">Mức độ càng cao, thử thách càng thú vị nhé!</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => startNewGame(Difficulty.EASY)}
                className="w-full p-6 bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl transition-all border-b-4 border-green-300 active:translate-y-1 font-bold text-3xl flex items-center justify-center shadow-sm"
              >
                Dễ
              </button>
              <button 
                onClick={() => startNewGame(Difficulty.MEDIUM)}
                className="w-full p-6 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-2xl transition-all border-b-4 border-yellow-300 active:translate-y-1 font-bold text-3xl flex items-center justify-center shadow-sm"
              >
                Trung bình
              </button>
              <button 
                onClick={() => startNewGame(Difficulty.HARD)}
                className="w-full p-6 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl transition-all border-b-4 border-red-300 active:translate-y-1 font-bold text-3xl flex items-center justify-center shadow-sm"
              >
                Khó
              </button>
              
              <button 
                onClick={() => setGameState('START')}
                className="mt-4 text-slate-400 font-medium hover:text-slate-600 transition-colors"
              >
                ← Quay lại chọn phép tính
              </button>
            </div>
          </div>
        )}

        {gameState === 'PLAYING' && currentQuestion && (
          <div className="p-8 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8">
              <div className="bg-sky-100 px-4 py-2 rounded-full font-bold text-sky-600 shadow-sm flex items-center gap-2">
                Điểm: {stats.score}
                <span className="text-xs font-normal opacity-60">
                  ({difficulty === Difficulty.EASY ? 'Dễ' : difficulty === Difficulty.MEDIUM ? 'TB' : 'Khó'})
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-3 w-3 rounded-full transition-colors duration-300 ${i < stats.totalQuestions ? 'bg-sky-500' : 'bg-slate-200'}`} 
                  />
                ))}
              </div>
            </div>

            <div key={currentQuestion.id} className={`text-6xl font-black mb-12 py-8 px-12 bg-slate-50 rounded-3xl border-2 border-slate-100 bounce-in shadow-inner ${lastAnswerCorrect === true ? 'text-green-500 correct-pop' : lastAnswerCorrect === false ? 'text-red-400' : 'text-slate-700'}`}>
              {currentQuestion.a} {currentQuestion.op} {currentQuestion.b} = ?
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt}
                  disabled={lastAnswerCorrect !== null}
                  onClick={() => handleAnswer(opt)}
                  className={`
                    py-5 text-3xl font-bold rounded-2xl transition-all border-b-4 active:translate-y-1 shadow-md
                    ${lastAnswerCorrect === null 
                      ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' 
                      : opt === currentQuestion.answer 
                        ? 'bg-green-500 border-green-700 text-white animate-pulse' 
                        : 'bg-slate-100 border-slate-300 text-slate-400 opacity-50'}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-8 min-h-[40px] text-center">
              {lastAnswerCorrect === true && (
                <div className="text-green-500 font-bold text-2xl animate-bounce">
                  ✨ Tuyệt vời! Rất giỏi! ✨
                </div>
              )}
              {lastAnswerCorrect === false && (
                <div className="text-red-400 font-bold text-2xl">
                  Oops! Thử lại nhé! 💫
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'SUMMARY' && (
          <div className="p-10 text-center space-y-6">
            <h2 className="text-4xl font-bold text-sky-600">Chúc Mừng Bạn!</h2>
            <div className="text-8xl animate-bounce">🏆</div>
            <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-100 space-y-4">
              <p className="text-xl font-medium text-slate-600">Bạn đã hoàn thành thử thách!</p>
              <p className="text-2xl">Kết quả: <span className="text-4xl font-black text-sky-600">{stats.score}</span> / 10 điểm</p>
              <div className="flex justify-center items-center gap-2 text-orange-500 font-bold">
                <span>🔥 Chuỗi đúng dài nhất: {stats.bestStreak}</span>
              </div>
            </div>
            <button
              onClick={() => setGameState('START')}
              className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white text-2xl font-bold rounded-2xl transition-all border-b-4 border-orange-700 active:translate-y-1 shadow-lg"
            >
              Chơi Lại Nào! 🚀
            </button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-slate-400 text-sm font-medium text-center">
        Dành cho các nhà toán học nhí lớp 1 ❤️
      </footer>
    </div>
  );
};

export default App;
