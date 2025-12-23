import React, { useState, useCallback } from 'react';
import { Scene, CanvasItem } from '../../types';
import { SceneCard } from './SceneCard';
import { Plus } from 'lucide-react';

interface TimelineTrackProps {
  scenes: Scene[];
  zoom: number;
  onSceneClick: (scene: Scene) => void;
  onSceneUpdate: (scene: Scene) => void;
  onSceneDelete: (sceneId: string) => void;
  onScenesReorder: (scenes: Scene[]) => void;
  onAddScene: () => void;
  onOpenImagePicker: (sceneId: string) => void;
  canvasItems: CanvasItem[];
}

export function TimelineTrack({
  scenes,
  zoom,
  onSceneClick,
  onSceneUpdate,
  onSceneDelete,
  onScenesReorder,
  onAddScene,
  onOpenImagePicker,
  canvasItems,
}: TimelineTrackProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // 拖拽开始
  const handleDragStart = useCallback((e: React.DragEvent, sceneId: string) => {
    setDraggedId(sceneId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sceneId);
  }, []);

  // 拖拽结束
  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  // 拖拽经过
  const handleDragOver = useCallback((e: React.DragEvent, sceneId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (sceneId !== draggedId) {
      setDragOverId(sceneId);
    }
  }, [draggedId]);

  // 放下
  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');

    if (sourceId && sourceId !== targetId) {
      const sourceIndex = scenes.findIndex(s => s.id === sourceId);
      const targetIndex = scenes.findIndex(s => s.id === targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newScenes = [...scenes];
        const [removed] = newScenes.splice(sourceIndex, 1);
        newScenes.splice(targetIndex, 0, removed);
        onScenesReorder(newScenes);
      }
    }

    setDraggedId(null);
    setDragOverId(null);
  }, [scenes, onScenesReorder]);

  // 获取场景图片
  const getSceneImage = useCallback((scene: Scene): string | undefined => {
    if (scene.imageSource === 'generated' && scene.generatedImageSrc) {
      return scene.generatedImageSrc;
    }
    if (scene.imageSource === 'canvas' && scene.canvasItemId) {
      const item = canvasItems.find(i => i.id === scene.canvasItemId);
      return item?.src;
    }
    return undefined;
  }, [canvasItems]);

  // 卡片宽度 = 时长 * 缩放，但有最小宽度
  const getCardWidth = (duration: number) => Math.max(duration * zoom, 100);

  return (
    <div className="flex items-start gap-2 min-h-[140px]">
      {scenes.map((scene) => (
        <div
          key={scene.id}
          draggable
          onDragStart={(e) => handleDragStart(e, scene.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, scene.id)}
          onDrop={(e) => handleDrop(e, scene.id)}
          className={`flex-shrink-0 transition-all duration-150 ${
            draggedId === scene.id ? 'opacity-50' : ''
          } ${
            dragOverId === scene.id ? 'transform scale-105' : ''
          }`}
          style={{
            width: getCardWidth(scene.duration),
          }}
        >
          <SceneCard
            scene={scene}
            imageSrc={getSceneImage(scene)}
            onClick={() => onSceneClick(scene)}
            onDelete={() => onSceneDelete(scene.id)}
            onOpenImagePicker={() => onOpenImagePicker(scene.id)}
          />
        </div>
      ))}

      {/* Add Scene Button */}
      <button
        onClick={onAddScene}
        className="flex-shrink-0 w-[100px] h-[130px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-400 hover:bg-violet-50 transition-colors group"
      >
        <Plus size={24} className="text-gray-400 group-hover:text-violet-500 transition-colors" />
        <span className="text-xs text-gray-400 group-hover:text-violet-500 mt-1 transition-colors">
          添加镜头
        </span>
      </button>
    </div>
  );
}
