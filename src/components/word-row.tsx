import clsx from 'clsx';

import { Letter, LetterState } from '@/utils/word-utils';

interface WordRowProps {
  letters: Letter[];
  className?: string;
}

const WordRow = ({ letters = [], className = '' }: WordRowProps) => {
  return (
    <div className={`grid grid-cols-5 gap-[0.3rem] bg-green ${className}`}>
      {letters.map((char, index) => (
        <CharacterBox
          key={`letra-${index}-${char.cursor.x}-${char.cursor.y}`}
          value={char.letter}
          state={char.state}
        />
      ))}
    </div>
  );
};

const characterStateStyles = {
  miss: 'bg-gray-800 border-gray-800',
  present: 'bg-yellow-500 border-yellow-500',
  match: 'bg-red-500 border-red-500',
};

interface CharacterBoxProps {
  value: string;
  state?: LetterState;
}

const CharacterBox = ({ value, state, ...restProps }: CharacterBoxProps) => {
  return (
    <span
      className={clsx(
        'h-14 w-14 flex items-center justify-center text-2xl font-bold text-gray-50 text-center rounded-[10%] uppercase border border-gray-500',
        !state ? '' : characterStateStyles[state],
      )}
      {...restProps}
    >
      {value}
    </span>
  );
};

export default WordRow;
