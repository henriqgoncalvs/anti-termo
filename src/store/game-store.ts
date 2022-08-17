import _ from 'lodash';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import {
  computeGuess,
  getIndex,
  getSolution,
  Letter,
  normalizeGuess,
  removeAccents,
} from '@/utils/word-utils';

export const GUESS_LENGTH = 5;

export type KeyboardLetterStateTypes = 'miss' | 'present' | 'match';

interface GameStoreState {
  state: {
    solution: string;
    tries: Array<Letter[]>;
    gameState: 'playing' | 'won' | 'lost';
    curRow: number;
    keyboardLetterState: { [letter: string]: { state: KeyboardLetterStateTypes; index: number }[] };
    curDay: number;
  };
  addTry: (guess: string) => void;
  init: () => void;
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => {
      const addTry = (guess: string) => {
        const normGuess = normalizeGuess(guess);

        const result = computeGuess(normGuess, get().state.solution, get().state.curRow);

        const didLose = result.every((l) => l.state === 'match');

        const tries = get().state.tries;

        tries[get().state.curRow] = result;

        const newCurRow = get().state.curRow + 1;

        const keyboardLetterState = get().state.keyboardLetterState;

        _.uniq(result).forEach((r) => {
          keyboardLetterState[r.letter] = [];
        });

        result.forEach((r, index) => {
          const resultGuessLetter = removeAccents(normGuess)[index];

          const currentLetterState = keyboardLetterState[resultGuessLetter];

          if (r.state) {
            if (!currentLetterState) {
              keyboardLetterState[resultGuessLetter] = [{ state: r.state, index }];
              return;
            }

            if (!currentLetterState.some((cls) => cls.index === index)) {
              keyboardLetterState[resultGuessLetter].push({ state: r.state, index });
              return;
            }
          }
        });

        set(() => ({
          ...get(),
          state: {
            ...get().state,
            curRow: newCurRow,
            tries,
            keyboardLetterState: keyboardLetterState,
            gameState: didLose ? 'lost' : newCurRow === GUESS_LENGTH ? 'won' : 'playing',
          },
        }));
      };

      const init = () => {
        const curDay = getIndex();

        if (get()?.state?.curDay === curDay) {
          return;
        }

        set(() => ({
          ...get(),
          state: {
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
            ],
            curRow: 0,
            keyboardLetterState: {},
            gameState: 'playing',
            curDay,
          },
          addTry,
        }));
      };

      return {
        state: {
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
          ],
          curRow: 0,
          keyboardLetterState: {},
          gameState: 'playing',
          curDay: 0,
        },
        addTry,
        init,
      };
    },
    {
      name: 'anti-termo',
    },
  ),
);
