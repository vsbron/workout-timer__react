import { useRef } from "react";
import { PauseIcon, PlayIcon, StopIcon } from "@heroicons/react/16/solid";

import { useTimerContext } from "@/context/TimerContext";

import Button from "@/ui/Button";
import Container from "@/ui/Container";

import Pause from "@/assets/sounds/pause.mp3";

function Playback() {
  // Getting the functions function from the Context API
  const { setIsPaused, stopTimer, startTimer } = useTimerContext();

  // Getting references to the pause audio file
  const pauseRef = useRef<HTMLAudioElement | null>(null);
  if (!pauseRef.current) pauseRef.current = new Audio(Pause);

  // Click handlers for pause button
  const pauseButtonHandler = () => {
    setIsPaused(true);
    pauseRef.current!.currentTime = 0.1;
    pauseRef.current!.play();
  };

  // Returned JSX
  return (
    <section>
      <Container>
        <div className="flex justify-center gap-8 sm:gap-10">
          <Button size="big" onClick={startTimer} ariaLabel="Start timer">
            <PlayIcon className="fill-inherit w-12 sm:w-15 h-12 sm:h-15" />
          </Button>
          <Button
            size="big"
            onClick={pauseButtonHandler}
            ariaLabel="Pause Timer"
          >
            <PauseIcon className="fill-inherit w-12 sm:w-15 h-12 sm:h-15" />
          </Button>
          <Button size="big" onClick={stopTimer} ariaLabel="Stop Timer">
            <StopIcon className="fill-inherit w-12 sm:w-15 h-12 sm:h-15" />
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Playback;
