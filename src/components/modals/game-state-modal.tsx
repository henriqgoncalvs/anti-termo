/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IGif } from '@giphy/js-types';
import { Gif } from '@giphy/react-components';
import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, Fragment, SetStateAction, useCallback, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { FaShareAlt } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';

import gf from '@/lib/gf';
import { useIsMobile } from '@/hooks/useIsMobile';

import { useGameStore } from '@/store/game-store';

import { getNextGameDate, getSolution, LetterState } from '@/utils/word-utils';

const matchStateEmojiParser: Record<LetterState, string> = {
  match: '🟥',
  present: '🟨',
  miss: '⬛',
};

export const GameStateModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    state: { gameState, curDay, tries },
  } = useGameStore();
  const [gif, setGif] = useState<IGif | null>(null);
  const [copiedToClipToast, setCopiedToClipToast] = useState<boolean | undefined>(undefined);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchGif = async () => {
      const { data } = await gf.random({
        tag: gameState === 'won' ? 'happy' : 'sad',
        type: 'gifs',
      });
      setGif(data);
    };
    fetchGif();
  }, [gameState]);

  useEffect(() => {
    let id: NodeJS.Timeout;

    if (copiedToClipToast) {
      id = setTimeout(() => {
        if (copiedToClipToast) setCopiedToClipToast(false);
      }, 3000);
    }

    return () => clearTimeout(id);
  }, [copiedToClipToast]);

  const handleShare = useCallback(() => {
    const generateTextForShare = () => {
      return `#AntiTermo #${curDay} 🤠\n\n${tries
        .map((tr) => {
          if (tr[0].letter) {
            return tr
              .map((t) => `${matchStateEmojiParser[t.state!]}`)
              .concat('\n')
              .join('');
          }
        })
        .join('')}`;
    };

    if (isMobile) {
      navigator.share({
        title: 'Anti Termo',
        text: generateTextForShare(),
        url: 'https://antitermo.hnqg.io',
      });
    } else {
      setCopiedToClipToast(true);
      navigator.clipboard.writeText(generateTextForShare().concat('\nhttps://antitermo.hnqg.io/'));
    }
  }, [isMobile, curDay, tries]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300 delay-100'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <AnimatePresence>
                {copiedToClipToast && (
                  <motion.div
                    className='w-full absolute top-5 flex flex-col gap-1 items-center'
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                  >
                    <p className='bg-primary-500 text-lg font-semibold p-2 rounded-md mb-1 last:mb-0'>
                      copiado para o ctrl+v
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300 delay-100'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-primary-500 p-6 align-middle shadow-xl transition-all relative'>
                  <div
                    className='absolute top-5 right-5 text-white cursor-pointer w-fit h-fit'
                    onClick={() => setIsOpen(false)}
                  >
                    <IoMdCloseCircle size={25} />
                  </div>

                  <Dialog.Title
                    as='div'
                    className='font-black leading-6 flex flex-col items-center gap-5'
                  >
                    {gif && (
                      <div className='w-[200px] max-h-[200px] flex items-center justify-center overflow-hidden rounded-lg'>
                        <Gif gif={gif} width={200} />
                      </div>
                    )}
                    <div>
                      {gameState === 'won' && (
                        <>
                          <p className='mb-1'>Parabéns 🥳🥳</p>
                          <p className=''>Você venceu!</p>
                        </>
                      )}
                      {gameState === 'lost' && (
                        <>
                          <p className='mb-1 text-md'>Que pena 😔😔</p>
                          <p className='text-2xl'>Você perdeu!</p>
                        </>
                      )}
                    </div>
                  </Dialog.Title>
                  <div className='my-6'>
                    <div className='mb-6 p-3 bg-primary-800 rounded-md flex flex-col items-center'>
                      <p className='text-xs'>A palavra do dia é</p>
                      <span className='text-2xl font-black mt-2'>{getSolution().solution}</span>
                    </div>
                    <p className='text-xs mb-2'>Próximo jogo</p>
                    <Countdown
                      date={getNextGameDate()}
                      daysInHours={true}
                      renderer={(props) => (
                        <div className='text-3xl font-black grid grid-cols-3 gap-2 w-9/12 mx-auto'>
                          <p className='bg-caramel rounded-md p-1'>
                            <span>{props.hours < 10 ? `0${props.hours}` : props.hours}</span>
                            <span className='lowercase'>h</span>
                          </p>
                          <p className='bg-caramel rounded-md p-1'>
                            <span>{props.minutes < 10 ? `0${props.minutes}` : props.minutes}</span>
                            <span className='lowercase'>m</span>
                          </p>
                          <p className='bg-caramel rounded-md p-1'>
                            <span>{props.seconds < 10 ? `0${props.seconds}` : props.seconds}</span>
                            <span className='lowercase'>s</span>
                          </p>
                        </div>
                      )}
                    />
                  </div>
                  <button
                    className='flex items-center justify-center gap-3 bg-green-500 w-full p-3 rounded-md uppercase mt-3 font-black'
                    onClick={handleShare}
                  >
                    Compartilhar
                    <FaShareAlt />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
