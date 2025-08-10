import { useState } from "react";

interface DefaultInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  errorMessage?: string;
}

export default function DefaultInput({
  isError,
  errorMessage,
  ...props
}: DefaultInputProps) {
  const [value, setValue] = useState(props.value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={`relative flex flex-col  ${props.className || ""}`}>
      <input
        type="text"
        placeholder="Enter text here..."
        aria-invalid={isError}
        aria-describedby={isError ? "error-message" : undefined}
        id={props.id}
        {...props}
        value={value}
        onChange={handleChange}
        className={`w-full h-11 rounded-lg border border-gray-300 p-2 focus:outline-none bg-white focus:border-[#F9CE61] ${
          isError ? "border-red-500" : ""
        }`}
      />
      {isError && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
