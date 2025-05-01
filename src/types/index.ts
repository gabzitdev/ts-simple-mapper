/**
 * Type representing an object with string keys and any values
 */
export type AnyObject = Record<string, any>;

/**
 * Configuration options for the simpleMap function
 */
export type MapOptions<T = any> = {
  exclude?: string[];
  transforms?: { [K in keyof T]?: Transform<T[K]> };
  fieldMappings?: Record<string, string>;
  deep?: boolean;
};

export type Transform<T> =
  | ((value: T) => any)
  | (T extends object ? { [K in keyof T]?: Transform<T[K]> } : never);
