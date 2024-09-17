'use client';

// Enables client-side rendering for this component
import { useState, useRef, useEffect, ChangeEvent } from 'react'; // Import React hooks and types
import { Button } from '@/components/ui/button';
import { Heading2 } from '@/components/ui/Heading';
import { Input } from '@/components/ui/input';

export default function Countdown() {
  // State to manage the minutes and seconds inputs
  const [minutes, setMinutes] = useState<number | string>(''); // For minutes input
  const [seconds, setSeconds] = useState<number | string>(''); // For seconds input
  // State to manage the countdown timer value
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // State to track if the timer is active
  const [isActive, setIsActive] = useState<boolean>(false);
  // State to track if the timer is paused
  const [isPaused, setIsPaused] = useState<boolean>(false);
  // Reference to store the timer ID
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const originalTime = useRef<number>(0);

  // Function to convert seconds to minutes and seconds
  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    setMinutes(min); // Update the minutes
    setSeconds(sec); // Update the seconds
  };

  // Function to handle starting the countdown timer
  const startCountdown = (): void => {
    const min = Number(minutes);
    const sec = Number(seconds);
    if ((min >= 0 || sec >= 0) && (min || sec)) {
      const totalSeconds = min * 60 + sec;
      if (!originalTime.current) {
        originalTime.current = totalSeconds; // Store the original time
      }

      setTimeLeft(totalSeconds); // Set the countdown timer
      setIsActive(true); // Set the timer as active
      setIsPaused(false); // Ensure the timer is not paused
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Start the countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current!);
            formatTime(0);
            return 0;
          }
          const newTime = prevTime - 1;
          formatTime(newTime);

          return newTime;
        });
      }, 1000); // Interval of 1 second
    }
  };

  // Function to pause or start the countdown timer
  const handlePause = (): void => {
    if (isActive) {
      if (isPaused) {
        // If the timer is paused, resume it
        setIsPaused(false); // Set the timer as not paused
        startCountdown(); // Restart the countdown
      } else {
        // If the timer is active, pause it
        setIsPaused(true); // Set the timer as paused
        setIsActive(false); // Set the timer as inactive
        // Clear any existing timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    } else {
      // If the timer is not active, start it
      startCountdown();
    }
  };

  // Function to reset the countdown timer
  const handleReset = (): void => {
    setIsActive(false); // Set the timer as inactive
    setIsPaused(false); // Set the timer as not paused
    setTimeLeft(originalTime.current); // Reset the timer to the original duration
    const min = Math.floor(originalTime.current / 60);
    const sec = originalTime.current % 60;
    setMinutes(min); // Update the minutes
    setSeconds(sec); // Update the seconds
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // useEffect hook to manage the countdown interval
  useEffect(() => {
    // Cleanup function to clear the interval
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [timeLeft, isActive]); // timeLeft가 변경될 때마다 실행됩니다.

  // Function to handle changes in the minutes input field
  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (value >= 0) {
      // Allow only non-negative values
      setMinutes(e.target.value); // Update the minutes state
    }
  };

  // Function to handle changes in the seconds input field
  const handleSecondsChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (value >= 0) {
      // Allow only non-negative values
      setSeconds(e.target.value); // Update the seconds state
    }
  };

  // JSX return statement rendering the Countdown UI
  return (
    // Container div for centering the content
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      {/* Timer box container */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Title of the countdown timer */}
        <Heading2 className="text-center">Countdown Timer</Heading2>
        {/* Input fields for minutes and seconds */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <Input
            type="number"
            id="minutes"
            placeholder="Minutes"
            value={minutes}
            onChange={handleMinutesChange}
            className="w-1/4 text-right"
          />
          <Input
            type="number"
            id="seconds"
            placeholder="Seconds"
            value={seconds}
            onChange={handleSecondsChange}
            className="w-1/4 text-right"
          />
        </div>
        {/* Buttons to pause and reset the timer */}
        <div className="flex justify-center gap-4">
          <Button onClick={handlePause} variant="primary-outline">
            {isPaused || !isActive ? 'Start' : 'Pause'}
          </Button>
          <Button onClick={handleReset} variant="primary-outline">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
