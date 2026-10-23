import React from "react";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`p-4 bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>;
};

export { Card, CardContent };
