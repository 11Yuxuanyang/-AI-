import React from 'react';
import { Scene } from '../../types';
import { Image, Trash2, Clock, Sparkles } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  imageSrc?: string;
  onClick: () => void;
  onDelete: () => void;
  onOpenImagePicker: () => void;
}

export function SceneCard({
  scene,
  imageSrc,
  onClick,
  onDelete,
  onOpenImagePicker,
}: SceneCardProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-500',
    generating: 'bg-yellow-100 text-yellow-600',
    ready: 'bg-green-100 text-green-600',
    error: 'bg-red-100 text-red-600',
  };

  const statusLabels = {
    draft: '草稿',
    generating: '生成中',
    ready: '就绪',
    error: '失败',
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Preview */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={scene.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image size={24} className="text-gray-300" />
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[scene.status]}`}
        >
          {statusLabels[scene.status]}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenImagePicker();
            }}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-violet-50 text-gray-600 hover:text-violet-600 transition-colors"
            title="选择图片"
          >
            <Image size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 生成图片
              alert('图片生成功能即将推出');
            }}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-violet-50 text-gray-600 hover:text-violet-600 transition-colors"
            title="生成图片"
          >
            <Sparkles size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"
            title="删除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <h4 className="text-xs font-medium text-gray-800 truncate">
          {scene.title}
        </h4>
        {scene.description && (
          <p className="text-[10px] text-gray-500 truncate mt-0.5">
            {scene.description}
          </p>
        )}
        <div className="flex items-center gap-1 mt-1">
          <Clock size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-400">{scene.duration}s</span>
        </div>
      </div>
    </div>
  );
}
