import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Clock, Timer as TimerIcon, CircleDot } from "lucide-react";
import { Settings, SettingsType } from "@/components/Settings";
import { Timer } from "@/components/Timer";
import { Stopwatch } from "@/components/Stopwatch";

const gradients = [
  "var(--gradient-ocean)",
  "var(--gradient-sunset)",
  "var(--gradient-forest)",
  "var(--gradient-lavender)",
  "var(--gradient-fire)",
  "var(--gradient-mint)",
  "var(--gradient-coral)",
  "var(--gradient-sky)",
];

type View = "clock" | "timer" | "stopwatch" | "settings";

const DEFAULT_SETTINGS: SettingsType = {
  bgChangeInterval: 30000,
  bgColor: { r: 20, g: 20, b: 40 },
  fontFamily: "font-mono",
  fontSize: 96,
  textCopyable: false,
  textColor: { r: 255, g: 255, b: 255 },
  clockFormat: "24",
  showSeconds: true,
  showDate: true,
  timerSound: true,
  timerShowHours: true,
  stopwatchShowHours: true,
  stopwatchShowMilliseconds: true,
};

const Index = () => {
  const [time, setTime] = useState(new Date());
  const [gradientIndex, setGradientIndex] = useState(0);
  const [view, setView] = useState<View>("clock");
  const [settings, setSettings] = useState<SettingsType>(() => {
    const saved = localStorage.getItem("clockSettings");
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      // Merge with defaults to ensure all new properties exist
      return { ...DEFAULT_SETTINGS, ...parsedSettings };
    }
    return DEFAULT_SETTINGS;
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("clockSettings", JSON.stringify(settings));
  }, [settings]);

  // Change gradient based on settings
  useEffect(() => {
    if (settings.bgChangeInterval === 0) return;
    
    const gradientTimer = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, settings.bgChangeInterval);

    return () => clearInterval(gradientTimer);
  }, [settings.bgChangeInterval]);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    
    let period = "";
    if (settings.clockFormat === "12") {
      period = hours >= 12 ? " PM" : " AM";
      hours = hours % 12 || 12;
    }
    
    const hoursStr = hours.toString().padStart(2, "0");
    const timeStr = settings.showSeconds 
      ? `${hoursStr}:${minutes}:${seconds}` 
      : `${hoursStr}:${minutes}`;
    
    return timeStr + period;
  };

  const getTextStyle = () => {
    const { r, g, b } = settings.textColor || { r: 255, g: 255, b: 255 };
    return {
      fontSize: `${settings.fontSize}px`,
      color: `rgb(${r}, ${g}, ${b})`,
    };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getBackgroundStyle = () => {
    if (settings.bgChangeInterval === 0) {
      const { r, g, b } = settings.bgColor || { r: 20, g: 20, b: 40 };
      return `rgb(${r}, ${g}, ${b})`;
    }
    return gradients[gradientIndex];
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center transition-all duration-[2000ms] ease-in-out relative"
      style={{ background: getBackgroundStyle() }}
    >
      {/* Navigation */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Button
          variant={view === "clock" ? "default" : "outline"}
          size="icon"
          onClick={() => setView("clock")}
          className="bg-white/10 hover:bg-white/20 border-white/20"
        >
          <Clock className="h-5 w-5" />
        </Button>
        <Button
          variant={view === "timer" ? "default" : "outline"}
          size="icon"
          onClick={() => setView("timer")}
          className="bg-white/10 hover:bg-white/20 border-white/20"
        >
          <TimerIcon className="h-5 w-5" />
        </Button>
        <Button
          variant={view === "stopwatch" ? "default" : "outline"}
          size="icon"
          onClick={() => setView("stopwatch")}
          className="bg-white/10 hover:bg-white/20 border-white/20"
        >
          <CircleDot className="h-5 w-5" />
        </Button>
      </div>

      <Button
        variant={view === "settings" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("settings")}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 border-white/20"
      >
        <SettingsIcon className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <div className="text-foreground animate-fade-in w-full max-w-4xl px-4">
        {view === "clock" && (
          <div className={`text-center ${!settings.textCopyable ? "select-none" : ""}`}>
            <h1 
              className={`font-bold tracking-tight leading-none mb-4 drop-shadow-2xl ${settings.fontFamily}`}
              style={getTextStyle()}
            >
              {formatTime(time)}
            </h1>
            {settings.showDate && (
              <p 
                className="font-light tracking-wide opacity-90 drop-shadow-lg"
                style={{ 
                  fontSize: `${settings.fontSize * 0.25}px`, 
                  color: `rgb(${(settings.textColor || { r: 255, g: 255, b: 255 }).r}, ${(settings.textColor || { r: 255, g: 255, b: 255 }).g}, ${(settings.textColor || { r: 255, g: 255, b: 255 }).b})` 
                }}
              >
                {formatDate(time)}
              </p>
            )}
          </div>
        )}
        {view === "timer" && (
          <Timer 
            fontFamily={settings.fontFamily} 
            fontSize={settings.fontSize}
            textCopyable={settings.textCopyable} 
            timerSound={settings.timerSound}
            showHours={settings.timerShowHours}
            textColor={settings.textColor || { r: 255, g: 255, b: 255 }}
          />
        )}
        {view === "stopwatch" && (
          <Stopwatch 
            fontFamily={settings.fontFamily}
            fontSize={settings.fontSize}
            textCopyable={settings.textCopyable}
            showHours={settings.stopwatchShowHours}
            showMilliseconds={settings.stopwatchShowMilliseconds}
            textColor={settings.textColor || { r: 255, g: 255, b: 255 }}
          />
        )}
        {view === "settings" && <Settings settings={settings} onSettingsChange={setSettings} />}
      </div>
    </div>
  );
};

export default Index;
