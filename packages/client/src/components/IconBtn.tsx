import React from 'react';

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tooltip?: string;
  icon: React.ReactNode;
  label?: string;
}

export const IconBtn: React.FC<IconBtnProps> = ({ 
  active, 
  tooltip, 
  icon, 
  label, 
  className = "", 
  ...props 
}) => {
  return (
    <button
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 group relative
        ${active
          ? 'bg-violet-100 text-violet-600'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      <span className="w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
      {label && <span className="text-[10px] font-medium leading-tight mt-0.5">{label}</span>}
    </button>
  );
};