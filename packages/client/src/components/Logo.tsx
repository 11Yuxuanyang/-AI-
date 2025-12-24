import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = '' }: LogoProps) {
  const scale = size / 24;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={36 * scale}
        height={24 * scale}
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* === 傻一：橙色 - 开心 === */}
        <g>
          {/* 头 7x7 */}
          <rect x="0" y="5" width="7" height="1" fill="#FB923C" />
          <rect x="0" y="6" width="8" height="5" fill="#FB923C" />
          <rect x="1" y="11" width="6" height="1" fill="#FB923C" />
          {/* 眼睛 */}
          <rect x="1" y="7" width="2" height="2" fill="#fff" />
          <rect x="5" y="7" width="2" height="2" fill="#fff" />
          <rect x="2" y="8" width="1" height="1" fill="#1a1a1a" />
          <rect x="5" y="8" width="1" height="1" fill="#1a1a1a" />
          {/* 笑嘴 */}
          <rect x="2" y="10" width="1" height="1" fill="#1a1a1a" />
          <rect x="3" y="11" width="2" height="1" fill="#1a1a1a" />
          <rect x="5" y="10" width="1" height="1" fill="#1a1a1a" />
        </g>

        {/* === 傻二：紫色 - 坏笑（C位偏上） === */}
        <g>
          {/* 头 8x8 */}
          <rect x="13" y="1" width="8" height="1" fill="#8B5CF6" />
          <rect x="12" y="2" width="10" height="6" fill="#8B5CF6" />
          <rect x="13" y="8" width="8" height="1" fill="#8B5CF6" />
          {/* 眯眯眼 */}
          <rect x="13" y="4" width="1" height="1" fill="#1a1a1a" />
          <rect x="14" y="3" width="2" height="1" fill="#1a1a1a" />
          <rect x="18" y="3" width="2" height="1" fill="#1a1a1a" />
          <rect x="20" y="4" width="1" height="1" fill="#1a1a1a" />
          {/* 坏笑 */}
          <rect x="14" y="6" width="1" height="1" fill="#1a1a1a" />
          <rect x="15" y="7" width="4" height="1" fill="#1a1a1a" />
          <rect x="19" y="6" width="1" height="1" fill="#1a1a1a" />
          {/* 舌头 */}
          <rect x="16" y="8" width="2" height="1" fill="#F472B6" />
        </g>

        {/* === 傻三：青色 - 无辜 === */}
        <g>
          {/* 头 7x7 */}
          <rect x="28" y="5" width="7" height="1" fill="#06B6D4" />
          <rect x="27" y="6" width="9" height="5" fill="#06B6D4" />
          <rect x="28" y="11" width="7" height="1" fill="#06B6D4" />
          {/* 大眼睛 */}
          <rect x="28" y="7" width="2" height="2" fill="#fff" />
          <rect x="32" y="7" width="2" height="2" fill="#fff" />
          <rect x="29" y="8" width="1" height="1" fill="#1a1a1a" />
          <rect x="32" y="8" width="1" height="1" fill="#1a1a1a" />
          {/* 小嘴 */}
          <rect x="30" y="10" width="2" height="1" fill="#1a1a1a" />
        </g>
      </svg>

      {showText && (
        <span className="font-semibold text-gray-900 whitespace-nowrap">
          三傻大闹AI圈
        </span>
      )}
    </div>
  );
}
