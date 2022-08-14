import create from 'zustand';
import { persist } from 'zustand/middleware';

import { computeGuess, getSolution, Letter, normalizeGuess } from '@/utils/word-utils';

export const GUESS_LENGTH = 6;

interface GameStoreState {
  solution: string;
  normalizedSolution: string;
  tries: Array<Letter[]>;
  gameState: 'playing' | 'won' | 'lost';
  addTry: (guess: string) => void;
  curRow: number;
  keyboardLetterState: { [letter: string]: 'present' | 'miss' | 'match' };
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => {
      const addTry = (guess: string) => {
        const normGuess = normalizeGuess(guess);

        const result = computeGuess(normGuess, get().solution, get().curRow);

        const didWin = result.every((l) => l.state === 'match');

        const tries = get().tries;

        tries[get().curRow] = result;

        const newCurRow = get().curRow + 1;

        const keyboardLetterState = get().keyboardLetterState;

        result.forEach((r, index) => {
          const resultGuessLetter = normGuess[index];

          const currentLetterState = keyboardLetterState[resultGuessLetter];

          if (currentLetterState === 'match') {
            return;
          }

          if (currentLetterState === 'present' || currentLetterState === 'miss') {
            return;
          }

          if (r.state) {
            keyboardLetterState[resultGuessLetter] = r.state;
          }
        });

        set(() => ({
          curRow: newCurRow,
          tries,
          keyboardLetterState: keyboardLetterState,
          gameState: didWin ? 'won' : newCurRow === GUESS_LENGTH ? 'lost' : 'playing',
        }));
      };

      return {
        ...getSolution(),
        tries: [
          [
            { letter: '', cursor: { x: 0, y: 0 } },
            { letter: '', cursor: { x: 1, y: 0 } },
            { letter: '', cursor: { x: 2, y: 0 } },
            { letter: '', cursor: { x: 3, y: 0 } },
            { letter: '', cursor: { x: 4, y: 0 } },
          ],
          [
            { letter: '', cursor: { x: 0, y: 1 } },
            { letter: '', cursor: { x: 1, y: 1 } },
            { letter: '', cursor: { x: 2, y: 1 } },
            { letter: '', cursor: { x: 3, y: 1 } },
            { letter: '', cursor: { x: 4, y: 1 } },
          ],
          [
            { letter: '', cursor: { x: 0, y: 2 } },
            { letter: '', cursor: { x: 1, y: 2 } },
            { letter: '', cursor: { x: 2, y: 2 } },
            { letter: '', cursor: { x: 3, y: 2 } },
            { letter: '', cursor: { x: 4, y: 2 } },
          ],
          [
            { letter: '', cursor: { x: 0, y: 3 } },
            { letter: '', cursor: { x: 1, y: 3 } },
            { letter: '', cursor: { x: 2, y: 3 } },
            { letter: '', cursor: { x: 3, y: 3 } },
            { letter: '', cursor: { x: 4, y: 3 } },
          ],
          [
            { letter: '', cursor: { x: 0, y: 4 } },
            { letter: '', cursor: { x: 1, y: 4 } },
            { letter: '', cursor: { x: 2, y: 4 } },
            { letter: '', cursor: { x: 3, y: 4 } },
            { letter: '', cursor: { x: 4, y: 4 } },
          ],
          [
            { letter: '', cursor: { x: 0, y: 5 } },
            { letter: '', cursor: { x: 1, y: 5 } },
            { letter: '', cursor: { x: 2, y: 5 } },
            { letter: '', cursor: { x: 3, y: 5 } },
            { letter: '', cursor: { x: 4, y: 5 } },
          ],
        ],
        curRow: 0,
        keyboardLetterState: {},
        gameState: 'playing',
        addTry,
      };
    },
    {
      name: 'anti-termo',
    },
  ),
);
