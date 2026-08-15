"use client";

import { Field, FieldProps, ErrorMessage } from "formik";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/tools";
import { MultiSelectorFieldProps } from "../types"
import TextError from "./TextError";
import { useState } from "react";

const MultiSelectorField: React.FC<MultiSelectorFieldProps> = ({
  name,
  label,
  options,
  styles = "",
  labelStyle = "",
  innerDivStyle = "",
  dir = "ltr",
  disabled = false,
  maxSelection,
}) => {
  const [search, setSearch] = useState<string>('');

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const selectedValues: string[] = field.value || [];
        const hasError = meta.touched && meta.error;

        const availableOptions = options.filter(
          (option) =>
            !selectedValues.includes(String(option.value)) &&
            (search === "" ||
              option.key.toLowerCase().includes(search.toLowerCase()) ||
              String(option.value).toLowerCase().includes(search.toLowerCase()))
        );

        const selectedOptions = options.filter((option) =>
          selectedValues.includes(String(option.value))
        );

        const isMaxReached =
          maxSelection !== undefined && selectedValues.length >= maxSelection;

        const handleSelect = async (value: string) => {
          if (disabled || isMaxReached) return;

          const newValues = Array.isArray(selectedValues) ? [...selectedValues, value] : [value];
          await form.setFieldValue(name, newValues);
          form.setFieldTouched(name, true);

          form.validateField(name);

          setSearch("");
        };

        const handleDeselect = (value: string) => {
          if (disabled) return;
          const newValues = selectedValues.filter((v) => v !== value);
          form.setFieldValue(name, newValues);
          form.setFieldTouched(name, true);
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
                "bg-background/50 border rounded-lg transition-all duration-200",
                hasError
                  ? "border-danger focus-within:ring-2 focus-within:ring-danger/20"
                  : "border-muted focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
                disabled && "bg-muted/30 opacity-50 cursor-not-allowed",
                innerDivStyle
              )}
            >
              <div className="p-3 border-b border-muted">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for options..."
                    disabled={disabled || isMaxReached}
                    className={cn(
                      "bg-transparent pr-10 pl-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans",
                      dir === "rtl" && "text-right"
                    )}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-background transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-sans font-semibold text-xs text-muted-foreground">
                    Available options
                  </p>
                  {maxSelection && (
                    <p className="font-sans text-xs text-muted-foreground">
                      {selectedValues.length} / {maxSelection}
                    </p>
                  )}
                </div>

                <div className="max-h-48">
                  <div className="pr-3 flex flex-wrap gap-2">
                    {availableOptions.length === 0 ? (
                      <p className="w-full py-4 text-center font-sans text-sm text-muted-foreground">
                        {search
                          ? "No results found"
                          : "No options available"}
                      </p>
                    ) : (
                      availableOptions.map((option) => (
                        <button
                          key={option.value}
                          className={cn(
                            "font-sans cursor-pointer transition-all duration-200 hover:bg-primary hover:text-background hover:border-primary animate-in fade-in slide-in-from-top-2",
                            disabled || isMaxReached
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          )}
                          onClick={() => handleSelect(String(option.value))}
                        >
                          {option.key}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {selectedOptions.length > 0 && (
                <div className="p-3 space-y-2 border-t border-muted">
                  <p className="font-sans font-semibold text-xs text-primary">
                    Selected options ({selectedOptions.length})
                  </p>
                  <div className="max-h-48">
                    <div className="pr-3 flex flex-wrap gap-2">
                      {selectedOptions.map((option) => (
                        <button
                          key={option.value}
                          className={cn(
                            "bg-primary text-background font-sans cursor-pointer transition-all duration-200 hover:bg-primary/80 animate-in fade-in slide-in-from-bottom-2",
                            disabled && "cursor-not-allowed opacity-50"
                          )}
                          onClick={() => handleDeselect(String(option.value))}
                        >
                          {option.key}
                          <X className="w-3 h-3 mr-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isMaxReached && !disabled && (
              <p className="font-sans text-xs text-accent animate-in fade-in slide-in-from-top-1 duration-200">
                Maximum selection reached ({maxSelection})
              </p>
            )}

            <ErrorMessage name={name}>
              {(msg) => <TextError msg={msg} />}
            </ErrorMessage>
          </div>
        );
      }}
    </Field>
  );
};

export default MultiSelectorField
