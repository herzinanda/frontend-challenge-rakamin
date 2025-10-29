"use client";

import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "neutral" | "disabled";
type ButtonSize = "small" | "medium" | "large";
type ButtonWidth = "auto" | "full";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: ButtonWidth;
  href?: string
};
const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "medium",
      width = "auto",
      onClick,
      type = "button",
      href, 
      ...props
    },
    ref
  ) => {    const variantStyles = {
      primary: "bg-primary-main text-white hover:bg-primary-hover",
      secondary: "bg-secondary-main text-neutral-90 hover:bg-secondary-hover",
      neutral: "bg-neutral-10 text-black hover:bg-neutral-20",
      disabled:
        "bg-neutral-30 border border-neutral-40 text-neutral-60 cursor-not-allowed",
    };

    const sizeStyles = {
      small: "text-s py-1",
      medium: "text-m py-1",
      large: "text-l py-1.5",
    };

    const widthStyles = {
      auto: "w-auto px-4",
      full: "w-full",
    };

    const appliedClasses = `rounded-lg font-bold transition-colors ${
      variantStyles[variant]
    } ${sizeStyles[size]} ${widthStyles[width]} ${className}`;

    if (href) {
      return (
        <Link href={href} passHref legacyBehavior>
          <a
            ref={ref as React.Ref<HTMLAnchorElement>} 
            className={appliedClasses}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        </Link>
      );
    }


    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>} 
        className={appliedClasses}
        onClick={onClick}
        type={type}
        disabled={variant === "disabled"} 
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button"

export default Button;