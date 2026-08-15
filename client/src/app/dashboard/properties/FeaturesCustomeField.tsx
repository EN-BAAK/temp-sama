"use client";

import React, { useMemo, useState } from "react";
import { ErrorMessage, useField } from "formik";
import { Plus, X } from "lucide-react";

import { cn } from "@/utils/tools";
import {
  FeatureItem,
  FeatureValueItem,
  FeaturesFieldProps,
} from "@/types/forms";
import TextError from "@/libraries/forms/components/TextError";

const FeaturesField: React.FC<FeaturesFieldProps> = ({
  name,
  features,
  label,
  placeholder = "أدخل ميزة جديدة...",
  styles,
  labelStyle,
  innerDivStyle,
  disabled = false,
}) => {
  const [field, , helpers] = useField<FeatureValueItem[]>(name);
  const [inputValue, setInputValue] = useState("");

  const currentFeatures = useMemo(() => {
    return field.value || []
  }, [field]);

  const normalize = (value: string) => value.trim().toLowerCase();

  const activeFeatures = useMemo(
    () => currentFeatures.filter((item) => item.state !== "remove"),
    [currentFeatures]
  );

  const availableFeatures = useMemo(() => {
    const search = normalize(inputValue);

    return features.filter((feature) => {
      const isSelected = activeFeatures.some(
        (item) =>
          item.id !== undefined &&
          String(item.id) === String(feature.id)
      );

      if (isSelected) return false;

      if (!search) return true;

      return normalize(feature.name).includes(search);
    });
  }, [features, activeFeatures, inputValue]);

  const selectExistingFeature = (feature: FeatureItem) => {
    const existingIndex = currentFeatures.findIndex(
      (item) =>
        item.id !== undefined &&
        String(item.id) === String(feature.id)
    );

    if (existingIndex !== -1) {
      const existing = currentFeatures[existingIndex];

      if (existing.state === "remove") {
        const updatedFeatures = currentFeatures.map((item, index) =>
          index === existingIndex
            ? { ...item, state: "old" as const }
            : item
        );

        helpers.setValue(updatedFeatures);
        helpers.setTouched(true);
      }

      setInputValue("");
      return;
    }

    const newFeature: FeatureValueItem = {
      id: feature.id,
      name: feature.name,
      state: "new",
    };

    helpers.setValue([...currentFeatures, newFeature]);
    helpers.setTouched(true);
    setInputValue("");
  };

  const handleAddFeature = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) return;

    const normalizedInput = normalize(trimmed);

    const exactExistingFeature = features.find(
      (feature) => normalize(feature.name) === normalizedInput
    );

    if (exactExistingFeature) {
      selectExistingFeature(exactExistingFeature);
      return;
    }

    const alreadySelected = activeFeatures.some(
      (item) => normalize(item.name) === normalizedInput
    );

    if (alreadySelected) return;

    const newFeature: FeatureValueItem = {
      name: trimmed,
      state: "created",
    };

    helpers.setValue([...currentFeatures, newFeature]);
    helpers.setTouched(true);
    setInputValue("");
  };

  const handleRemoveFeature = (index: number) => {
    const target = currentFeatures[index];

    if (!target) return;

    let updatedFeatures: FeatureValueItem[];

    if (target.state === "created" || target.state === "new") {
      updatedFeatures = currentFeatures.filter((_, i) => i !== index);
    } else if (target.state === "old") {
      updatedFeatures = currentFeatures.map((item, i) =>
        i === index
          ? { ...item, state: "remove" as const }
          : item
      );
    } else {
      return;
    }

    helpers.setValue(updatedFeatures);
    helpers.setTouched(true);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div className={cn("mb-6 space-y-3", styles)}>
      {label && (
        <label
          className={cn(
            "block text-sm font-medium text-gray-700",
            labelStyle
          )}
        >
          {label}:
        </label>
      )}

      <div
        className={cn(
          "flex items-center gap-2",
          innerDivStyle
        )}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleAddFeature}
          disabled={disabled || !inputValue.trim()}
          className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-reversed transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={16} />
          <span>إضافة</span>
        </button>
      </div>

      <div className="min-h-[52px] rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-3">
        {availableFeatures.length === 0 ? (
          <span className="text-xs text-gray-400">
            لا توجد ميزات متاحة.
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map((feature) => (
              <button
                key={feature.id}
                type="button"
                disabled={disabled}
                onClick={() => selectExistingFeature(feature)}
                className="cursor-pointer rounded-full border border-gray-200 bg-gray-100/60 px-3 py-1 text-sm font-medium text-gray-500 opacity-75 transition hover:border-gray-300 hover:bg-gray-200/70 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {feature.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-[52px] rounded-xl border border-dashed border-gray-300 p-3">
        {activeFeatures.length === 0 ? (
          <span className="text-xs text-gray-400">
            لم يتم اختيار أي ميزة بعد.
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentFeatures.map((item, index) => {
              if (item.state === "remove") return null;

              const isOld = item.state === "old";
              const isNew = item.state === "new";
              const isCreated = item.state === "created";

              return (
                <div
                  key={`${item.id ?? item.name}-${index}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all",
                    isOld &&
                    "border-sky-200 bg-sky-50 text-sky-700",
                    isNew &&
                    "border-violet-200 bg-violet-50 text-violet-700",
                    isCreated &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  <span>{item.name}</span>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleRemoveFeature(index)}
                    title="حذف"
                    className={cn(
                      "cursor-pointer rounded-full p-0.5 transition-colors disabled:cursor-not-allowed",
                      isOld && "hover:bg-sky-200/50",
                      isNew && "hover:bg-violet-200/50",
                      isCreated && "hover:bg-emerald-200/50"
                    )}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg[0]} />
        }
      </ErrorMessage>
    </div>
  );
};

export default FeaturesField;