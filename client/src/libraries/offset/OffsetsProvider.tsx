"use client";

import React, { createContext, useContext, useState } from "react";
import { wait } from "@/utils/helpers";
import {
  OffsetContextProps,
  OffsetProviderProps,
  UpdateOffsetUnitProcess,
  OffsetUnit,
  QueryKey
} from "./types";

const OffsetContext = createContext<OffsetContextProps | undefined>(undefined);

const isOffsetUnit = (value: unknown): value is OffsetUnit => {
  return value instanceof Map;
};

export const OffsetProvider = ({ children }: OffsetProviderProps): React.JSX.Element => {
  const [offsetUnit, setOffsetUnit] = useState<OffsetUnit>(new Map());

  const setOffsetUnitMap = (keys: QueryKey[], value: number) => {
    setOffsetUnit((prev: OffsetUnit) => {
      // Cloned the outer Map to maintain immutable state updates in React
      const newState: OffsetUnit = new Map(prev);
      let current: OffsetUnit = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const next = current.get(key);

        if (isOffsetUnit(next)) {
          const nextCopy = new Map(next);
          current.set(key, nextCopy);
          current = nextCopy;
        } else {
          const newMap = new Map();
          current.set(key, newMap);
          current = newMap;
        }
      }

      current.set(keys[keys.length - 1], value);

      return newState;
    });
  };

  const getOffsetUnitValue = (keys: QueryKey[]): number => {
    if (!keys.length) return 0;

    let current: QueryKey | OffsetUnit | undefined = offsetUnit;

    for (const key of keys) {
      if (isOffsetUnit(current)) {
        current = current.get(key);
      } else {
        return 0;
      }
    }

    if (typeof current === "number") {
      return current;
    }

    if (typeof current === "string") {
      const parsed = Number(current);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  const updateOffsetUnit = (keys: QueryKey[], process: UpdateOffsetUnitProcess) => {
    const prevValue = getOffsetUnitValue(keys);
    const step = process === UpdateOffsetUnitProcess.UP ? 1 : -1;
    const value = prevValue + step;

    setOffsetUnitMap(keys, value);
  };

  const resetOffsetUnit = async (keys: QueryKey[]) => {
    setOffsetUnitMap(keys, 0);
    await wait(100);
  };

  return (
    <OffsetContext.Provider
      value={{
        updateOffsetUnit,
        getOffsetUnit: getOffsetUnitValue,
        resetOffsetUnit
      }}
    >
      {children}
    </OffsetContext.Provider>
  );
};

export const useOffsetContext = () => {
  const CONTEXT = useContext(OffsetContext);
  if (!CONTEXT) {
    throw new Error("useOffsetContext must be used within an OffsetProvider");
  }
  return CONTEXT;
};

export default OffsetProvider;
