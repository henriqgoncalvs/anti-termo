import create from 'zustand';
import { persist } from 'zustand/middleware';

import { computeGuess, getSolution, Letter, normalizeGuess } from '@/utils/word-utils';

export const GUESS_LENGTH = 7;

export type KeyboardLetterStateTypes = 'miss' | 'present' | 'match';

interface GameStoreState {
  solution: string;
  tries: Array<Letter[]>;
  gameState: 'playing' | 'won' | 'lost';
  addTry: (guess: string) => void;
  curRow: number;
  keyboardLetterState: { [letter: string]: { state: KeyboardLetterStateTypes[]; index: number } };
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => {
      const addTry = (guess: string) => {
        const normGuess = normalizeGuess(guess);

        const result = computeGuess(normGuess, get().solution, get().curRow);

        const didLose = result.every((l) => l.state === 'match');

        const tries = get().tries;

        tries[get().curRow] = result;

        const newCurRow = get().curRow + 1;

        const keyboardLetterState = get().keyboardLetterState;

        result.forEach((r, index) => {
          const resultGuessLetter = normGuess[index];

          const currentLetterState = keyboardLetterState[resultGuessLetter];

          if (r.state) {
            if (!currentLetterState) {
              keyboardLetterState[resultGuessLetter] = { state: [r.state], index };
              return;
            }

            if (r.state !== 'miss') {
              if (currentLetterState && !currentLetterState.state.includes(r.state)) {
                keyboardLetterState[resultGuessLetter].state.push(r.state);
                return;
              }
            }
          }
        });

        set(() => ({
          curRow: newCurRow,
          tries,
          keyboardLetterState: keyboardLetterState,
          gameState: didLose ? 'lost' : newCurRow === GUESS_LENGTH ? 'won' : 'playing',
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
          [
            { letter: '', cursor: { x: 0, y: 6 } },
            { letter: '', cursor: { x: 1, y: 6 } },
            { letter: '', cursor: { x: 2, y: 6 } },
            { letter: '', cursor: { x: 3, y: 6 } },
            { letter: '', cursor: { x: 4, y: 6 } },
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
