"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, Filter, RotateCcw, X } from "lucide-react";
import Button from "@/libraries/forms/components/Button";
import { CategoryEntity, CityEntity, } from "@/types/entities";
import { useGetAllCities } from "@/features/useGovernorate";
import { useGetAllCategories } from "@/features/useCategories";
import { DashboardPropertiesFiltersProps } from "@/types/components";
import { GetPropertiesFilterParams } from "@/types/queries";
import { PROPERTY_PURPOSE_OPTIONS, PROPERTY_STATUS_OPTIONS } from "@/constants/global";

const Filters: React.FC<DashboardPropertiesFiltersProps> = ({
  value,
  onChange,
  isDisabled = false,
  statusOptions = PROPERTY_STATUS_OPTIONS,
  purposeOptions = PROPERTY_PURPOSE_OPTIONS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<GetPropertiesFilterParams>(value);

  const { data: citiesData, isLoading: isLoadingCities } =
    useGetAllCities();

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetAllCategories();

  const cities = useMemo<CityEntity[]>(() => {
    const payload = citiesData?.data as
      | CityEntity[]
      | { items?: CityEntity[] }
      | undefined;

    if (Array.isArray(payload)) {
      return payload;
    }

    return payload?.items ?? [];
  }, [citiesData]);

  const categories = useMemo<CategoryEntity[]>(() => {
    const payload = categoriesData?.data as
      | CategoryEntity[]
      | { items?: CategoryEntity[] }
      | undefined;

    if (Array.isArray(payload)) {
      return payload;
    }

    return payload?.items ?? [];
  }, [categoriesData]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(value).filter(
      (item) => item !== undefined && item !== "",
    ).length;
  }, [value]);


  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const updateFilter = <K extends keyof GetPropertiesFilterParams>(
    key: K,
    newValue: GetPropertiesFilterParams[K],
  ) => {
    setDraftFilters((previous) => ({
      ...previous,
      [key]: newValue,
    }));
  };

  const parsePrice = (value: string): number | undefined => {
    if (!value.trim()) return undefined;

    const parsedValue = Number(value);

    return Number.isFinite(parsedValue)
      ? parsedValue
      : undefined;
  };
  const normalizeFilters = (
    filters: GetPropertiesFilterParams,
  ): GetPropertiesFilterParams => {
    const normalized: GetPropertiesFilterParams = {};

    if (filters.cityId) {
      normalized.cityId = filters.cityId;
    }

    if (filters.categoryId) {
      normalized.categoryId = filters.categoryId;
    }

    if (filters.status) {
      normalized.status = filters.status;
    }

    if (filters.purpose) {
      normalized.purpose = filters.purpose;
    }

    if (filters.minimumPrice !== undefined) {
      normalized.minimumPrice = filters.minimumPrice;
    }

    if (filters.maximumPrice !== undefined) {
      normalized.maximumPrice = filters.maximumPrice;
    }

    return normalized;
  };

  const handleApply = () => {
    if (
      draftFilters.minimumPrice !== undefined &&
      draftFilters.maximumPrice !== undefined &&
      draftFilters.minimumPrice > draftFilters.maximumPrice
    ) {
      return;
    }

    onChange(normalizeFilters(draftFilters));
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters: GetPropertiesFilterParams = {};

    setDraftFilters(emptyFilters);
    onChange(emptyFilters);
    setIsOpen(false);
  };

  const hasInvalidPriceRange =
    draftFilters.minimumPrice !== undefined &&
    draftFilters.maximumPrice !== undefined &&
    draftFilters.minimumPrice > draftFilters.maximumPrice;

  return (
    <div className="relative">
      <div className="relative">
        <Button
          type="button"
          variant="transparent"
          icon={Filter}
          disabled={isDisabled}
          onClick={() => setIsOpen((previous) => !previous)}
          className="w-fit whitespace-nowrap"
          iconClassName="h-4 w-4"
        />

        {(activeFiltersCount > 0) && <span className="w-3 h-3 bg-danger text-[9px] rounded-full text-center text-reversed absolute top-1 right-2">{activeFiltersCount}</span>}
      </div>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="إغلاق الفلاتر"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="absolute end-0 top-full z-30 mt-3 w-[min(90vw,420px)] rounded-2xl border border-border bg-card p-5 shadow-xl"
            dir="rtl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-text">
                  تصفية العقارات
                </h2>

                <p className="mt-1 text-xs text-muted">
                  اختر خصائص العقارات التي تريد عرضها
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-muted transition hover:bg-background2 hover:text-text"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="filter-city"
                  className="text-sm font-medium text-text"
                >
                  المدينة
                </label>

                <select
                  id="filter-city"
                  value={String(draftFilters.cityId ?? "")}
                  disabled={isLoadingCities}
                  onChange={(event) =>
                    updateFilter(
                      "cityId",
                      Number(event.target.value) || undefined,
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
                >
                  <option value="">جميع المدن</option>

                  {cities.map((city) => (
                    <option
                      key={String(city.id)}
                      value={String(city.id)}
                    >
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="filter-category"
                  className="text-sm font-medium text-text"
                >
                  التصنيف
                </label>

                <select
                  id="filter-category"
                  value={String(draftFilters.categoryId ?? "")}
                  disabled={isLoadingCategories}
                  onChange={(event) =>
                    updateFilter(
                      "categoryId",
                      Number(event.target.value) || undefined,
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
                >
                  <option value="">جميع التصنيفات</option>

                  {categories.map((category) => (
                    <option
                      key={String(category.id)}
                      value={String(category.id)}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="filter-status"
                  className="text-sm font-medium text-text"
                >
                  الحالة
                </label>

                <select
                  id="filter-status"
                  value={draftFilters.status ?? ""}
                  onChange={(event) =>
                    updateFilter(
                      "status",
                      event.target.value || undefined,
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">جميع الحالات</option>

                  {statusOptions.map((status) => (
                    <option
                      key={status.value}
                      value={status.value}
                    >
                      {status.key}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="filter-purpose"
                  className="text-sm font-medium text-text"
                >
                  الغرض
                </label>

                <select
                  id="filter-purpose"
                  value={draftFilters.purpose ?? ""}
                  onChange={(event) =>
                    updateFilter(
                      "purpose",
                      event.target.value || undefined,
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">جميع الأغراض</option>

                  {purposeOptions.map((purpose) => (
                    <option
                      key={purpose.value}
                      value={purpose.value}
                    >
                      {purpose.key}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="filter-minimum-price"
                  className="text-sm font-medium text-text"
                >
                  أقل سعر
                </label>

                <input
                  id="filter-minimum-price"
                  type="number"
                  min={0}
                  value={draftFilters.minimumPrice ?? ""}
                  onChange={(event) =>
                    updateFilter(
                      "minimumPrice",
                      parsePrice(event.target.value),
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="filter-maximum-price"
                  className="text-sm font-medium text-text"
                >
                  أعلى سعر
                </label>

                <input
                  id="filter-maximum-price"
                  type="number"
                  min={0}
                  value={draftFilters.maximumPrice ?? ""}
                  onChange={(event) =>
                    updateFilter(
                      "maximumPrice",
                      parsePrice(event.target.value),
                    )
                  }
                  placeholder="بدون حد"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {hasInvalidPriceRange && (
              <p className="mt-3 text-xs text-danger">
                يجب أن يكون أقل سعر أصغر من أو مساوياً لأعلى سعر.
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="transparent"
                icon={RotateCcw}
                label="إعادة تعيين"
                onClick={handleReset}
                className="w-fit"
                iconClassName="h-4 w-4"
              />

              <Button
                type="button"
                icon={Check}
                label="تطبيق"
                disabled={hasInvalidPriceRange}
                onClick={handleApply}
                className="w-fit px-5"
                iconClassName="h-4 w-4"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Filters;