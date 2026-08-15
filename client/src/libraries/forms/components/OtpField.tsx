"use client";

import React, { useRef } from "react";
import { useFormikContext } from "formik";
import { cn } from "@/utils/tools";
import TextError from "./TextError";
import { OtpInputProps } from "../types"

const OtpInput: React.FC<OtpInputProps> = ({
  name,
  length,
  numericOnly = false,
  boxSize = "50px",
  className,
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<Record<string, string>>();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const valueString: string = values[name] || "".padEnd(length, "");

  const handleChange = (index: number, val: string) => {
    val = val.slice(-1);

    if (numericOnly && val && !/^\d$/.test(val)) return;

    const valueArray = valueString.split("");
    valueArray[index] = val;
    const newValue = valueArray.join("");

    setFieldValue(name, newValue);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !valueString[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const hasError = touched[name] && errors[name];

  return (
    <div className={cn("flex flex-row-reverse items-center justify-center gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          value={valueString[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          maxLength={1}
          dir="ltr"
          className={cn(
            "text-center font-medium",
            "border outline-none transition",
            "rounded-lg",
            hasError ? "border-danger text-danger" : "border-muted text-foreground",
            "focus:border-primary",
          )}
          style={{
            width: boxSize,
            height: boxSize,
          }}
        />
      ))}

      {hasError && <TextError msg={errors[name] as string} />}
    </div>
  );
};

export default OtpInput;
