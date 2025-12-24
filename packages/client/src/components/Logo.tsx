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
        width={size * 1.1}
        height={size}
        viewBox="0 0 44 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === 傻一：左下橙色 === */}
        <circle cx="11" cy="28" r="11" fill="#F97316" />
        {/* 翻白眼 */}
        <circle cx="7" cy="26" r="3" fill="#fff" />
        <circle cx="14" cy="26" r="3" fill="#fff" />
        <circle cx="7" cy="24" r="1.5" fill="#1a1a1a" />
        <circle cx="14" cy="24" r="1.5" fill="#1a1a1a" />
        {/* 歪嘴 */}
        <path d="M6 32 Q11 35 16 31" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* === 傻三：右下青色 === */}
        <circle cx="33" cy="28" r="11" fill="#06B6D4" />
        {/* 惊恐大眼 */}
        <circle cx="29" cy="26" r="4" fill="#fff" />
        <circle cx="36" cy="26" r="4" fill="#fff" />
        <circle cx="30" cy="27" r="2" fill="#1a1a1a" />
        <circle cx="37" cy="27" r="2" fill="#1a1a1a" />
        {/* 方形惊讶嘴 */}
        <rect x="30" y="32" width="5" height="4" rx="1" fill="#1a1a1a" />

        {/* === 傻二：顶部紫色 === */}
        <circle cx="22" cy="13" r="12" fill="#8B5CF6" />
        {/* 得意眯眯眼 */}
        <path d="M15 11 Q18 8 21 11" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M23 11 Q26 8 29 11" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* 坏笑吐舌 */}
        <path d="M16 17 Q22 22 28 17" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="22" cy="20" rx="3" ry="2" fill="#F472B6" />
      </svg>

      {showText && (
        <span className="font-semibold text-gray-900 whitespace-nowrap">
          三傻大闘AI圈
        </span>
      )}
    </div>
  );
}
