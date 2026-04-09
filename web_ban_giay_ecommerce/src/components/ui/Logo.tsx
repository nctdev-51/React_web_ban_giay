import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "h-8", showText = true }: LogoProps) {
  return (
    <div
      className={`flex items-center gap-3 select-none cursor-pointer ${className}`}
    >
      {/* Biểu tượng 3 sọc nghiêng (Đại diện cho T, Q, S) và điểm nhấn tốc độ */}
      <svg
        viewBox="0 0 100 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto text-black"
      >
        <path d="M20 0L40 40H28L8 0H20Z" fill="currentColor" />
        <path d="M45 0L65 40H53L33 0H45Z" fill="currentColor" opacity="0.7" />
        <path d="M70 0L90 40H78L58 0H70Z" fill="currentColor" opacity="0.4" />
        {/* Dấu chấm đỏ bứt phá mang âm hưởng của dòng giày Jordan/Air Max */}
        <circle cx="88" cy="34" r="6" fill="#E53611" />
      </svg>

      {/* Phần Typograhy (Chữ) */}
      {showText && (
        <div className="flex flex-col justify-center mt-1">
          <span className="font-black text-[24px] leading-none tracking-tighter uppercase text-[#111] italic">
            TQS
          </span>
          <span className="font-bold text-[10px] leading-none tracking-[0.25em] text-gray-500 uppercase mt-1">
            Group 12
          </span>
        </div>
      )}
    </div>
  );
}
