import words from '@/data/words.json';

export type Normalized = keyof typeof words.normalized;

export const WORD_LENGTH = 5;

// 1 January 2022 Game Epoch
export const firstGameDate = new Date(2022, 7, 11);

export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getIndex = () => {
  const start = new Date(firstGameDate);
  const today = getToday();
  let index = -1;
  do {
    index++;
    start.setDate(start.getDate() + 1);
  } while (start <= today);

  return index;
};

export const getLastGameDate = () => {
  const t = getToday();
  t.setHours(0, 0, 0);
  const daysSinceLastGame = (t.getDay() - firstGameDate.getDay() + 7) % 1;
  const lastDate = new Date(t);
  lastDate.setDate(t.getDate() - daysSinceLastGame);
  return lastDate;
};

export const getNextGameDate = () => {
  const t = getToday();
  t.setHours(0, 0, 0);
  t.setDate(getLastGameDate().getDate() + 1);
  return t;
};

export const getSolution = () => {
  const index = getIndex();

  const randomWord = words.valid[index % words.valid.length];

  return {
    solution: randomWord,
  };
};

export const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const normalizeGuess = (guess: string): string => {
  const guessNormalized = words.normalized[guess as Normalized] || guess;

  return guessNormalized;
};

export type LetterState = 'miss' | 'present' | 'match';

export type Letter = {
  letter: string;
  state?: LetterState;
  cursor: {
    x: number;
    y: number;
  };
};

export const computeGuess = (guess: string, answer: string, curRow: number): Letter[] => {
  const result: Letter[] = [];

  if (guess.length !== answer.length) {
    return result;
  }

  const guessArray = removeAccents(guess).split('');
  const answerArray = removeAccents(answer).split('');

  const match = guessArray.map((letter, index) => ({
    letter: letter,
    state: 'miss',
    cursor: {
      x: index,
      y: curRow,
    },
  }));

  for (let i = guessArray.length - 1; i >= 0; i--) {
    if (removeAccents(answer)[i] === guessArray[i]) {
      match[i].state = 'match';
      answerArray.splice(i, 1);
    }
  }

  guessArray.forEach((letter, i) => {
    if (answerArray.includes(letter) && match[i].state !== 'match') {
      match[i].state = 'present';
      answerArray.splice(answerArray.indexOf(letter), 1);
    }
  });

  match.forEach((letter) => {
    result.push(letter as Letter);
  });

  return result.map((r, index) => {
    r.letter = guess[index];

    return r;
  });
};
