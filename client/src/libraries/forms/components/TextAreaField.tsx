import React from "react";
import TextError from "./TextError";
import { Field, ErrorMessage } from "formik";
import { TextAreaFieldProps } from "../types"
import { cn } from "@/utils/tools";

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  label,
  styles,
  labelStyle,
  placeholder,
  dir = "ltr",
  innerDivStyle,
  Icon,
  iconStyle,
  required,
  disabled,
  rows=4
}) => {
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
          as="textarea"
          id={name}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          dir={dir}
          required={required}
          rows={rows}
          className={cn(Icon && (dir === "rtl" ? "pr-10" : "pl-10"))}
        />
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default TextAreaField;
