export type QueryKey = string | number | Record<string, unknown> | object;

export type OffsetUnit = Map<QueryKey, QueryKey | OffsetUnit>;

export enum UpdateOffsetUnitProcess {
  UP = "UP",
  DOWN = "DOWN"
}

export type OffsetContextProps = {
  updateOffsetUnit: (keys: QueryKey[], process: UpdateOffsetUnitProcess) => void,
  getOffsetUnit: (keys: QueryKey[]) => number,
  resetOffsetUnit: (keys: QueryKey[]) => Promise<void>
}

export type OffsetProviderProps = {
  children: React.ReactNode
}