import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';

import { useGuess, VALID_KEYS } from '@/hooks/useGuess';

import { Keyboard } from '@/components/keyboard';
import { Layout } from '@/components/layout';
import { GameStateModal } from '@/components/modals/game-state-modal';
import WordRow from '@/components/word-row';

import { useGameStore } from '@/store/game-store';

import { Letter } from '@/utils/word-utils';

const Home: NextPage = () => {
  const { curRow, tries, gameState } = useGameStore();

  const [rows, setRows] = useState<Letter[][] | undefined>(undefined);

  const [addGuessLetter, showInvalidGuess] = useGuess({ setRows });

  const [isGameStateModalOpen, setIsGameStateModalOpen] = useState<boolean>(false);

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

      if (state.gameState === 'won' || state.gameState === 'lost') {
        setIsGameStateModalOpen(true);
      }
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
      <GameStateModal isOpen={isGameStateModalOpen} setIsOpen={setIsGameStateModalOpen} />
      <div
        className='flex flex-col flex-1 items-center justify-center relative overflow-hidden'
        onClick={() => {
          if (gameState === 'lost' || gameState === 'won') {
            setIsGameStateModalOpen((prev) => !prev);
          }
        }}
      >
        <AnimatePresence>
          {showInvalidGuess[0] && (
            <motion.div
              className='w-full absolute top-0 flex flex-col gap-1 items-center'
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
            >
              {showInvalidGuess[1].map((error) => (
                <p
                  key={error}
                  className='bg-primary-500 text-sm font-semibold p-2 rounded-md mb-1 last:mb-0'
                >
                  {error}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className='grid grid-rows-5 gap-[0.3rem] mb-4 px-3'>
          {rows?.map((letters, index) => (
            <WordRow
              key={index}
              letters={letters}
              className={showInvalidGuess[0] && curRow === index ? `animate-rowshake` : ``}
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
