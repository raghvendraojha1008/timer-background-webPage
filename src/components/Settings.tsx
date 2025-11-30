import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface SettingsType {
  // General
  bgChangeInterval: number;
  bgColor: { r: number; g: number; b: number };
  fontFamily: string;
  fontSize: number;
  textCopyable: boolean;
  textColor: { r: number; g: number; b: number };
  
  // Clock
  clockFormat: "12" | "24";
  showSeconds: boolean;
  showDate: boolean;
  
  // Timer
  timerSound: boolean;
  timerShowHours: boolean;
  
  // Stopwatch
  stopwatchShowHours: boolean;
  stopwatchShowMilliseconds: boolean;
}

const FONT_OPTIONS = [
  { value: "font-mono", label: "Monospace" },
  { value: "font-sans", label: "Sans Serif" },
  { value: "font-serif", label: "Serif" },
  { value: "font-orbitron", label: "Orbitron" },
  { value: "font-rajdhani", label: "Rajdhani" },
  { value: "font-space-mono", label: "Space Mono" },
  { value: "font-roboto-mono", label: "Roboto Mono" },
  { value: "font-bebas", label: "Bebas Neue" },
  { value: "font-audiowide", label: "Audiowide" },
];

const BG_INTERVAL_OPTIONS = [
  { value: 0, label: "No Change" },
  { value: 10000, label: "10 seconds" },
  { value: 30000, label: "30 seconds" },
  { value: 60000, label: "1 minute" },
  { value: 300000, label: "5 minutes" },
  { value: -1, label: "Custom" },
];

interface SettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
}

export const Settings = ({ settings, onSettingsChange }: SettingsProps) => {
  const [customInterval, setCustomInterval] = useState<number>(30);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [colorPickerMode, setColorPickerMode] = useState<"simple" | "advanced">("simple");
  const [bgColorPickerMode, setBgColorPickerMode] = useState<"simple" | "advanced">("simple");

  const updateSetting = <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleIntervalChange = (value: string) => {
    const numValue = Number(value);
    if (numValue === -1) {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      updateSetting("bgChangeInterval", numValue);
    }
  };

  const handleCustomIntervalApply = () => {
    updateSetting("bgChangeInterval", customInterval * 1000);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const handleColorChange = (hex: string) => {
    const rgb = hexToRgb(hex);
    updateSetting("textColor", rgb);
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    updateSetting("textColor", { ...settings.textColor, [channel]: value });
  };

  const handleBgColorChange = (hex: string) => {
    const rgb = hexToRgb(hex);
    updateSetting("bgColor", rgb);
  };

  const handleBgRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    updateSetting("bgColor", { ...settings.bgColor, [channel]: value });
  };

  return (
    <div className={`space-y-6 p-6 max-w-2xl mx-auto ${!settings.textCopyable ? "select-none" : ""}`}>
      <h2 className="text-3xl font-bold mb-6">Advanced Settings</h2>
      
      {/* General Settings */}
      <div className="space-y-4 border-b border-white/20 pb-6">
        <h3 className="text-xl font-semibold">General</h3>
        
        <div className="space-y-2">
          <Label htmlFor="bg-interval">Background Change Interval</Label>
          <Select
            value={showCustomInput ? "-1" : settings.bgChangeInterval.toString()}
            onValueChange={handleIntervalChange}
          >
            <SelectTrigger id="bg-interval" className="text-primary">
              <SelectValue placeholder="30 seconds" />
            </SelectTrigger>
            <SelectContent>
              {BG_INTERVAL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showCustomInput && (
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                min="1"
                value={customInterval}
                onChange={(e) => setCustomInterval(Number(e.target.value))}
                placeholder="Seconds"
                className="flex-1"
              />
              <Button onClick={handleCustomIntervalApply} size="sm">Apply</Button>
            </div>
          )}
        </div>

        {settings.bgChangeInterval === 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bg-color">Background Color</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBgColorPickerMode(bgColorPickerMode === "simple" ? "advanced" : "simple")}
              >
                {bgColorPickerMode === "simple" ? "Advanced" : "Simple"}
              </Button>
            </div>
            
            {bgColorPickerMode === "simple" ? (
              <div className="flex gap-2 items-center">
                <Input
                  id="bg-color"
                  type="color"
                  value={rgbToHex(settings.bgColor.r, settings.bgColor.g, settings.bgColor.b)}
                  onChange={(e) => handleBgColorChange(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <span className="text-sm font-mono">
                  RGB({settings.bgColor.r}, {settings.bgColor.g}, {settings.bgColor.b})
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bg-color-r" className="text-sm">Red</Label>
                    <span className="text-sm font-mono">{settings.bgColor.r}</span>
                  </div>
                  <input
                    id="bg-color-r"
                    type="range"
                    min="0"
                    max="255"
                    value={settings.bgColor.r}
                    onChange={(e) => handleBgRgbChange('r', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bg-color-g" className="text-sm">Green</Label>
                    <span className="text-sm font-mono">{settings.bgColor.g}</span>
                  </div>
                  <input
                    id="bg-color-g"
                    type="range"
                    min="0"
                    max="255"
                    value={settings.bgColor.g}
                    onChange={(e) => handleBgRgbChange('g', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bg-color-b" className="text-sm">Blue</Label>
                    <span className="text-sm font-mono">{settings.bgColor.b}</span>
                  </div>
                  <input
                    id="bg-color-b"
                    type="range"
                    min="0"
                    max="255"
                    value={settings.bgColor.b}
                    onChange={(e) => handleBgRgbChange('b', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div 
                  className="h-12 rounded border border-white/20"
                  style={{ 
                    backgroundColor: `rgb(${settings.bgColor.r}, ${settings.bgColor.g}, ${settings.bgColor.b})` 
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="font-family">Font Family</Label>
          <Select
            value={settings.fontFamily}
            onValueChange={(value) => updateSetting("fontFamily", value)}
          >
            <SelectTrigger id="font-family" className="text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size (px)</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="font-size"
              type="number"
              min="12"
              max="500"
              value={settings.fontSize}
              onChange={(e) => updateSetting("fontSize", Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="500"
            value={settings.fontSize}
            onChange={(e) => updateSetting("fontSize", Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="text-color">Text Color</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColorPickerMode(colorPickerMode === "simple" ? "advanced" : "simple")}
            >
              {colorPickerMode === "simple" ? "Advanced" : "Simple"}
            </Button>
          </div>
          
          {colorPickerMode === "simple" ? (
            <div className="flex gap-2 items-center">
              <Input
                id="text-color"
                type="color"
                value={rgbToHex(settings.textColor.r, settings.textColor.g, settings.textColor.b)}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <span className="text-sm font-mono">
                RGB({settings.textColor.r}, {settings.textColor.g}, {settings.textColor.b})
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="color-r" className="text-sm">Red</Label>
                  <span className="text-sm font-mono">{settings.textColor.r}</span>
                </div>
                <input
                  id="color-r"
                  type="range"
                  min="0"
                  max="255"
                  value={settings.textColor.r}
                  onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="color-g" className="text-sm">Green</Label>
                  <span className="text-sm font-mono">{settings.textColor.g}</span>
                </div>
                <input
                  id="color-g"
                  type="range"
                  min="0"
                  max="255"
                  value={settings.textColor.g}
                  onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="color-b" className="text-sm">Blue</Label>
                  <span className="text-sm font-mono">{settings.textColor.b}</span>
                </div>
                <input
                  id="color-b"
                  type="range"
                  min="0"
                  max="255"
                  value={settings.textColor.b}
                  onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div 
                className="h-12 rounded border border-white/20"
                style={{ 
                  backgroundColor: `rgb(${settings.textColor.r}, ${settings.textColor.g}, ${settings.textColor.b})` 
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="text-copyable">Text Copyable</Label>
          <Switch
            id="text-copyable"
            checked={settings.textCopyable}
            onCheckedChange={(checked) => updateSetting("textCopyable", checked)}
          />
        </div>
      </div>

      {/* Clock Settings */}
      <div className="space-y-4 border-b border-white/20 pb-6">
        <h3 className="text-xl font-semibold">Clock</h3>
        
        <div className="space-y-2">
          <Label htmlFor="clock-format">Time Format</Label>
          <Select
            value={settings.clockFormat}
            onValueChange={(value: "12" | "24") => updateSetting("clockFormat", value)}
          >
          <SelectTrigger id="clock-format" className="text-primary">
            <SelectValue placeholder="24 Hour" />
          </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 Hour</SelectItem>
              <SelectItem value="24">24 Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-seconds">Show Seconds</Label>
          <Switch
            id="show-seconds"
            checked={settings.showSeconds}
            onCheckedChange={(checked) => updateSetting("showSeconds", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-date">Show Date</Label>
          <Switch
            id="show-date"
            checked={settings.showDate}
            onCheckedChange={(checked) => updateSetting("showDate", checked)}
          />
        </div>
      </div>

      {/* Timer Settings */}
      <div className="space-y-4 border-b border-white/20 pb-6">
        <h3 className="text-xl font-semibold">Timer</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="timer-sound">Alarm Sound</Label>
          <Switch
            id="timer-sound"
            checked={settings.timerSound}
            onCheckedChange={(checked) => updateSetting("timerSound", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="timer-hours">Show Hours Field</Label>
          <Switch
            id="timer-hours"
            checked={settings.timerShowHours}
            onCheckedChange={(checked) => updateSetting("timerShowHours", checked)}
          />
        </div>
      </div>

      {/* Stopwatch Settings */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Stopwatch</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="stopwatch-hours">Show Hours</Label>
          <Switch
            id="stopwatch-hours"
            checked={settings.stopwatchShowHours}
            onCheckedChange={(checked) => updateSetting("stopwatchShowHours", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="stopwatch-millis">Show Milliseconds</Label>
          <Switch
            id="stopwatch-millis"
            checked={settings.stopwatchShowMilliseconds}
            onCheckedChange={(checked) => updateSetting("stopwatchShowMilliseconds", checked)}
          />
        </div>
      </div>
    </div>
  );
};
