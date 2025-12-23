import React from 'react';
import { CanvasItem } from '../../types';
import { X, Image } from 'lucide-react';

interface ImagePickerProps {
  canvasItems: CanvasItem[];
  onSelect: (canvasItemId: string) => void;
  onClose: () => void;
}

export function ImagePicker({
  canvasItems,
  onSelect,
  onClose,
}: ImagePickerProps) {
  // 只显示图片类型的元素
  const images = canvasItems.filter(item => item.type === 'image');

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">选择画布图片</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              从画布中选择一张图片关联到此镜头
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {images.length === 0 ? (
            <div className="py-12 text-center">
              <Image size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">画布中暂无图片</p>
              <p className="text-sm text-gray-400 mt-1">
                请先在画布上添加或生成图片
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-violet-500 transition-colors group relative"
                >
                  <img
                    src={item.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-700 truncate">
                      {item.prompt || '未命名图片'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
