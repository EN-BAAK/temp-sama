"use client";

import React, { useMemo } from "react";
import { useField, ErrorMessage } from "formik";
import { cn } from "@/utils/tools";
import TextError from "./TextError";
import { AdvancedMultiSelectFieldStateValue, AdvancedMultiSelectFieldProps } from "../types";
import { Plus, RotateCcw, X } from "lucide-react";

const AdvancedMultiSelectField: React.FC<AdvancedMultiSelectFieldProps> = ({
  name,
  label,
  options,
  styles = "",
  labelStyle = "",
  innerDivStyle = "",
  isColor = false
}) => {
  const [field, , helpers] = useField<AdvancedMultiSelectFieldStateValue[]>(name);
  const currentValues = field.value || [];

  const { selectedItems, removedItems, activeIds, removedIds } = useMemo(() => {
    const active: AdvancedMultiSelectFieldStateValue[] = [];
    const removed: AdvancedMultiSelectFieldStateValue[] = [];
    const aIds = new Set<string>();
    const rIds = new Set<string>();

    currentValues.forEach((item) => {
      if (item.state === "remove") {
        removed.push(item);
        rIds.add(item.id);
      } else {
        active.push(item);
        aIds.add(item.id);
      }
    });

    return {
      selectedItems: active,
      removedItems: removed,
      activeIds: aIds,
      removedIds: rIds,
    };
  }, [currentValues]);

  const remainingChoices = useMemo(() => {
    return options.filter((opt) => !activeIds.has(opt.id));
  }, [options, activeIds]);

  const optionsMap = useMemo(() => {
    return new Map(options.map((opt) => [opt.id, opt.key]));
  }, [options]);

  const handleSelect = (id: string) => {
    let updatedValues: AdvancedMultiSelectFieldStateValue[];

    if (removedIds.has(id)) {
      updatedValues = currentValues.map((item) => {
        if (item.id === id) {
          return { ...item, state: item.state === "remove" ? "old" : "new" };
        }
        return item;
      });
    } else {
      updatedValues = [...currentValues, { id, state: "new" }];
    }

    helpers.setValue(updatedValues);
    helpers.setTouched(true);
  };

  const handleRemove = (id: string) => {
    const targetItem = currentValues.find((item) => item.id === id);
    if (!targetItem) return;

    let updatedValues: AdvancedMultiSelectFieldStateValue[];

    if (targetItem.state === "old") {
      updatedValues = currentValues.map((item) =>
        item.id === id ? { ...item, state: "remove" } : item
      );
    } else {
      updatedValues = currentValues.filter((item) => item.id !== id);
    }

    helpers.setValue(updatedValues);
    helpers.setTouched(true);
  };

  return (
    <div className={cn("space-y-4", styles)}>
      {label && (
        <label className={cn("block font-medium text-sm text-gray-700", labelStyle)}>
          {label}:
        </label>
      )}

      <div className={cn("border rounded-xl p-4 bg-gray-50/50 space-y-4", innerDivStyle)}>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            اختياراتك
          </h4>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-reversed rounded-lg border border-dashed border-gray-200">
            {selectedItems.length === 0 && removedItems.length === 0 && (
              <span className="text-xs text-gray-400 my-auto pl-1">لم يتم تحديد أي عناصر بعد.</span>
            )}

            {selectedItems.map((item) => (
              <button
                onClick={() => handleRemove(item.id)}
                key={`active-${item.id}`}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border transition-all",
                  item.state === "new"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                )}
              >
                {
                  isColor ? <span
                    className="w-4 h-4 rounded-full border border-border/10 inline-block shrink-0"
                    style={{ backgroundColor: optionsMap.get(item.id) }}
                  />
                    : <span>{optionsMap.get(item.id) || item.id}</span>
                }
                <X size={14} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            الخيارات المتبقية
          </h4>
          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1">
            {remainingChoices.length === 0 && (
              <span className="text-xs text-gray-400">تم اختيار جميع الخيارات المتاحة.</span>
            )}
            {remainingChoices.map((opt) => {
              const isRemovedPreviously = removedIds.has(opt.id);
              return (
                <button
                  key={`choice-${opt.id}`}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg border bg-reversed text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all shadow-sm",
                    isRemovedPreviously && "border-red-200 hover:border-red-400 bg-red-50/30"
                  )}
                  title={isColor ? opt.key : undefined}
                >
                  {isColor ? (
                    <span
                      className="w-4 h-4 rounded-full border border-border/10 inline-block shrink-0"
                      style={{ backgroundColor: opt.key }}
                    />
                  ) : (
                    <span>{opt.key}</span>
                  )}
                  {isRemovedPreviously ? <RotateCcw size={14} />
                    : <Plus size={14} className="text-gray-400" />
                  }
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default AdvancedMultiSelectField;