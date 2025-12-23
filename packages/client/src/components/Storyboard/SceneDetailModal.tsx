import React, { useState, useEffect } from 'react';
import { Scene } from '../../types';
import { X, Save, Trash2, Clock, MessageSquare, Image, Sparkles } from 'lucide-react';

interface SceneDetailModalProps {
  scene: Scene;
  onClose: () => void;
  onUpdate: (scene: Scene) => void;
  onDelete: () => void;
}

export function SceneDetailModal({
  scene,
  onClose,
  onUpdate,
  onDelete,
}: SceneDetailModalProps) {
  const [editedScene, setEditedScene] = useState<Scene>(scene);

  useEffect(() => {
    setEditedScene(scene);
  }, [scene]);

  const handleSave = () => {
    onUpdate(editedScene);
    onClose();
  };

  const handleChange = (field: keyof Scene, value: any) => {
    setEditedScene(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">编辑镜头</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              镜头标题
            </label>
            <input
              type="text"
              value={editedScene.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Clock size={14} />
              时长（秒）
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={editedScene.duration}
              onChange={(e) => handleChange('duration', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Image size={14} />
              场景描述
            </label>
            <textarea
              value={editedScene.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none"
              placeholder="描述这个镜头的画面..."
            />
          </div>

          {/* Dialogue */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <MessageSquare size={14} />
              对白
            </label>
            <textarea
              value={editedScene.dialogue}
              onChange={(e) => handleChange('dialogue', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none"
              placeholder="角色的台词..."
            />
          </div>

          {/* Visual Prompt */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Sparkles size={14} />
              视觉提示词
            </label>
            <textarea
              value={editedScene.visualPrompt}
              onChange={(e) => handleChange('visualPrompt', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none"
              placeholder="用于 AI 生成图片的提示词..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            删除镜头
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
            >
              <Save size={16} />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
