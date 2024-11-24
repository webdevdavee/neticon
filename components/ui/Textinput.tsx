import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "style"> {
  inputRegister?: UseFormRegisterReturn;
  label?: string;
  htmlFor?: string;
  error?: string | null;
  customStyle?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  inputRegister,
  label,
  htmlFor,
  error,
  placeholder,
  required,
  inputMode,
  customStyle,
  type = "text",
  min,
  step,
  ...props
}) => {
  return (
    <section className="w-full flex flex-col gap-3">
      <label
        className="flex gap-1 font-medium"
        htmlFor={htmlFor}
        style={{ display: label === "none" ? "none" : "flex" }}
      >
        {label}
        <p>{required ? "*" : "(Optional)"}</p>
      </label>
      <div>
        <div className="py-2 px-4 rounded-md">
          <input
            {...inputRegister}
            {...props}
            className={`w-full placeholder:font-medium bg-transparent placeholder:text-sm focus:outline-none ${
              customStyle || ""
            }`}
            type={type}
            id={htmlFor}
            placeholder={placeholder}
            inputMode={inputMode}
            step={step || "any"}
            min={min}
            required={required}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </section>
  );
};

export default TextInput;
