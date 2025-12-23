import React, { useState } from 'react';
import { X, GripHorizontal, Download } from 'lucide-react';

interface StoryboardHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onClose: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

export function StoryboardHeader({
  title,
  onTitleChange,
  onClose,
  onDragStart,
}: StoryboardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const handleSubmit = () => {
    if (editValue.trim()) {
      onTitleChange(editValue.trim());
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onDragStart}
    >
      <div className="flex items-center gap-3">
        <GripHorizontal size={16} className="text-gray-400" />
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') {
                setEditValue(title);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <h2
            className="text-sm font-semibold text-gray-800 hover:text-violet-600 cursor-text transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: 导出功能
            alert('导出功能即将推出');
          }}
          onMouseDown={(e) => e.stopPropagation()}
          title="导出"
        >
          <Download size={16} />
        </button>
        <button
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          title="关闭"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
