/**
 * Type representing an object with string keys and any values
 */
export type AnyObject = Record<string, any>;

/**
 * Configuration options for the simpleMap function
 */
export type SimpleMapOptions = {
  exclude?: string[];
  transforms?: Record<string, (value: any) => any>;
  fieldMappings?: Record<string, string>;
  deep?: boolean;
}; 