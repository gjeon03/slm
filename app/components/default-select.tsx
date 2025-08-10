interface DefaultSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isError?: boolean;
  errorMessage?: string;
}

export function DefaultSelect({
  isError,
  errorMessage,
  ...props
}: DefaultSelectProps) {
  return (
    <div className={`relative flex flex-col  ${props.className || ""}`}>
      <select
        aria-invalid={isError}
        aria-describedby={isError ? "error-message" : undefined}
        id={props.id}
        {...props}
        className={`w-full h-11 rounded-lg border border-gray-300 p-2 focus:outline-none bg-white focus:border-[#ffddae] ${
          isError ? "border-red-500" : ""
        }`}
      >
        {props.children}
      </select>
      {isError && errorMessage && (
        <p className="text-red-500 text-sm mt-1" id="error-message">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
