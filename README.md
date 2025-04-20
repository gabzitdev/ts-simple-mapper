# ts-simple-mapper

A lightweight utility for mapping object properties between different shapes in TypeScript.

## Installation

```bash
npm install ts-simple-mapper
```

## Usage

```typescript
import { simpleMap } from 'ts-simple-mapper';

// Define types
interface Source {
  internalId: string;
  full_name: string;
  user_id: string;
  email_address: string;
  birthDate: string;
  amount: string;
}

interface Target {
  name: string;
  id: string;
  email: string;
  birthDate: Date;
  amount: number;
}

// Example with multiple features
const source: Source = {
  internalId: "123",
  full_name: "John Doe",
  user_id: "456",
  email_address: "john@example.com",
  birthDate: "1990-01-01",
  amount: "100.50"
};

const result = simpleMap<Source, Target>(source, {
  exclude: ['internalId'],
  transforms: {
    birthDate: (value) => new Date(value),
    amount: (value) => parseFloat(value)
  },
  fieldMappings: {
    full_name: 'name',
    user_id: 'id',
    email_address: 'email'
  }
});

// Result:
// {
//   name: "John Doe",
//   id: "456",
//   email: "john@example.com",
//   birthDate: Date("1990-01-01"),
//   amount: 100.50
// }
```

## API

### `simpleMap<Source, Target>(source: Source, options?: SimpleMapOptions): Target`

Maps properties from a source object to a target object with support for field exclusions, custom transformations, and field name mappings.

#### Parameters

- `source`: The source object to map from
- `options`: Optional configuration for the mapping process

#### Options

```typescript
interface SimpleMapOptions {
  exclude?: string[];                    // Fields to exclude from mapping
  transforms?: Record<string, Function>; // Custom transformation functions
  fieldMappings?: Record<string, string>; // Source to target field name mappings
}
```

#### Type Parameters

- `Source`: The type of the source object
- `Target`: The type of the target object

## Features

- Type-safe mapping with TypeScript
- Field exclusion
- Custom transformations
- Field name mapping
- Null and undefined handling

## Future Features

The following features are not currently supported but may be added in future versions:

- Nested transforms: Apply transformations to nested object properties
  ```typescript
  // Example of potential future nested transforms
  const nestedTransform = simpleMap<Source, Target>(source, {
    transforms: {
      // Using dotted notation
      'nested.property': (value) => transformValue(value),
      // OR using nested object notation
      nested: {
        property: (value) => transformValue(value)
      }
    }
  });
  ```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build
```

## License

MIT 