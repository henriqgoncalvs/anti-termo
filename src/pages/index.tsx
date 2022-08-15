import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';

import { useGuess, VALID_KEYS } from '@/hooks/useGuess';

import { Keyboard } from '@/components/keyboard';
import { Layout } from '@/components/layout';
import WordRow from '@/components/word-row';

import { useGameStore } from '@/store/game-store';

import { Letter } from '@/utils/word-utils';

const Home: NextPage = () => {
  const { curRow, tries, gameState } = useGameStore();

  const [rows, setRows] = useState<Letter[][] | undefined>(undefined);

  const [addGuessLetter, showInvalidGuess] = useGuess({ setRows });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const letter = e.key.toLowerCase();

      if (VALID_KEYS.includes(letter) && gameState === 'playing') {
        addGuessLetter(letter);
      }
    },
    [addGuessLetter, gameState],
  );

  useEffect(() => {
    if (!rows) {
      setRows(tries);
    }
  }, [tries, rows]);

  useEffect(() => {
    useGameStore.subscribe((state) => {
      setRows([...state.tries]);
    });
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Layout>
      <div className='flex flex-col flex-1 items-center justify-center'>
        {showInvalidGuess[0] && showInvalidGuess[1].map((error) => <p key={error}>{error}</p>)}
        <div className='grid grid-rows-6 gap-[0.3rem] mb-4'>
          {rows?.map((letters, index) => (
            <WordRow
              key={index}
              letters={letters}
              className={showInvalidGuess[0] && curRow === index ? `animate-bounce` : ``}
            />
          ))}
        </div>
      </div>
      <Keyboard
        onClick={(letter: string) => {
          addGuessLetter(letter);
        }}
      />
    </Layout>
  );
};

export default Home;
