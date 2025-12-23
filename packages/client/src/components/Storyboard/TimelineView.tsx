import React, { useRef } from 'react';
import { Scene, CanvasItem } from '../../types';
import { TimelineRuler } from './TimelineRuler';
import { TimelineTrack } from './TimelineTrack';
import { TimelineControls } from './TimelineControls';

interface TimelineViewProps {
  scenes: Scene[];
  totalDuration: number;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSceneClick: (scene: Scene) => void;
  onSceneUpdate: (scene: Scene) => void;
  onSceneDelete: (sceneId: string) => void;
  onScenesReorder: (scenes: Scene[]) => void;
  onAddScene: () => void;
  onOpenImagePicker: (sceneId: string) => void;
  canvasItems: CanvasItem[];
}

export function TimelineView({
  scenes,
  totalDuration,
  zoom,
  onZoomChange,
  onSceneClick,
  onSceneUpdate,
  onSceneDelete,
  onScenesReorder,
  onAddScene,
  onOpenImagePicker,
  canvasItems,
}: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // 时间轴宽度 = 总时长 * 缩放 + 一些额外空间
  const timelineWidth = Math.max((totalDuration + 10) * zoom, 600);

  // 处理滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      const newZoom = Math.max(20, Math.min(200, zoom + delta));
      onZoomChange(newZoom);
    }
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Timeline Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">时间轴</span>
          <span className="text-xs text-gray-400">
            {scenes.length} 个镜头 · 总时长 {formatTime(totalDuration)}
          </span>
        </div>
        <TimelineControls
          zoom={zoom}
          onZoomChange={onZoomChange}
        />
      </div>

      {/* Timeline Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden"
        onWheel={handleWheel}
      >
        <div style={{ width: timelineWidth, minHeight: '100%' }}>
          {/* Ruler */}
          <TimelineRuler
            totalDuration={totalDuration + 10}
            zoom={zoom}
          />

          {/* Track */}
          <div ref={trackRef} className="relative px-4 py-4">
            <TimelineTrack
              scenes={scenes}
              zoom={zoom}
              onSceneClick={onSceneClick}
              onSceneUpdate={onSceneUpdate}
              onSceneDelete={onSceneDelete}
              onScenesReorder={onScenesReorder}
              onAddScene={onAddScene}
              onOpenImagePicker={onOpenImagePicker}
              canvasItems={canvasItems}
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {scenes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">暂无分镜</p>
            <p className="text-xs text-gray-300">输入剧本并点击"AI 智能解析"生成分镜</p>
          </div>
        </div>
      )}
    </div>
  );
}
