import { useEffect, useRef, useState } from "react";
import { debouncedSearchParams } from "./types";


export const useDebouncedSearch = ({ delay = 450, action }: debouncedSearchParams) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      actionRef.current?.();
    }, delay);

    return () => clearTimeout(handler);
  }, [search, delay]);

  return { search, setSearch, debouncedSearch };
};