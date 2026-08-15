"use client";

import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { InputFieldProps } from "../types"
import { cn } from "@/utils/tools";
import { Eye, EyeOff } from "lucide-react";

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type,
  styles,
  labelStyle,
  placeholder,
  dir = "ltr",
  innerDivStyle,
  inputMode,
  Icon,
  iconStyle,
  autoComplete = "on",
  disabled = false,
  required = false,
  inputStyle
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${styles || ""}`}>
      {label && (
        <label
          htmlFor={name}
          className={cn("mb-2", labelStyle)}
        >
          {label}:
        </label>
      )}

      <div className={`relative ${innerDivStyle || ""}`}>
        {Icon && (
          <span
            className={cn(
              "flex items-center absolute inset-y-0",
              dir === "rtl" ? "right-3" : "left-3",
              iconStyle
            )}
          >
            {Icon}
          </span>
        )}

        <Field
          id={name}
          name={name}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          inputMode={inputMode}
          placeholder={placeholder}
          dir={dir}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={cn(Icon && (dir === "rtl" ? "pr-10" : "pl-10"), inputStyle)}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={cn(
              "flex items-center absolute inset-y-0",
              dir === "rtl" ? "left-3" : "right-3",
              "text-muted-foreground transition-colors cursor-pointer hover:text-foreground"
            )}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default InputField;
