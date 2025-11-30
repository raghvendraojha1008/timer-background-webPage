import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface StopwatchProps {
  fontFamily: string;
  fontSize: number;
  textCopyable: boolean;
  showHours: boolean;
  showMilliseconds: boolean;
  textColor: { r: number; g: number; b: number };
}

export const Stopwatch = ({ fontFamily, fontSize, textCopyable, showHours, showMilliseconds, textColor }: StopwatchProps) => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setMilliseconds((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 10);
    
    let timeStr = "";
    if (showHours || hours > 0) {
      timeStr = `${hours.toString().padStart(2, "0")}:`;
    }
    timeStr += `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    if (showMilliseconds) {
      timeStr += `.${millis.toString().padStart(2, "0")}`;
    }
    
    return timeStr;
  };

  const getTextStyle = () => {
    const { r, g, b } = textColor || { r: 255, g: 255, b: 255 };
    return {
      fontSize: `${fontSize}px`,
      color: `rgb(${r}, ${g}, ${b})`,
    };
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMilliseconds(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([milliseconds, ...laps]);
    }
  };

  return (
    <div className={`text-center ${!textCopyable ? "select-none" : ""}`}>
      <h1 
        className={`font-bold tracking-tight leading-none mb-4 ${fontFamily}`}
        style={getTextStyle()}
      >
        {formatTime(milliseconds)}
      </h1>
      <div className="space-x-4 mb-6">
        <Button onClick={handleStartStop} size="lg">
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button onClick={handleLap} size="lg" variant="outline" disabled={!isRunning}>
          Lap
        </Button>
        <Button onClick={handleReset} size="lg" variant="destructive">
          Reset
        </Button>
      </div>
      {laps.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-2">
          <h3 className="text-xl font-semibold mb-2">Laps</h3>
          {laps.map((lap, index) => (
            <div key={index} className="text-lg opacity-80">
              Lap {laps.length - index}: {formatTime(lap)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
