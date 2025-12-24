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
        viewBox="0 0 36 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 左 - 橙色圆 */}
        <circle cx="10" cy="20" r="10" fill="#F97316" />

        {/* 中 - 紫色圆（靠上，叠在上层） */}
        <circle cx="18" cy="12" r="11" fill="#8B5CF6" />

        {/* 右 - 青色圆 */}
        <circle cx="26" cy="20" r="10" fill="#06B6D4" />
      </svg>

      {showText && (
        <span className="font-semibold text-gray-900 whitespace-nowrap">
          三傻大闹AI圈
        </span>
      )}
    </div>
  );
}
