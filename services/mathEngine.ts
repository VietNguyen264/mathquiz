
import { OperationType, Question, Difficulty } from '../types';

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Hàm kiểm tra xem câu hỏi có bị lặp trong lịch sử không
const isDuplicate = (a: number, b: number, op: string, history: string[]): boolean => {
  const current = `${a}${op}${b}`;
  // Với phép cộng và nhân, kiểm tra cả trường hợp đảo số (a+b giống b+a)
  const isCommutative = op === '+' || op === '×';
  const reversed = isCommutative ? `${b}${op}${a}` : null;
  
  return history.includes(current) || (reversed !== null && history.includes(reversed));
};

export const generateQuestion = (type: OperationType, difficulty: Difficulty, history: string[] = []): Question => {
  let a = 0, b = 0, answer = 0, op = '';
  let attempts = 0;
  const maxAttempts = 20; // Thử tối đa 20 lần để tìm câu hỏi mới

  // Vòng lặp để tìm câu hỏi không trùng lặp
  do {
    attempts++;
    // Định nghĩa phạm vi kết quả dựa trên độ khó
    let minAns = 0, maxAns = 20;
    if (difficulty === Difficulty.MEDIUM) {
      minAns = 20;
      maxAns = 60;
    } else if (difficulty === Difficulty.HARD) {
      minAns = 60;
      maxAns = 99;
    }

    switch (type) {
      case OperationType.ADDITION:
        answer = getRandomInt(minAns, maxAns);
        a = getRandomInt(0, answer);
        b = answer - a;
        op = '+';
        break;
      case OperationType.SUBTRACTION:
        if (difficulty === Difficulty.EASY) {
          a = getRandomInt(5, 20);
          b = getRandomInt(0, a);
        } else if (difficulty === Difficulty.MEDIUM) {
          a = getRandomInt(25, 60);
          b = getRandomInt(5, 20);
        } else {
          a = getRandomInt(70, 99);
          b = getRandomInt(10, 30);
        }
        answer = a - b;
        op = '-';
        break;
      case OperationType.MULTIPLICATION:
        // Mở rộng bộ số nhân để tránh lặp 1*x
        if (difficulty === Difficulty.EASY) {
          // Ép buộc một số phải > 1 nếu có thể để tránh 1*3 liên tục
          a = getRandomInt(1, 5);
          b = getRandomInt(2, 4); 
        } else if (difficulty === Difficulty.MEDIUM) {
          a = getRandomInt(2, 9);
          b = getRandomInt(3, 6);
        } else {
          a = getRandomInt(4, 12);
          b = getRandomInt(4, 8);
        }
        answer = a * b;
        op = '×';
        break;
      case OperationType.DIVISION:
        if (difficulty === Difficulty.EASY) {
          answer = getRandomInt(1, 5);
          b = getRandomInt(2, 4);
        } else if (difficulty === Difficulty.MEDIUM) {
          answer = getRandomInt(4, 10);
          b = getRandomInt(2, 5);
        } else {
          answer = getRandomInt(8, 15);
          b = getRandomInt(3, 6);
        }
        a = answer * b;
        op = '÷';
        break;
    }
    
    // Thoát vòng lặp nếu tìm thấy câu mới hoặc đã thử quá nhiều lần
  } while (isDuplicate(a, b, op, history) && attempts < maxAttempts);

  // Tạo các phương án sai xung quanh kết quả đúng
  const optionsSet = new Set<number>([answer]);
  while (optionsSet.size < 3) {
    const offset = getRandomInt(-5, 5);
    const wrongOpt = answer + offset;
    // Đảm bảo phương án sai không âm và không trùng đáp án đúng
    if (wrongOpt >= 0 && wrongOpt !== answer) {
      optionsSet.add(wrongOpt);
    }
  }

  // Nếu vẫn trùng đáp án sau khi offset (do số quá nhỏ), thêm số ngẫu nhiên khác
  if (optionsSet.size < 3) {
    let fallback = 1;
    while(optionsSet.size < 3) {
      if (!optionsSet.has(answer + fallback)) optionsSet.add(answer + fallback);
      else if (answer - fallback >= 0 && !optionsSet.has(answer - fallback)) optionsSet.add(answer - fallback);
      fallback++;
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    a,
    b,
    op,
    type,
    answer,
    options: shuffleArray(Array.from(optionsSet)),
  };
};
