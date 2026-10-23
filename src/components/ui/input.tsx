import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`p-2 border rounded bg-gray-800 text-white ${className}`}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
