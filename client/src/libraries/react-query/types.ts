import { ID } from "@/types/global";
import { UseMutationOptions } from "@tanstack/react-query"

export type MutationProps<TData = unknown, TError = unknown, TVariables = void, TContext = unknown> = {
  onSuccess?: UseMutationOptions<TData, TError, TVariables, TContext>["onSuccess"];
  onError?: UseMutationOptions<TData, TError, TVariables, TContext>["onError"];
}

export type MutationFnType = Promise<APIResponse<unknown>>

export type APIResponse<T> = {
  message: string,
  success: boolean,
  data: T
}

type PaginatedData<T> = {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  nextPage?: number;
};

export type PaginationResponse<T> = APIResponse<PaginatedData<T>>;

export type InfiniteData<T> = {
  items: T[],
  hasMore: boolean,
  limit: number,
  page: number,
  total: number,
  totalPages: number
}

export type InfinityResponse<PageType> = {
  pages: APIResponse<InfiniteData<PageType>>[];
  pageParams: number[];
};

export type QueryKey = string | number

export type ReactQueryProviderProps = {
  children: React.ReactNode
}

export type UpdateItemType<T> = {
  id: ID,
  data: Partial<T>
}

export type UpdateItemWithFormData = {
  id: ID,
  data: FormData
}
