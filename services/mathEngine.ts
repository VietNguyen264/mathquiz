
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

export const generateQuestion = (type: OperationType, difficulty: Difficulty): Question => {
  let a = 0, b = 0, answer = 0, op = '';

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
      a = getRandomInt(minAns, maxAns);
      answer = getRandomInt(0, a - minAns > 0 ? a - minAns : 0); // Đảm bảo kết quả nằm trong dải mong muốn
      // Thực tế với lớp 1, phép trừ thường là a - b = answer, với answer nhỏ.
      // Điều chỉnh để a và b phù hợp:
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
      // Phép nhân lớp 1 chỉ ở mức làm quen
      if (difficulty === Difficulty.EASY) {
        a = getRandomInt(1, 5);
        b = getRandomInt(1, 4);
      } else if (difficulty === Difficulty.MEDIUM) {
        a = getRandomInt(2, 10);
        b = getRandomInt(2, 5);
      } else {
        a = getRandomInt(5, 12);
        b = getRandomInt(3, 8);
      }
      answer = a * b;
      op = '×';
      break;
    case OperationType.DIVISION:
      if (difficulty === Difficulty.EASY) {
        answer = getRandomInt(1, 5);
        b = getRandomInt(1, 4);
      } else if (difficulty === Difficulty.MEDIUM) {
        answer = getRandomInt(5, 10);
        b = getRandomInt(2, 5);
      } else {
        answer = getRandomInt(10, 20);
        b = getRandomInt(2, 5);
      }
      a = answer * b;
      op = '÷';
      break;
  }

  // Tạo các phương án sai xung quanh kết quả đúng
  const optionsSet = new Set<number>([answer]);
  while (optionsSet.size < 3) {
    const offset = getRandomInt(-5, 5);
    const wrongOpt = answer + offset;
    if (wrongOpt >= 0 && wrongOpt !== answer) {
      optionsSet.add(wrongOpt);
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
