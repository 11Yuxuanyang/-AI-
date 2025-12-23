import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TimelineControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZOOM_MIN = 20;
const ZOOM_MAX = 200;
const ZOOM_STEP = 20;

export function TimelineControls({ zoom, onZoomChange }: TimelineControlsProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + ZOOM_STEP, ZOOM_MAX));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - ZOOM_STEP, ZOOM_MIN));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleZoomOut}
        disabled={zoom <= ZOOM_MIN}
        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="缩小"
      >
        <ZoomOut size={14} />
      </button>

      <input
        type="range"
        min={ZOOM_MIN}
        max={ZOOM_MAX}
        value={zoom}
        onChange={handleSliderChange}
        className="w-20 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:cursor-pointer"
      />

      <button
        onClick={handleZoomIn}
        disabled={zoom >= ZOOM_MAX}
        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="放大"
      >
        <ZoomIn size={14} />
      </button>

      <span className="text-xs text-gray-400 min-w-[40px] text-right">
        {Math.round(zoom / 80 * 100)}%
      </span>
    </div>
  );
}
