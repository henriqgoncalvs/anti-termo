/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import words from '@/data/words.json';

import { KEYS } from '@/components/keyboard';

import { useGameStore } from '@/store/game-store';

import { Letter, Normalized, WORD_LENGTH } from '@/utils/word-utils';

const VALID_KEYS = KEYS.flatMap((row) => row.map((key) => key.toLowerCase())).filter(Boolean);

export function useGuess({
  setRows,
}: {
  setRows: Dispatch<SetStateAction<Letter[][] | undefined>>;
}): [(letter: string) => void, [boolean, string[]]] {
  const { addTry, curRow, keyboardLetterState, tries, gameState } = useGameStore();

  const [curGuess, setCurGuess] = useState('');

  const prevGuess = useRef<string | null>(null);

  const [showInvalidGuess, setShowInvalidGuess] = useState<[boolean, string[]]>([false, ['']]);

  const addGuessLetter = (letter: string) => {
    if (gameState === 'playing') {
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
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const letter = e.key.toLowerCase();

    if (VALID_KEYS.includes(letter) && gameState === 'playing') addGuessLetter(letter);
  };

  const isValidWord = (guess: string): boolean => {
    const guessNormalized = words.normalized[guess as Normalized] || guess;

    if (!words.invalid.concat(words.valid).includes(guessNormalized)) {
      setShowInvalidGuess([true, ['Palavra inválida']]);
      return false;
    }

    return true;
  };

  const isValidGuess = (guess: string) => {
    let isValid = true;
    const errorMessages: string[] = [];

    const previousGuesses = tries
      .filter((tr, index) => index < curRow)
      .map((tr) => {
        const word = tr.map((t) => t.letter).join('');

        if (word) return word;
      })
      .filter((word) => !!word);

    if (previousGuesses.includes(guess)) {
      setShowInvalidGuess([true, ['Você não pode repetir palavras']]);
      return false;
    }

    guess.split('').forEach((letter, index) => {
      const letterState = keyboardLetterState[letter];

      if (letterState) {
        letterState.forEach((st) => {
          if (
            st.state === 'match' &&
            st.index !== index &&
            !letterState.some((ls) => ls.state === 'present')
          ) {
            isValid = false;
            errorMessages.push(`Repita ${letter} na mesma posição`);
          }

          if (st.state === 'present' && !guess.includes(letter)) {
            isValid = false;
            errorMessages.push(`${letter} precisa estar na palavra.`);
          }

          if (st.state === 'miss') {
            isValid = false;
            errorMessages.push(`${letter} não pode ser usado.`);
          }
        });
      } else {
        const keyboardLettersStateInIndex = Object.entries(keyboardLetterState).filter((keyState) =>
          keyState[1].filter((ks) => ks.index === index),
        );

        keyboardLettersStateInIndex.forEach((keyLetStateIndex) => {
          if (
            keyLetStateIndex &&
            keyLetStateIndex[1].filter((kls) => kls.index === index)[0]?.state === 'match'
          ) {
            isValid = false;
            errorMessages.push(`Repita ${keyLetStateIndex[0]} na mesma posição`);
          }

          if (
            keyLetStateIndex &&
            keyLetStateIndex[1].filter((kls) => kls.index === index)[0]?.state === 'present'
          ) {
            isValid = false;
            errorMessages.push(`${keyLetStateIndex[0]} precisa estar na palavra`);
          }
        });
      }
    });

    if (!isValid) {
      setShowInvalidGuess([true, errorMessages]);
    }

    return isValid;
  };

  useEffect(() => {
    if (curGuess.length === 0 && prevGuess?.current?.length === WORD_LENGTH) {
      if (isValidWord(prevGuess.current) && isValidGuess(prevGuess.current)) {
        addTry(prevGuess.current);
      } else {
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
    let id: NodeJS.Timeout;
    if (showInvalidGuess[0]) {
      id = setTimeout(() => setShowInvalidGuess([false, []]), 3000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [showInvalidGuess]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return [addGuessLetter, showInvalidGuess];
}
