import {
  GET_READY_TIME,
  INITIAL_BREAK,
  INITIAL_EXERCISE,
  INITIAL_PAUSED,
  INITIAL_ROUNDS,
  INITIAL_STATE,
  STARTING_ROUND,
  STARTING_TIME,
} from "@/lib/constants";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import Start from "@/assets/sounds/start.mp3";
import Pause from "@/assets/sounds/pause.mp3";
import Stop from "@/assets/sounds/beep.mp3";

// Types of available phases
type phases = "Idle" | "Exercise" | "Break" | "Get Ready";

interface ITimerRuntime {
  currentPhase: phases;
  currentTime: number;
  currentRound: number;
  isPaused: boolean;
  setCurrentPhase: Dispatch<SetStateAction<phases>>;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setCurrentRound: Dispatch<SetStateAction<number>>;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

interface ITimerSettings {
  exerciseLength: number;
  breakLength: number;
  roundsNum: number;
  setExerciseLength: Dispatch<SetStateAction<number>>;
  setBreakLength: Dispatch<SetStateAction<number>>;
  setRoundsNum: Dispatch<SetStateAction<number>>;
}

// Create Context with undefined
const TimerRuntimeContext = createContext<ITimerRuntime | undefined>(undefined);
const TimerSettingsContext = createContext<ITimerSettings | undefined>(
  undefined,
);

// TimerProvider component that will wrap the timer & controls
export const TimerProvider = ({ children }: { children: ReactNode }) => {
  // Setting the states for the timer
  const [exerciseLength, setExerciseLength] =
    useState<number>(INITIAL_EXERCISE);
  const [breakLength, setBreakLength] = useState<number>(INITIAL_BREAK);
  const [roundsNum, setRoundsNum] = useState<number>(INITIAL_ROUNDS);
  const [currentPhase, setCurrentPhase] = useState<phases>(INITIAL_STATE);
  const [currentTime, setCurrentTime] = useState<number>(STARTING_TIME);
  const [currentRound, setCurrentRound] = useState<number>(STARTING_ROUND);
  const [isPaused, setIsPaused] = useState<boolean>(INITIAL_PAUSED);

  // Getting references to the audio files
  const pauseRef = useRef(new Audio(Pause));
  const startRef = useRef(new Audio(Start));
  const stopRef = useRef(new Audio(Stop));

  // Creating a ref for the interval
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // UseEffect that handles the countdown
  useEffect(() => {
    // If we have not reach zero and not paused, reduce current time by second every second
    if (!isPaused && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((time) => time - 1);
      }, 1000);
    }

    // If we hit 0 and not on pause
    if (currentTime === 0 && !isPaused) {
      // Timer reached zero, switch phase
      clearInterval(intervalRef.current!);

      // If we're on break when timer reaches zero
      if (currentPhase === "Break" || currentPhase === "Get Ready") {
        // Change the phase, reinitialize current time
        setCurrentPhase("Exercise");
        setCurrentTime(exerciseLength);
        startRef.current.currentTime = 0.1;
        startRef.current.play();
      }

      // If we're on Exercise and not on last round
      else if (currentPhase === "Exercise" && currentRound < roundsNum) {
        // Advance the round, change to Break, reinitialize current time with break length
        setCurrentRound((r) => r + 1);
        setCurrentPhase("Break");
        setCurrentTime(breakLength);
        pauseRef.current.currentTime = 0.1;
        pauseRef.current.play();
      } else {
        // Otherwise stop the timer
        stopTimer();
      }
    }

    // Cleanup function that clears the interval on each re-render
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isPaused,
    currentTime,
    currentPhase,
    currentRound,
    roundsNum,
    exerciseLength,
    breakLength,
  ]);

  const startTimer = () => {
    if (currentPhase === "Idle") {
      setCurrentPhase("Get Ready");
      setCurrentTime(GET_READY_TIME);
    }
    setIsPaused(false);
    startRef.current.currentTime = 0;
    startRef.current.play();
  };

  // Stop timer function that gets it to zero, but keeps the current lengths
  const stopTimer = () => {
    setIsPaused(INITIAL_PAUSED);
    setCurrentTime(STARTING_TIME);
    setCurrentRound(STARTING_ROUND);
    setCurrentPhase("Idle");
    stopRef.current.currentTime = 0;
    stopRef.current.play();
  };

  // Reset timer function that initiates all the times/rounds
  const resetTimer = () => {
    setExerciseLength(INITIAL_EXERCISE);
    setBreakLength(INITIAL_BREAK);
    setRoundsNum(INITIAL_ROUNDS);
    setCurrentPhase(INITIAL_STATE);
    setCurrentTime(STARTING_TIME);
    setCurrentRound(STARTING_ROUND);
    setIsPaused(INITIAL_PAUSED);
  };

  // Returned JSX
  return (
    <TimerSettingsContext.Provider
      value={{
        exerciseLength,
        breakLength,
        roundsNum,
        setExerciseLength,
        setBreakLength,
        setRoundsNum,
      }}
    >
      <TimerRuntimeContext.Provider
        value={{
          currentPhase,
          currentTime,
          currentRound,
          isPaused,
          setCurrentPhase,
          setCurrentTime,
          setCurrentRound,
          setIsPaused,
          startTimer,
          stopTimer,
          resetTimer,
        }}
      >
        {children}
      </TimerRuntimeContext.Provider>
    </TimerSettingsContext.Provider>
  );
};

// Custom hook to use the Context API
export const useTimerContext = () => {
  // Getting the data from the context
  const context1 = useContext(TimerSettingsContext);
  const context2 = useContext(TimerRuntimeContext);

  // Error if tried to use outside of Context scope
  if (!context1 || !context2) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }

  // Getting the values out of contexts
  const {
    exerciseLength,
    breakLength,
    roundsNum,
    setExerciseLength,
    setBreakLength,
    setRoundsNum,
  } = context1;
  const {
    currentPhase,
    currentTime,
    currentRound,
    isPaused,
    setCurrentPhase,
    setCurrentTime,
    setCurrentRound,
    setIsPaused,
    startTimer,
    stopTimer,
    resetTimer,
  } = context2;

  // Return the values
  return {
    exerciseLength,
    breakLength,
    roundsNum,
    currentPhase,
    currentTime,
    currentRound,
    isPaused,
    setExerciseLength,
    setBreakLength,
    setRoundsNum,
    setCurrentPhase,
    setCurrentTime,
    setCurrentRound,
    setIsPaused,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
