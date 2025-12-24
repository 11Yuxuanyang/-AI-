import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 32, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* === 傻一：左下橙色 8x8 === */}
        <g>
          <rect x="0" y="11" width="8" height="1" fill="#F97316" />
          <rect x="0" y="12" width="9" height="6" fill="#F97316" />
          <rect x="0" y="18" width="8" height="1" fill="#EA580C" />
          {/* 眼 */}
          <rect x="1" y="13" width="2" height="2" fill="#fff" />
          <rect x="5" y="13" width="2" height="2" fill="#fff" />
          <rect x="2" y="14" width="1" height="1" fill="#1a1a1a" />
          <rect x="5" y="14" width="1" height="1" fill="#1a1a1a" />
          {/* 微笑 */}
          <rect x="2" y="16" width="1" height="1" fill="#1a1a1a" />
          <rect x="3" y="17" width="2" height="1" fill="#1a1a1a" />
          <rect x="5" y="16" width="1" height="1" fill="#1a1a1a" />
        </g>

        {/* === 傻三：右下青色 8x8 === */}
        <g>
          <rect x="12" y="11" width="8" height="1" fill="#06B6D4" />
          <rect x="11" y="12" width="9" height="6" fill="#06B6D4" />
          <rect x="12" y="18" width="8" height="1" fill="#0891B2" />
          {/* 眼 */}
          <rect x="12" y="13" width="2" height="2" fill="#fff" />
          <rect x="16" y="13" width="2" height="2" fill="#fff" />
          <rect x="13" y="14" width="1" height="1" fill="#1a1a1a" />
          <rect x="16" y="14" width="1" height="1" fill="#1a1a1a" />
          {/* o嘴 */}
          <rect x="14" y="16" width="2" height="2" fill="#1a1a1a" />
        </g>

        {/* === 傻二：中上紫色 8x8 === */}
        <g>
          <rect x="6" y="1" width="8" height="1" fill="#8B5CF6" />
          <rect x="5" y="2" width="10" height="6" fill="#8B5CF6" />
          <rect x="6" y="8" width="8" height="1" fill="#7C3AED" />
          {/* 眼 */}
          <rect x="6" y="3" width="2" height="2" fill="#fff" />
          <rect x="12" y="3" width="2" height="2" fill="#fff" />
          <rect x="7" y="4" width="1" height="1" fill="#1a1a1a" />
          <rect x="12" y="4" width="1" height="1" fill="#1a1a1a" />
          {/* 微笑 */}
          <rect x="8" y="6" width="1" height="1" fill="#1a1a1a" />
          <rect x="9" y="7" width="2" height="1" fill="#1a1a1a" />
          <rect x="11" y="6" width="1" height="1" fill="#1a1a1a" />
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
