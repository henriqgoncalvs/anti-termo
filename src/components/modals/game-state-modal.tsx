import { IGif } from '@giphy/js-types';
import { Gif } from '@giphy/react-components';
import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { IoMdCloseCircle } from 'react-icons/io';

import gf from '@/lib/gf';

import { useGameStore } from '@/store/game-store';

import { getNextGameDate, getSolution } from '@/utils/word-utils';

export const GameStateModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    state: { gameState },
  } = useGameStore();
  const [gif, setGif] = useState<IGif | null>(null);

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

  return (
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
                      <div className='text-3xl font-black flex items-center justify-center gap-2 mx-auto'>
                        <p className='bg-caramel rounded-md p-1'>
                          <span>{props.hours}</span>
                          <span className='lowercase'>h</span>
                        </p>
                        <p className='bg-caramel rounded-md p-1'>
                          <span>{props.minutes}</span>
                          <span className='lowercase'>m</span>
                        </p>
                        <p className='bg-caramel rounded-md p-1'>
                          <span>{props.seconds}</span>
                          <span className='lowercase'>s</span>
                        </p>
                      </div>
                    )}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
