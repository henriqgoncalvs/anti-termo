import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

import { useGuess } from '@/hooks/useGuess';

import { Keyboard } from '@/components/keyboard';
import { Layout } from '@/components/layout';
import WordRow from '@/components/word-row';

import { useGameStore } from '@/store/game-store';

import { Letter } from '@/utils/word-utils';

const Home: NextPage = () => {
  const { curRow, tries } = useGameStore();

  const [rows, setRows] = useState<Letter[][] | undefined>(undefined);

  const [addGuessLetter] = useGuess({ setRows });

  const [showInvalidGuess, setInvalidGuess] = useState(false);

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
    let id: NodeJS.Timeout;
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 2000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [showInvalidGuess]);

  return (
    <Layout>
      <div className='flex flex-col flex-1 items-center justify-center'>
        <div className='grid grid-rows-6 gap-[0.3rem] mb-4'>
          {rows?.map((letters, index) => (
            <WordRow
              key={index}
              letters={letters}
              className={showInvalidGuess && curRow === index ? `animate-bounce` : ``}
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
