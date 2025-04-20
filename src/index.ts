export * from "./types";

/**
 * A lightweight utility for mapping object properties between different shapes
 */

import { AnyObject, SimpleMapOptions } from "./types";

/**
 * Maps properties from a source object to a target object with support for
 * field exclusions, custom transformations, and field name mappings.
 *
 * @param source The source object to map from
 * @param options Configuration options for the mapping
 * @param options.exclude Array of field names to exclude from mapping
 * @param options.transforms Object containing custom transformation functions for specific fields
 * @param options.fieldMappings Object mapping source field names to target field names
 * @returns A new object with the mapped fields
 *
 * @example
 * const result = simpleMap<Source, Target>(sourceObject, {
 *   exclude: ['internalId'],
 *   transforms: {
 *     date: (value) => new Date(value),
 *     amount: (value) => parseFloat(value)
 *   },
 *   fieldMappings: {
 *     full_name: 'name',
 *     user_id: 'id'
 *   }
 * });
 */
export function simpleMap<T extends AnyObject, R extends AnyObject>(
  source: T,
  options: SimpleMapOptions = {}
): R {
  const {
    exclude = [],
    transforms = {},
    fieldMappings = {},
  } = options;

  const result = {} as R;

  for (const sourceKey in source) {
    if (Object.prototype.hasOwnProperty.call(source, sourceKey)) {
      if (exclude.includes(sourceKey)) continue;

      const targetKey =
        Object.entries(fieldMappings).find(
          ([_, value]) => value === sourceKey
        )?.[0] || sourceKey;
      const value = source[sourceKey];

      if (transforms && targetKey in transforms) {
        (result as any)[targetKey] = transforms[targetKey](
          cloneValue(value)
        );
      } else {
        (result as any)[targetKey] = cloneValue(value);
      }
    }
  }

  return result;
}

/**
 * Deep clones a value, detecting circular references
 * @param value The value to clone
 * @param seen A WeakSet to track seen objects for circular reference detection
 * @returns A deep clone of the value
 * @throws Error if a circular reference is detected
 */
function cloneValue(value: unknown, seen = new WeakSet()): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    throw new Error("Circular reference detected during deep cloning");
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item, seen));
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  const result: AnyObject = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = cloneValue((value as AnyObject)[key], seen);
    }
  }
  return result;
}
