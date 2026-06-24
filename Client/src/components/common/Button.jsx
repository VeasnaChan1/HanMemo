import React from "react";

const Button = ({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-center flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  // Using default, built-in Tailwind v4 utility colors
  const variants = {
    primary: "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
    secondary: "bg-red-50 text-red-500 hover:bg-red-100 active:scale-[0.98]",
    outline:
      "border-2 border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
