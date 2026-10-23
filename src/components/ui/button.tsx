import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => {
    return <button ref={ref} className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
