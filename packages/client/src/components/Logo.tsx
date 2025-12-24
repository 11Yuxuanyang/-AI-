import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

// 像素绘制辅助函数
const Pixel = ({ x, y, color, s = 2 }: { x: number; y: number; color: string; s?: number }) => (
  <rect x={x * s} y={y * s} width={s} height={s} fill={color} />
);

export function Logo({ size = 32, showText = true, className = '' }: LogoProps) {
  const scale = size / 32;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={48 * scale}
        height={32 * scale}
        viewBox="0 0 48 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* === 傻一：橙色 - 开心 === */}
        <g>
          {/* 头 */}
          {[2,3,4,5,6].map(x => <Pixel key={`o1-${x}`} x={x} y={4} color="#FB923C" />)}
          {[1,2,3,4,5,6,7].map(x => <Pixel key={`o2-${x}`} x={x} y={5} color="#FB923C" />)}
          {[1,2,3,4,5,6,7].map(x => <Pixel key={`o3-${x}`} x={x} y={6} color="#FB923C" />)}
          {[1,2,3,4,5,6,7].map(x => <Pixel key={`o4-${x}`} x={x} y={7} color="#FB923C" />)}
          {[1,2,3,4,5,6,7].map(x => <Pixel key={`o5-${x}`} x={x} y={8} color="#FB923C" />)}
          {[1,2,3,4,5,6,7].map(x => <Pixel key={`o6-${x}`} x={x} y={9} color="#FB923C" />)}
          {[2,3,4,5,6].map(x => <Pixel key={`o7-${x}`} x={x} y={10} color="#FB923C" />)}
          {/* 眼睛 */}
          <Pixel x={2} y={6} color="#fff" />
          <Pixel x={3} y={6} color="#1a1a1a" />
          <Pixel x={5} y={6} color="#1a1a1a" />
          <Pixel x={6} y={6} color="#fff" />
          {/* 笑嘴 */}
          <Pixel x={3} y={8} color="#1a1a1a" />
          <Pixel x={4} y={9} color="#1a1a1a" />
          <Pixel x={5} y={8} color="#1a1a1a" />
          {/* 腮红 */}
          <Pixel x={1} y={7} color="#FDBA74" />
          <Pixel x={7} y={7} color="#FDBA74" />
        </g>

        {/* === 傻二：紫色 - 坏笑（C位） === */}
        <g>
          {/* 头 - 稍大 */}
          {[18,19,20,21,22,23].map(x => <Pixel key={`p1-${x}`} x={x} y={2} color="#8B5CF6" />)}
          {[17,18,19,20,21,22,23,24].map(x => <Pixel key={`p2-${x}`} x={x} y={3} color="#8B5CF6" />)}
          {[17,18,19,20,21,22,23,24].map(x => <Pixel key={`p3-${x}`} x={x} y={4} color="#8B5CF6" />)}
          {[17,18,19,20,21,22,23,24].map(x => <Pixel key={`p4-${x}`} x={x} y={5} color="#8B5CF6" />)}
          {[17,18,19,20,21,22,23,24].map(x => <Pixel key={`p5-${x}`} x={x} y={6} color="#8B5CF6" />)}
          {[17,18,19,20,21,22,23,24].map(x => <Pixel key={`p6-${x}`} x={x} y={7} color="#8B5CF6" />)}
          {[17,18,19,20,21,22,23,24].map(x => <Pixel key={`p7-${x}`} x={x} y={8} color="#8B5CF6" />)}
          {[18,19,20,21,22,23].map(x => <Pixel key={`p8-${x}`} x={x} y={9} color="#8B5CF6" />)}
          {/* 眯眯眼 */}
          <Pixel x={18} y={5} color="#1a1a1a" />
          <Pixel x={19} y={4} color="#1a1a1a" />
          <Pixel x={22} y={4} color="#1a1a1a" />
          <Pixel x={23} y={5} color="#1a1a1a" />
          {/* 坏笑 */}
          <Pixel x={18} y={7} color="#1a1a1a" />
          <Pixel x={19} y={8} color="#1a1a1a" />
          <Pixel x={20} y={8} color="#1a1a1a" />
          <Pixel x={21} y={8} color="#1a1a1a" />
          <Pixel x={22} y={8} color="#1a1a1a" />
          <Pixel x={23} y={7} color="#1a1a1a" />
          {/* 舌头 */}
          <Pixel x={20} y={9} color="#F472B6" />
          <Pixel x={21} y={9} color="#F472B6" />
        </g>

        {/* === 傻三：青色 - 无辜 === */}
        <g>
          {/* 头 */}
          {[34,35,36,37,38].map(x => <Pixel key={`c1-${x}`} x={x} y={4} color="#06B6D4" />)}
          {[33,34,35,36,37,38,39].map(x => <Pixel key={`c2-${x}`} x={x} y={5} color="#06B6D4" />)}
          {[33,34,35,36,37,38,39].map(x => <Pixel key={`c3-${x}`} x={x} y={6} color="#06B6D4" />)}
          {[33,34,35,36,37,38,39].map(x => <Pixel key={`c4-${x}`} x={x} y={7} color="#06B6D4" />)}
          {[33,34,35,36,37,38,39].map(x => <Pixel key={`c5-${x}`} x={x} y={8} color="#06B6D4" />)}
          {[33,34,35,36,37,38,39].map(x => <Pixel key={`c6-${x}`} x={x} y={9} color="#06B6D4" />)}
          {[34,35,36,37,38].map(x => <Pixel key={`c7-${x}`} x={x} y={10} color="#06B6D4" />)}
          {/* 大眼睛 */}
          <Pixel x={34} y={6} color="#fff" />
          <Pixel x={35} y={6} color="#fff" />
          <Pixel x={34} y={7} color="#fff" />
          <Pixel x={35} y={7} color="#1a1a1a" />
          <Pixel x={37} y={6} color="#fff" />
          <Pixel x={38} y={6} color="#fff" />
          <Pixel x={37} y={7} color="#1a1a1a" />
          <Pixel x={38} y={7} color="#fff" />
          {/* 小嘴 */}
          <Pixel x={36} y={9} color="#1a1a1a" />
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
