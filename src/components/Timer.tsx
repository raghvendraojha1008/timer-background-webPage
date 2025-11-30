import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimerProps {
  fontFamily: string;
  fontSize: number;
  textCopyable: boolean;
  timerSound: boolean;
  showHours: boolean;
  textColor: { r: number; g: number; b: number };
}

export const Timer = ({ fontFamily, fontSize, textCopyable, timerSound, showHours, textColor }: TimerProps) => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const playAlarm = () => {
    if (!timerSound) return;
    
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 1);
  };

  const startTimer = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total > 0) {
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    
    if (!showHours && h === 0) {
      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getTextStyle = () => {
    const { r, g, b } = textColor || { r: 255, g: 255, b: 255 };
    return {
      fontSize: `${fontSize}px`,
      color: `rgb(${r}, ${g}, ${b})`,
    };
  };

  return (
    <div className={`text-center ${!textCopyable ? "select-none" : ""}`}>
      {!isRunning && remainingSeconds === 0 ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Set Timer</h2>
          <div className="flex gap-4 justify-center">
            {showHours && (
              <div>
                <label className="block text-sm mb-2">Hours</label>
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
                  className="w-20 text-center"
                />
              </div>
            )}
            <div>
              <label className="block text-sm mb-2">Minutes</label>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-20 text-center"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Seconds</label>
              <Input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="w-20 text-center"
              />
            </div>
          </div>
          <Button onClick={startTimer} size="lg">Start Timer</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 
            className={`font-bold tracking-tight leading-none ${fontFamily}`}
            style={getTextStyle()}
          >
            {formatTime(remainingSeconds)}
          </h1>
          <div className="space-x-4">
            {isRunning ? (
              <Button onClick={stopTimer} size="lg" variant="destructive">Stop</Button>
            ) : (
              <Button onClick={() => setIsRunning(true)} size="lg">Resume</Button>
            )}
            <Button onClick={resetTimer} size="lg" variant="outline">Reset</Button>
          </div>
        </div>
      )}
    </div>
  );
};
