"use client";

import { formatBRL, formatPYG } from "@/lib/utils";

interface DualPriceProps {
  value: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: {
    brl: "text-sm font-bold",
    pyg: "text-[10px] font-normal",
  },
  md: {
    brl: "text-base font-bold",
    pyg: "text-xs font-normal",
  },
  lg: {
    brl: "text-lg font-black",
    pyg: "text-xs font-normal",
  },
  xl: {
    brl: "text-2xl font-black",
    pyg: "text-sm font-normal",
  },
};

export function DualPrice({ value, size = "md", className = "" }: DualPriceProps) {
  const classes = sizeClasses[size];
  
  return (
    <div className={`flex flex-col leading-tight ${className}`}>
      <span className={`text-[#FF8C00] ${classes.brl}`}>
        {formatBRL(value)}
      </span>
      <span className={`text-gray-400 ${classes.pyg}`}>
        {formatPYG(value)}
      </span>
    </div>
  );
}
