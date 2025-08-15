import React from "react";

interface ErrorFieldProps {
  errors: string[];
  height?: string;
}

const ErrorField: React.FC<ErrorFieldProps> = ({ errors, height = "h-10" }) => {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      {errors.length > 0 && (
        <div className="text-center text-red-300 flex items-center">
          {errors}
        </div>
      )}
    </div>
  );
};

export default ErrorField;
