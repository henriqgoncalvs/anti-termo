import words from '@/data/words.json';

type Normalized = keyof typeof words.normalized;

export const WORD_LENGTH = 5;

export const getSolution = () => {
  const randomIndex = Math.floor(Math.random() * words.valid.length);

  const randomWord = words.valid[randomIndex];
  const normalizedRandomWord =
    words.normalized[words.valid[randomIndex] as Normalized] || randomWord;

  return {
    solution: randomWord,
    normalizedSolution: normalizedRandomWord,
  };
};

export const isValidWord = (guess: string): boolean => {
  const guessNormalized = words.normalized[guess as Normalized] || guess;

  return words.invalid.concat(words.valid).includes(guessNormalized);
};

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

  const guessArray = guess.split('');
  const answerArray = answer.split('');

  const match = guessArray.map((letter, index) => ({
    letter: letter,
    state: 'miss',
    cursor: {
      x: index,
      y: curRow,
    },
  }));

  for (let i = guessArray.length - 1; i >= 0; i--) {
    if (answer[i] === guessArray[i]) {
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

  return result;
};
