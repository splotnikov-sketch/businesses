export interface ICache {
  connect(): Promise<void>
  get(key: string): Promise<string | undefined>
  set(key: string, value: string, expireAfter: number): Promise<void>
  close(): Promise<void>
}
