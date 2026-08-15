"use client";

import { Field, FieldProps, ErrorMessage } from "formik";
import { cn } from "@/utils/tools";
import TextError from "./TextError";
import {
  FEATURE_ICONS,
  FEATURE_ICONS_MAP,
} from "../constants";
import { IconSelectionFieldProps } from "../types"

const IconSelectionField: React.FC<IconSelectionFieldProps> = ({
  name,
  label,
  styles = "",
  labelStyle = "",
  innerDivStyle = "",
  disabled = false,
}) => {
  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const selectedIcon = field.value;
        const hasError = meta.touched && meta.error;

        const handleSelect = async (icon: string) => {
          if (disabled) return;

          await form.setFieldValue(name, icon);
          form.setFieldTouched(name, true);
          form.validateField(name);
        };

        return (
          <div className={cn("space-y-2", styles)}>
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  "block font-sans font-medium text-sm",
                  labelStyle
                )}
              >
                {label}:
              </label>
            )}

            <div
              className={cn(
                "border rounded-lg p-4 h-50 overflow-hidden bg-reversed",
                hasError
                  ? "border-danger"
                  : "border-muted",
                disabled && "opacity-50 cursor-not-allowed",
                innerDivStyle
              )}
            >
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 h-full overflow-y-auto">
                {FEATURE_ICONS.map((iconName) => {
                  const Icon =
                    FEATURE_ICONS_MAP[
                    iconName as keyof typeof FEATURE_ICONS_MAP
                    ] || FEATURE_ICONS_MAP.default;

                  const isSelected = selectedIcon === iconName;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelect(iconName)}
                      title={iconName}
                      className={cn(
                        "flex items-center justify-center h-12 w-12 rounded-lg border transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "border-accent bg-accent text-reversed"
                          : "border-muted hover:border-primary hover:bg-primary/10",
                        disabled &&
                        "cursor-not-allowed"
                      )}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <ErrorMessage name={name}>
              {(msg) => <TextError msg={msg} />}
            </ErrorMessage>
          </div>
        );
      }}
    </Field>
  );
};

export default IconSelectionField;