import React from "react";
import { cn } from "@/lib/utils";

interface PearlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const PearlButton = React.forwardRef<HTMLButtonElement, PearlButtonProps>(
  ({ label = "Join Now", className = "", icon, children, ...props }, ref) => {
    return (
      <button 
        ref={ref}
        type="button"
        className={cn(
          "pearl-button",
          "relative overflow-hidden rounded-full bg-yellow-400 text-black",
          "px-6 py-3 text-sm font-medium shadow-lg",
          "transition-all duration-200 hover:brightness-110 active:translate-y-0.5 active:brightness-95",
          className
        )}
        {...props}
      >
        <style jsx>{`
          .pearl-button {
            --white: #ffffff;
            --bg: #fde047; /* yellow-300 */
            --text: #000000;
            --radius: 100px;
            color: var(--text);
            box-shadow:
              inset 0 0.3rem 0.9rem rgba(255, 255, 255, 0.5),
              inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.3),
              inset 0 -0.4rem 0.9rem rgba(255, 255, 255, 0.7),
              0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          }
          .pearl-button::before,
          .pearl-button::after {
            content: "";
            position: absolute;
            transition: all 0.3s ease;
          }
          .pearl-button::before {
            left: -15%;
            right: -15%;
            bottom: 25%;
            top: -100%;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.15);
          }
          .pearl-button::after {
            left: 6%;
            right: 6%;
            top: 12%;
            bottom: 40%;
            border-radius: 22px 22px 0 0;
            box-shadow: inset 0 10px 8px -10px rgba(255, 255, 255, 0.8);
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(0, 0, 0, 0) 50%,
              rgba(0, 0, 0, 0) 100%
            );
          }
          .pearl-button:hover::before {
            transform: translateY(-5%);
          }
          .pearl-button:hover::after {
            opacity: 0.4;
            transform: translateY(5%);
          }
        `}</style>
        <span className="relative z-10 flex items-center gap-2">
          {icon}
          {label || children}
        </span>
      </button>
    );
  }
);

PearlButton.displayName = "PearlButton";
