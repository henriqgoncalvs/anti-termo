import { useEffect, useState } from 'react';

import { useGameStore } from '@/store/game-store';

import { AboutModal } from './modals/about-modal';
import { HowToPlayModal } from './modals/how-to-play-modal';
import { Seo } from './seo';

type LayoutP = {
  children: React.ReactNode;
};

type HeaderP = {
  onClick?: () => void;
  children: React.ReactNode;
};

const HeaderButton = ({ children, onClick, ...restProps }: HeaderP) => {
  return (
    <button
      className='w-[25px] h-[25px] text-md text-caramel flex items-center justify-center border-caramel rounded-md border-2 p-1'
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

const Header = () => {
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState<boolean>(false);
  const [isAboutModal, setIsAboutModal] = useState<boolean>(false);

  const {
    state: { curDay },
  } = useGameStore();

  useEffect(() => {
    if (curDay === 0) {
      setIsHowToPlayModalOpen(true);
    }
  }, [curDay]);

  return (
    <header className='bg-primary-700 p-5 w-full'>
      <HowToPlayModal isOpen={isHowToPlayModalOpen} setIsOpen={setIsHowToPlayModalOpen} />
      <AboutModal isOpen={isAboutModal} setIsOpen={setIsAboutModal} />
      <div className='container mx-auto'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <HeaderButton onClick={() => setIsHowToPlayModalOpen(true)}>?</HeaderButton>
          </div>
          <div className='flex items-center'>
            <h1 className='ml-2 text-white font-semibold text-2xl'>
              <span className='text-primary-700 font-black bg-champagne rounded-lg px-2'>Anti</span>{' '}
              Termo
            </h1>
          </div>
          <div className='flex gap-2 items-center'>
            <HeaderButton onClick={() => setIsAboutModal(true)}>i</HeaderButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }: LayoutP) => {
  return (
    <>
      <Seo />

      <Header />
      <main className='container mx-auto flex flex-col flex-1 px-3 py-5 items-center h-full'>
        {children}
      </main>
    </>
  );
};
