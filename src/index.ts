/**
 * A lightweight utility for mapping object properties between different shapes
 */

/**
 * Maps properties from a source object to a target object with support for
 * field exclusions, custom transformations, and field name mappings.
 * 
 * @param options Configuration options for the mapping
 * @param options.exclude Array of field names to exclude from mapping
 * @param options.transforms Object containing custom transformation functions for specific fields
 * @param options.fieldMappings Object mapping source field names to target field names
 * @param options.deep Whether to perform deep cloning of objects
 * @returns A function that takes a source object and returns a new object with the mapped fields
 * 
 * @example
 * const map = simpleMap<Source, Target>({
 *   exclude: ['internalId'],
 *   transforms: {
 *     date: (value) => new Date(value),
 *     amount: (value) => parseFloat(value)
 *   },
 *   fieldMappings: {
 *     full_name: 'name',
 *     user_id: 'id'
 *   },
 *   deep: true
 * });
 * 
 * const result = map(sourceObject);
 */
export function simpleMap<T extends Record<string, any>, R extends Record<string, any>>(
  options: {
    exclude?: string[];
    transforms?: Record<string, (value: any) => any>;
    fieldMappings?: Record<string, string>;
    deep?: boolean;
  } = {}
): (source: T) => R {
  const { exclude = [], transforms = {}, fieldMappings = {}, deep = false } = options;

  const cloneValue = (value: any): any => {
    if (!deep || value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(cloneValue);
    }

    if (value instanceof Date) {
      return new Date(value);
    }

    const result = {} as any;
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = cloneValue(value[key]);
      }
    }
    return result;
  };
  
  return (source: T) => {
    const result = {} as R;

    for (const sourceKey in source) {
      if (Object.prototype.hasOwnProperty.call(source, sourceKey)) {
        if (exclude.includes(sourceKey)) continue;
        
        const targetKey = Object.entries(fieldMappings).find(([_, value]) => value === sourceKey)?.[0] || sourceKey;
        const value = source[sourceKey];
        if (transforms && targetKey in transforms) {
          (result as any)[targetKey] = transforms[targetKey](cloneValue(value));
        } else {
          (result as any)[targetKey] = cloneValue(value);
        }
      }
    }
    
    return result;
  };
} 