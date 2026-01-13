# Ownership Token Index

A TanStack Start application with React, TypeScript, Tailwind CSS, and shadcn/ui.

## Getting Started

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

## Building For Production

```bash
pnpm build
```

## Testing

This project uses Vitest for testing:

```bash
pnpm test
```

## Styling

This project uses Tailwind CSS v4 for styling.

## Linting & Formatting

This project uses Biome for linting and formatting:

```bash
pnpm lint      # Run linter
pnpm format    # Format code
pnpm check     # Lint and format with auto-fix
```

## shadcn/ui

Add components using shadcn:

```bash
pnpm dlx shadcn@latest add button
```

## Routing

This project uses TanStack Router with file-based routing. Routes are managed as files in `src/routes/`.

### Adding A Route

Add a new file in `./src/routes/` directory. TanStack will automatically generate the route configuration.

### Adding Links

Use the `Link` component for SPA navigation:

```tsx
import { Link } from "@tanstack/react-router"

<Link to="/about">About</Link>
```

### Using A Layout

The layout is in `src/routes/__root.tsx`. Content appears where `<Outlet />` is used:

```tsx
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
    </>
  ),
})
```

## Data Fetching

Use TanStack Router's loader functionality to load data before rendering:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people")
    return response.json()
  },
  component: () => {
    const data = peopleRoute.useLoaderData()
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    )
  },
})
```

See [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading) for more.

## Learn More

- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Biome](https://biomejs.dev)

Aragon ©2026
