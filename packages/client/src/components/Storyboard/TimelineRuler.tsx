import React from 'react';

interface TimelineRulerProps {
  totalDuration: number;
  zoom: number;
}

export function TimelineRuler({ totalDuration, zoom }: TimelineRulerProps) {
  // 生成刻度
  const ticks: { time: number; major: boolean }[] = [];

  // 根据缩放级别决定刻度间隔
  let majorInterval = 5; // 主刻度间隔（秒）
  let minorInterval = 1; // 次刻度间隔（秒）

  if (zoom < 40) {
    majorInterval = 10;
    minorInterval = 5;
  } else if (zoom > 120) {
    majorInterval = 2;
    minorInterval = 1;
  }

  for (let t = 0; t <= totalDuration; t += minorInterval) {
    ticks.push({
      time: t,
      major: t % majorInterval === 0,
    });
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-6 bg-white border-b border-gray-200 relative select-none">
      {ticks.map(({ time, major }) => (
        <div
          key={time}
          className="absolute top-0 flex flex-col items-center"
          style={{ left: time * zoom }}
        >
          <div
            className={`w-px ${major ? 'h-3 bg-gray-400' : 'h-2 bg-gray-300'}`}
          />
          {major && (
            <span className="text-[10px] text-gray-500 mt-0.5">
              {formatTime(time)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
