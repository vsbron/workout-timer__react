import { useTimerContext } from "@/context/TimerContext";

import Settings from "@/components/Settings";
import useModal from "@/components/modal/ModalContext";
import Modal from "@/components/modal/ModalParent";
import Button from "@/ui/Button";
import Container from "@/ui/Container";

function Controls() {
  // Getting the reset function from the Context API
  const { resetTimer } = useTimerContext();

  // Getting the modal toggling function from Modal Context
  const { toggleModal, isOpen } = useModal();

  // Returned JSX
  return (
    <section>
      <Container>
        <div className="flex justify-center gap-8 sm:gap-10">
          <Button onClick={resetTimer} ariaLabel="Reset timer">
            Reset
          </Button>
          <Modal.Trigger>
            <Button ariaLabel="Settings">Settings</Button>
          </Modal.Trigger>
          <Modal.Overlay />
          <Modal.Content>
            <Settings
              key={isOpen ? "open" : "closed"}
              settingsClose={toggleModal}
            />
          </Modal.Content>
        </div>
      </Container>
    </section>
  );
}

export default Controls;
