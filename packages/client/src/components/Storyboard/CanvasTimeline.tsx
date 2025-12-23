import React from 'react';
import { Scene, CanvasItem } from '../../types';
import { Plus, Image, Trash2, Clock, Film, Clapperboard } from 'lucide-react';

interface CanvasTimelineProps {
  scenes: Scene[];
  totalDuration: number;
  zoom: number;
  pan: { x: number; y: number };
  scale: number;
  onSceneClick: (scene: Scene) => void;
  onSceneUpdate: (scene: Scene) => void;
  onSceneDelete: (sceneId: string) => void;
  onAddScene: () => void;
  onOpenImagePicker: (sceneId: string) => void;
  canvasItems: CanvasItem[];
}

export function CanvasTimeline({
  scenes,
  totalDuration,
  zoom,
  onSceneClick,
  onSceneDelete,
  onAddScene,
  onOpenImagePicker,
  canvasItems,
}: CanvasTimelineProps) {
  // 时间轴配置
  const HEADER_HEIGHT = 36;
  const RULER_HEIGHT = 28;
  const TRACK_Y = HEADER_HEIGHT + RULER_HEIGHT + 8; // 轨道起始Y位置
  const CARD_HEIGHT = 120;
  const CARD_GAP = 8;

  // 生成刻度
  const generateTicks = () => {
    const ticks: { time: number; major: boolean }[] = [];
    const maxTime = Math.max(totalDuration + 30, 60);

    let majorInterval = 5;
    let minorInterval = 1;

    if (zoom < 40) {
      majorInterval = 10;
      minorInterval = 5;
    } else if (zoom > 120) {
      majorInterval = 2;
      minorInterval = 1;
    }

    for (let t = 0; t <= maxTime; t += minorInterval) {
      ticks.push({ time: t, major: t % majorInterval === 0 });
    }
    return ticks;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取场景图片
  const getSceneImage = (scene: Scene): string | undefined => {
    if (scene.imageSource === 'generated' && scene.generatedImageSrc) {
      return scene.generatedImageSrc;
    }
    if (scene.imageSource === 'canvas' && scene.canvasItemId) {
      const item = canvasItems.find(i => i.id === scene.canvasItemId);
      return item?.src;
    }
    return undefined;
  };

  const ticks = generateTicks();
  const timelineWidth = Math.max((totalDuration + 30) * zoom, 800);

  // 时间轴面板总高度
  const PANEL_HEIGHT = TRACK_Y + CARD_HEIGHT + 30;
  // 时间轴放置在画布原点上方
  const TIMELINE_Y_OFFSET = -PANEL_HEIGHT - 50;

  return (
    <div
      className="absolute"
      style={{
        left: -20,
        top: TIMELINE_Y_OFFSET,
        zIndex: 1000,
      }}
    >
      {/* 时间轴面板背景 */}
      <div
        className="absolute bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 pointer-events-auto"
        style={{
          left: -10,
          top: -10,
          width: timelineWidth + 40,
          height: PANEL_HEIGHT + 20,
        }}
      />

      {/* 头部信息 */}
      <div
        className="absolute pointer-events-auto flex items-center justify-between px-4"
        style={{
          left: 0,
          top: 0,
          width: Math.min(timelineWidth, 600),
          height: HEADER_HEIGHT,
        }}
      >
        <div className="flex items-center gap-2">
          <Clapperboard size={18} className="text-violet-500" />
          <span className="text-sm font-semibold text-gray-800">分镜时间轴</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Film size={14} />
            {scenes.length} 镜头
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {formatTime(totalDuration)}
          </span>
        </div>
      </div>

      {/* 时间轴标尺 */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: 0,
          top: HEADER_HEIGHT,
          width: timelineWidth,
          height: RULER_HEIGHT,
        }}
      >
        {/* 标尺背景 */}
        <div className="absolute inset-0 bg-violet-50/80 border-y border-violet-200" />

        {/* 刻度 */}
        {ticks.map(({ time, major }) => (
          <div
            key={time}
            className="absolute flex flex-col items-center"
            style={{ left: time * zoom, top: 0 }}
          >
            <div className={`w-px ${major ? 'h-4 bg-violet-400' : 'h-2 bg-violet-300'}`} />
            {major && (
              <span className="text-[10px] text-violet-600 mt-0.5 select-none font-medium">
                {formatTime(time)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 分镜轨道 */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: 0,
          top: TRACK_Y,
          width: timelineWidth,
        }}
      >
        {/* 轨道背景线 */}
        <div
          className="absolute h-px bg-gray-200"
          style={{
            left: 0,
            top: CARD_HEIGHT / 2,
            width: timelineWidth,
          }}
        />

        {/* 分镜卡片 */}
        {scenes.map((scene) => {
          const imageSrc = getSceneImage(scene);
          const cardWidth = Math.max(scene.duration * zoom - CARD_GAP, 80);

          return (
            <div
              key={scene.id}
              className="absolute bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden cursor-pointer hover:shadow-lg hover:border-violet-300 transition-all group"
              style={{
                left: scene.startTime * zoom,
                top: 0,
                width: cardWidth,
                height: CARD_HEIGHT,
              }}
              onClick={() => onSceneClick(scene)}
            >
              {/* 图片预览 */}
              <div className="h-[60px] bg-gray-100 relative overflow-hidden">
                {imageSrc ? (
                  <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={20} className="text-gray-300" />
                  </div>
                )}

                {/* 悬停操作 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenImagePicker(scene.id); }}
                    className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-violet-600"
                    title="选择图片"
                  >
                    <Image size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSceneDelete(scene.id); }}
                    className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500"
                    title="删除"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* 信息 */}
              <div className="p-2">
                <h4 className="text-[11px] font-medium text-gray-800 truncate">
                  {scene.title}
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">{scene.duration}s</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 添加按钮 */}
        <button
          onClick={onAddScene}
          className="absolute bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-violet-400 hover:bg-violet-50 transition-colors"
          style={{
            left: totalDuration * zoom + CARD_GAP,
            top: 0,
            width: 80,
            height: CARD_HEIGHT,
          }}
        >
          <Plus size={20} className="text-gray-400" />
          <span className="text-[10px] text-gray-400 mt-1">添加</span>
        </button>
      </div>
    </div>
  );
}
