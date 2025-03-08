# Memorja

A Chrome extension for remembering conversations across the web.

## Getting Started

This project uses Turborepo to manage the monorepo structure and pnpm as the package manager.

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
# Run all packages in development mode
pnpm dev

# Run specific package
pnpm dev --filter=@memorja/extension
```

### Build

```bash
pnpm build
```

## Project Structure

- `apps/extension`: Chrome extension
- `apps/server`: backend server
- `packages/database`: Database schema and client
- `packages/utils`: Shared utilities
- `packages/ui`: Shared UI components
- `packages/config`: Shared configurations (ESLint, TypeScript, etc.)
