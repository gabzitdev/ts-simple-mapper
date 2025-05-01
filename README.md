# ts-simple-mapper

> **A super lightweight, dead-simple TypeScript utility for data mapping.**
> 
> - Focused solely on data mapping—nothing less, nothing more.
> - No decorators, no classes, no build steps, no dependencies.
> - Just a function and a plain object for configuration—easy to learn, easy to use.

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
  internalId: '123',
  full_name: 'John Doe',
  user_id: '456',
  email_address: 'john@example.com',
  birthDate: '1990-01-01',
  amount: '100.50',
};

const result = simpleMap<Source, Target>(source, {
  exclude: ['internalId'],
  transforms: {
    birthDate: value => new Date(value),
    amount: value => parseFloat(value),
  },
  fieldMappings: {
    full_name: 'name',
    user_id: 'id',
    email_address: 'email',
  },
});

// Result:
// {
//   name: "John Doe",
//   id: "456",
//   email: "john@example.com",
//   birthDate: Date("1990-01-01"),
//   amount: 100.50
// }

// Example with nested transforms
const source = {
  id: 1,
  nested: {
    value: 5,
    untouched: 10,
  },
  top: 'keep',
};

const result = simpleMap<typeof source, any>(source, {
  transforms: {
    nested: {
      value: (v: number) => v * 10,
    },
  },
});
// result:
// {
//   id: 1,
//   nested: { value: 50, untouched: 10 },
//   top: 'keep'
// }

// You can nest transforms to any depth:
const source = {
  a: {
    b: {
      c: 2,
      d: 3,
    },
  },
  untouched: 1,
};

const result = simpleMap<typeof source, any>(source, {
  transforms: {
    a: {
      b: {
        c: (v: number) => v + 1,
      },
    },
  },
});
// result:
// {
//   a: { b: { c: 3, d: 3 } },
//   untouched: 1
// }
```

## API

### `simpleMap<Source, Target>(source: Source, options?: MapOptions): Target`

Maps properties from a source object to a target object with support for field exclusions, custom transformations, and field name mappings.

#### Parameters

- `source`: The source object to map from
- `options`: Optional configuration for the mapping process

#### Options

```typescript
interface MapOptions {
  exclude?: string[]; // Fields to exclude from mapping
  transforms?: Record<string, Function>; // Custom transformation functions
  fieldMappings?: Record<string, string>; // Source to target field name mappings
}
```

#### Type Parameters

- `Source`: The type of the source object
- `Target`: The type of the target object

## Features

- Type-safe mapping with TypeScript
- Custom transformations
- Field name mapping
- Null and undefined handling
- Circular reference detection and prevention
- Exclude fields from mapping with the `exclude` option

## Release Process

This project uses [semantic-release](https://semantic-release.gitbook.io/) for fully automated versioning, changelog generation, npm publishing, and GitHub releases.

### How it works
- Every push to the `main` branch triggers an automated release workflow.
- The next version is determined from commit messages using the [Conventional Commits](https://www.conventionalcommits.org/) standard.
- The changelog and package version are automatically updated.
- The package is published to npm and a GitHub release is created.

### Commit Message Guidelines
To trigger the correct release type, use these Conventional Commit prefixes:

- `feat:` — for new features (triggers a minor version bump)
- `fix:` — for bug fixes (triggers a patch version bump)
- `BREAKING CHANGE:` — in body or footer for breaking changes (triggers a major version bump)
- `chore:`, `docs:`, `test:`, etc. — for non-release changes

**Examples:**
```sh
feat: add support for nested transforms
fix: handle circular references in deep clones
chore: update dependencies
```

No manual versioning or changelog editing is needed—just follow the commit message convention and semantic-release handles the rest!

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
