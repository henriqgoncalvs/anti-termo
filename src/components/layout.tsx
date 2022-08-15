import { MdLeaderboard } from 'react-icons/md';

import { Seo } from './seo';

type LayoutP = {
  children: React.ReactNode;
};

type HeaderP = {
  children: React.ReactNode;
};

const HeaderButton = ({ children, ...restProps }: HeaderP) => {
  return (
    <button
      className='w-[25px] h-[25px] text-md text-caramel flex items-center justify-center border-caramel rounded-md border-2 p-1'
      {...restProps}
    >
      {children}
    </button>
  );
};

const Header = () => {
  return (
    <header className='bg-primary-700 p-5 w-full'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <HeaderButton>?</HeaderButton>
          </div>
          <div className='flex items-center'>
            <h1 className='ml-2 text-white font-semibold text-2xl'>
              <span className='text-primary-700 font-black bg-champagne rounded-lg px-2'>Anti</span>{' '}
              Termo
            </h1>
          </div>
          <div className='flex gap-2 items-center'>
            <HeaderButton>
              <MdLeaderboard />
            </HeaderButton>
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