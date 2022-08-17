import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';

export const HowToPlayModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
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
                  as='h2'
                  className='text-sm font-black leading-6 flex flex-col items-center gap-5'
                >
                  Como que joga isso? 🤔
                </Dialog.Title>
                <div className='my-6'>
                  <p className='text-xs mb-2'>Erre a palavra do dia em 5 tentativas.</p>
                  <p className='text-xs mb-2 font-extrabold'>Peraí, errar?</p>
                  <p className='text-xs mb-2'>
                    Isso mesmo, seu objetivo em <strong>Anti Termo</strong> é não acertar a palavra
                    do dia. Parece fácil, não é? Bom, nem tanto.
                  </p>
                </div>
                <p className='mt-1 mb-3 text-center text-lg font-extrabold'>REGRAS</p>
                <div className='w-full my-1 flex flex-col gap-3'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex-shrink-0 flex-grow-0 h-14 w-14 flex items-center justify-center text-2xl font-bold text-gray-50 text-center rounded-[10%] uppercase border bg-gray-800 border-gray-800'>
                      A
                    </div>
                    <p className='text-xs text-left flex-1'>
                      Se a letra ficar <strong>cinza</strong>, você não poderá repeti-la nas
                      próximas tentativas.
                    </p>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex-shrink-0 flex-grow-0 h-14 w-14 flex items-center justify-center text-2xl font-bold text-gray-50 text-center rounded-[10%] uppercase border bg-yellow-500 border-yellow-500'>
                      V
                    </div>
                    <p className='text-xs text-left flex-1'>
                      Se a letra ficar <strong>amarela</strong>, significa que ela está presente na
                      palavra do dia e deverá ser repetida nas próximas tentativas.
                    </p>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex-shrink-0 flex-grow-0 h-14 w-14 flex items-center justify-center text-2xl font-bold text-gray-50 text-center rounded-[10%] uppercase border bg-red-500 border-red-500'>
                      T
                    </div>
                    <p className='text-xs text-left flex-1'>
                      Se a letra ficar <strong>vermelha</strong>, significa que você acertou a letra
                      na posição exata e ela deverá ser repetida nas próximas tentativas na mesma
                      posição.
                    </p>
                  </div>
                </div>
                <p className='text-xs my-5 mb-2'>
                  Se você descobrir a palavra do dia, você perde o jogo. Se conseguir passar pelas 5
                  tentativas sem descobrir a palavra do dia, você ganha.
                </p>
                <p className='mt-5 text-center text-lg font-extrabold'>BOM JOGO! 😉</p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
