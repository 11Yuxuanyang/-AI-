import { useState, useCallback, useRef, useEffect } from 'react';

interface PanelPosition {
  x: number;
  y: number;
}

interface PanelSize {
  width: number;
  height: number;
}

interface UseDraggablePanelOptions {
  initialPosition?: PanelPosition;
  initialSize?: PanelSize;
  minSize?: PanelSize;
  maxSize?: PanelSize;
}

interface UseDraggablePanelReturn {
  position: PanelPosition;
  size: PanelSize;
  isDragging: boolean;
  isResizing: boolean;
  handleDragStart: (e: React.MouseEvent) => void;
  handleResizeStart: (e: React.MouseEvent) => void;
}

export function useDraggablePanel(options: UseDraggablePanelOptions = {}): UseDraggablePanelReturn {
  const {
    initialPosition = { x: 100, y: 100 },
    initialSize = { width: 800, height: 500 },
    minSize = { width: 600, height: 400 },
    maxSize = { width: window.innerWidth - 100, height: window.innerHeight - 100 },
  } = options;

  const [position, setPosition] = useState<PanelPosition>(initialPosition);
  const [size, setSize] = useState<PanelSize>(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });
  const sizeStartRef = useRef({ width: 0, height: 0 });

  // 拖拽移动
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    positionStartRef.current = { ...position };
  }, [position]);

  // 调整大小
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    sizeStartRef.current = { ...size };
  }, [size]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;

        let newX = positionStartRef.current.x + dx;
        let newY = positionStartRef.current.y + dy;

        // 边界检测
        newX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - size.height));

        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;

        let newWidth = sizeStartRef.current.width + dx;
        let newHeight = sizeStartRef.current.height + dy;

        // 尺寸限制
        newWidth = Math.max(minSize.width, Math.min(newWidth, maxSize.width));
        newHeight = Math.max(minSize.height, Math.min(newHeight, maxSize.height));

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, size.width, size.height, minSize, maxSize]);

  return {
    position,
    size,
    isDragging,
    isResizing,
    handleDragStart,
    handleResizeStart,
  };
}
