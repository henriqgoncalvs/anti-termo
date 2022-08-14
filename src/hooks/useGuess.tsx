/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { KEYS } from '@/components/keyboard';

import { useGameStore } from '@/store/game-store';

import { isValidWord, Letter, WORD_LENGTH } from '@/utils/word-utils';

const VALID_KEYS = KEYS.flatMap((row) => row.map((key) => key.toLowerCase())).filter(Boolean);

export function useGuess({
  setRows,
}: {
  setRows: Dispatch<SetStateAction<Letter[][] | undefined>>;
}): [(letter: string) => void] {
  const { addTry, curRow } = useGameStore();

  const [curGuess, setCurGuess] = useState('');

  const prevGuess = useRef<string | null>(null);

  const [, setInvalidGuess] = useState(false);

  const addGuessLetter = (letter: string) => {
    if (letter === 'backspace') {
      const guess = curGuess.slice(0, -1);

      setCurGuess(guess);
      prevGuess.current = guess;

      return;
    }

    if (letter === 'enter') {
      if (curGuess.length === WORD_LENGTH) {
        return setCurGuess('');
      }
    }

    const guess =
      letter.length === 1 && curGuess.length !== WORD_LENGTH ? `${curGuess}${letter}` : curGuess;

    setCurGuess(guess);
    prevGuess.current = guess;

    return;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const letter = e.key.toLowerCase();

    if (VALID_KEYS.includes(letter)) addGuessLetter(letter);
  };

  useEffect(() => {
    if (curGuess.length === 0 && prevGuess?.current?.length === WORD_LENGTH) {
      if (isValidWord(prevGuess.current)) {
        addTry(prevGuess.current);
        setInvalidGuess(false);
      } else {
        setInvalidGuess(true);
        setCurGuess(prevGuess.current);
      }
    } else {
      setRows((prev) => {
        if (!prev) {
          return void 0;
        }

        const newRow = prev[curRow];

        newRow?.forEach((letter, index) => {
          if (curGuess[index]) {
            newRow[index] = { letter: curGuess[index], cursor: { x: index, y: curRow } };
          } else {
            newRow[index] = { letter: '', cursor: { x: index, y: curRow } };
          }
        });

        return [..._.take(prev, curRow), newRow, ..._.takeRight(prev, prev.length - curRow - 1)];
      });
    }
  }, [curGuess]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return [addGuessLetter];
}
