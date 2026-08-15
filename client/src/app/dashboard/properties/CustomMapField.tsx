"use client";

import React, { useCallback, useEffect, useRef, useState, } from "react";
import dynamic from "next/dynamic";
import { ErrorMessage, useField } from "formik";
import { MapPin, Navigation, Search } from "lucide-react";
import { cn } from "@/utils/tools";
import TextError from "@/libraries/forms/components/TextError";
import { CustomMapFieldProps, LatLngValue, NominatimSearchResult } from "@/types/forms";
import { Skeleton } from "@/libraries/components/Skeleton";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full rounded-lg" />,
});

const parsePositionString = (value?: string): LatLngValue | null => {
  if (!value || typeof value !== "string") return null;

  if (value.includes(",")) {
    const [latString, lngString] = value.split(",");

    const lat = Number(latString);
    const lng = Number(lngString);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  }

  const match = value.match(
    /^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/
  );

  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
};

const formatPositionString = (
  lat: number,
  lng: number
): string => {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
};

const CustomMapField: React.FC<CustomMapFieldProps> = ({
  name,
  label,
  zoom = 14,
  styles,
  labelStyle,
  disabled = false,
}) => {
  const [field, , { setValue, setTouched }] =
    useField<string>(name);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    NominatimSearchResult[]
  >([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [searchError, setSearchError] = useState<string | null>(
    null
  );

  const [locationError, setLocationError] = useState<
    string | null
  >(null);

  const initialLocationRequestedRef = useRef(false);
  const lastSearchAtRef = useRef(0);

  const searchCacheRef = useRef(
    new Map<string, NominatimSearchResult[]>()
  );

  const currentPos = parsePositionString(field.value);

  const setPosition = useCallback(
    (
      lat: number,
      lng: number,
      touched = true
    ) => {
      setValue(formatPositionString(lat, lng));

      if (touched) {
        setTouched(true);
      }
    },
    [setTouched, setValue]
  );

  useEffect(() => {
    if (field.value || disabled) return;

    if (initialLocationRequestedRef.current) return;

    if (!navigator.geolocation) return;

    initialLocationRequestedRef.current = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue(
          formatPositionString(
            position.coords.latitude,
            position.coords.longitude
          )
        );
      },
      () => {
        setLocationError(
          "تعذر الحصول على موقعك. يمكنك البحث عن الموقع يدوياً."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [disabled, field.value, setValue]);

  const handleLocateMe = () => {
    if (disabled) return;

    if (!navigator.geolocation) {
      setLocationError("المتصفح لا يدعم تحديد الموقع.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition(
          position.coords.latitude,
          position.coords.longitude
        );

        setLocationError(null);
        setIsLocating(false);
      },
      () => {
        setLocationError(
          "تعذر الحصول على موقعك. تأكد من السماح بصلاحية الموقع."
        );

        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSearch = async () => {
    if (disabled) return;

    const query = searchQuery.trim();

    if (!query) return;

    const cachedResults = searchCacheRef.current.get(
      query.toLowerCase()
    );

    if (cachedResults) {
      setSearchResults(cachedResults);
      setSearchError(
        cachedResults.length === 0
          ? "لم يتم العثور على نتائج."
          : null
      );

      return;
    }

    const now = Date.now();

    if (now - lastSearchAtRef.current < 1000) {
      return;
    }

    lastSearchAtRef.current = now;

    setIsSearching(true);
    setSearchError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        limit: "5",
        "accept-language": "ar",
      });

      const endpoint =
        "https://nominatim.openstreetmap.org/search";

      const response = await fetch(
        `${endpoint}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const results =
        (await response.json()) as NominatimSearchResult[];

      searchCacheRef.current.set(
        query.toLowerCase(),
        results
      );

      setSearchResults(results);

      if (results.length === 0) {
        setSearchError("لم يتم العثور على نتائج.");
      }
    } catch {
      setSearchResults([]);
      setSearchError("حدث خطأ أثناء البحث عن الموقع.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (
    result: NominatimSearchResult
  ) => {
    const lat = Number(result.lat);
    const lng = Number(result.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    setPosition(lat, lng);

    setSearchQuery(result.display_name);
    setSearchResults([]);
    setSearchError(null);
    setLocationError(null);
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

      <div className="space-y-2 rounded-xl border border-gray-200 bg-reversed p-2 shadow-sm">
        <div className="relative flex items-start gap-2">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  const value = event.target.value;

                  setSearchQuery(value);

                  if (!value.trim()) {
                    setSearchResults([]);
                    setSearchError(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="ابحث عن عنوان أو موقع..."
                disabled={disabled || isSearching}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-20 pr-9 text-xs focus:border-blue-500 focus:bg-reversed focus:outline-none disabled:opacity-50"
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={
                  disabled ||
                  isSearching ||
                  !searchQuery.trim()
                }
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded-md px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching ? "بحث..." : "بحث"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-[1000] mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    onClick={() =>
                      handleSelectSearchResult(result)
                    }
                    className="flex w-full items-start gap-2 border-b border-gray-100 px-3 py-3 text-right text-xs transition last:border-b-0 hover:bg-gray-50"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                    <span className="leading-5 text-gray-700">
                      {result.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={disabled || isLocating}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 bg-reversed px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="موقعي الحالي"
          >
            <Navigation className="h-3.5 w-3.5 text-blue-600" />

            <span className="hidden sm:inline">
              {isLocating ? "جاري التحديد..." : "موقعي"}
            </span>
          </button>
        </div>

        {searchError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {searchError}
          </div>
        )}

        {locationError && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
            {locationError}
          </div>
        )}

        {currentPos ? (
          <div className="relative overflow-hidden rounded-lg border border-gray-200">
            <LeafletMap
              position={currentPos}
              zoom={zoom}
              disabled={disabled}
              onChange={setPosition}
            />
          </div>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 text-center">
            <MapPin className="h-8 w-8 text-gray-400" />

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                لم يتم تحديد الموقع بعد
              </p>

              <p className="text-xs text-gray-500">
                ابحث عن موقع أو استخدم زر موقعي الحالي
              </p>
            </div>
          </div>
        )}

        {currentPos && (
          <div className="flex items-center gap-2 px-1 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-red-500" />

            <span>
              الموقع المحدد:{" "}
              <strong className="text-gray-800">
                {field.value}
              </strong>
            </span>
          </div>
        )}
      </div>

      <ErrorMessage name={name}>
        {(msg) => <TextError msg={msg} />}
      </ErrorMessage>
    </div>
  );
};

export default CustomMapField;