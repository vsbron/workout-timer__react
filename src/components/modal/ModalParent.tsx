import { useCallback, useEffect, useState, type ReactNode } from "react";

import { useTimerContext } from "@/context/TimerContext";

import { Content, Overlay, Trigger } from "@/components/modal/ModalChildren";
import { ModalContext } from "@/components/modal/ModalContext";

function Modal({ children }: { children: ReactNode }) {
  // Setting the stat for modal visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { setIsPaused } = useTimerContext();

  // Toggle function that pauses the timer and shows/hides modal
  const toggleModal = useCallback(() => {
    setIsPaused(true);
    setIsOpen((open) => !open);
  }, [setIsPaused]);

  // UseEffect that closes modal on Escape key
  useEffect(() => {
    // Guard clause
    if (!isOpen) return;

    // Create the event listener and add it to document
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleModal();
    };
    document.addEventListener("keydown", handleKey);

    // Cleanup function
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, toggleModal]);

  // Returned JSX
  return (
    <ModalContext.Provider value={{ isOpen, toggleModal }}>
      <div>{children}</div>
    </ModalContext.Provider>
  );
}

// Tieing everything together
Modal.Trigger = Trigger;
Modal.Content = Content;
Modal.Overlay = Overlay;

export default Modal;
