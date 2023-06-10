# Typesctipt types generator from OpenApi schema

## Installation

```
npm install @339rama/openapi2types
```

## Usage

From command line

```
npx openapi2types -i swagger.json -o types/generated.ts
```

or by adding in package.json scripts

```
"scripts": {
    ...
    "generate:types": "openapi2types -i swagger.json -o types/generated.ts"
    ...
}
```

and after

```
npm run generate:types
```
