import type { ReactNode } from "react";

import useModal from "@/components/modal/ModalContext";

// Modal window
export function Content({ children }: { children: ReactNode }) {
  // Getting the state from custom hook
  const { isOpen } = useModal();

  // Returned JSX
  return (
    isOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Timer Settings"
        className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto max-w-[32rem] text-stone-950 dark:text-stone-50 bg-stone-50 dark:bg-stone-900 px-[3rem] py-[2rem] rounded-xl z-50 shadow-stone-950/70 shadow-md animate-modal"
      >
        {children}
      </div>
    )
  );
}

// Modal overlay
export function Overlay() {
  // Getting the state from custom hook
  const { isOpen, toggleModal } = useModal();

  // Returned JSX
  return (
    isOpen && (
      <div
        className="fixed z-25 inset-0 bg-indigo-950/85 dark:bg-purple-950/65 animate-overlay"
        onClick={toggleModal}
      ></div>
    )
  );
}

// Modal trigger
export function Trigger({ children }: { children: ReactNode }) {
  // Getting the state from custom hook
  const { toggleModal } = useModal();

  // Returned JSX
  return (
    <div onClick={toggleModal} className="cursor-pointer">
      {children}
    </div>
  );
}
