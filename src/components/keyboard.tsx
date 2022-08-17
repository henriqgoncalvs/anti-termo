import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { BsBackspace } from 'react-icons/bs';

import { KeyboardLetterStateTypes, useGameStore } from '@/store/game-store';

export const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '', ''],
  ['', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '', 'backspace'],
  ['', '', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '', 'enter'],
];

const PARSE_KEYS = {
  backspace: <BsBackspace />,
  enter: 'ENTER',
};

type ParseKey = keyof typeof PARSE_KEYS;

const isParsableKey = (key: string): key is ParseKey => {
  return key in PARSE_KEYS;
};

const keyStateStyles = {
  miss: 'bg-primary-600 opacity-30',
  present: 'bg-yellow-500',
  match: 'bg-red-500',
  'present match': 'present-match-keyboard-state',
};

type KeyboardP = {
  onClick: (key: string) => void;
};

export const Keyboard = ({ onClick: onClickProps }: KeyboardP) => {
  const {
    state: { keyboardLetterState },
  } = useGameStore();
  const [keyboardLetterStateCopy, setKeyboardLetterStateCopy] = useState<{
    [letter: string]: {
      state: KeyboardLetterStateTypes;
      index: number;
    }[];
  }>({});

  useEffect(() => {
    if (keyboardLetterState) {
      setKeyboardLetterStateCopy(keyboardLetterState);
    }
  }, [keyboardLetterState]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { textContent, innerHTML } = e.currentTarget;

    let returnProps = textContent || '';

    if (textContent !== innerHTML) {
      returnProps = 'backspace';
    }

    onClickProps(returnProps.toLowerCase());
  };

  const checkLetterStateStyles = (key: string) => {
    if (keyboardLetterStateCopy[key.toLocaleLowerCase()]) {
      if (
        keyboardLetterStateCopy[key.toLocaleLowerCase()].some((kls) => kls.state === 'match') &&
        keyboardLetterStateCopy[key.toLocaleLowerCase()].some((kls) => kls.state === 'present')
      ) {
        return keyStateStyles['present match'];
      }

      if (keyboardLetterStateCopy[key.toLocaleLowerCase()].some((kls) => kls.state === 'match')) {
        return keyStateStyles['match'];
      }

      if (keyboardLetterStateCopy[key.toLocaleLowerCase()].some((kls) => kls.state === 'present')) {
        return keyStateStyles['present'];
      }

      if (keyboardLetterStateCopy[key.toLocaleLowerCase()].some((kls) => kls.state === 'miss')) {
        return keyStateStyles['miss'];
      }
    }

    return '';
  };

  return (
    <div className='grid gap-1 md:gap-2 select-none mx-auto '>
      {KEYS.map((row, rowIndex) => (
        <div
          key={`key-row-${rowIndex}`}
          className='flex touch-manipulation justify-center gap-1 md:gap-2'
        >
          {row.map((key, letterIndex) => {
            if (key === '') {
              return <div key={`empty-key-${letterIndex}`} className='w-1 pointer-events-none' />;
            }

            const letterState = checkLetterStateStyles(key);

            return (
              <button
                onClick={onClick}
                key={key + letterIndex}
                className={clsx(
                  'overflow-hidden md:px-3 px-2 py-5 rounded-md md:text-2xl text-base font-bold transition-all md:min-w-[2.5rem] min-w-[1.85rem] flex items-center justify-center',
                  letterState ? letterState : key !== '' ? 'bg-gray-600' : '',
                )}
              >
                {isParsableKey(key) ? PARSE_KEYS[key] : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
