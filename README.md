# Modular Form Creator

Frontend for a Resources Management application, built with React, React Router,
styled-components, and TypeScript on Vite. The task brief is in `TASK.md` and the
backend rules are in `backend/README.md`; this file covers how to run the project
and the approach I took.

## Approach and key decisions

- I kept dependencies deliberately minimal. The only runtime libraries are React,
  React DOM, React Router, and styled-components. Nothing else was added.
- There is no data-fetching library. Data access is a small typed client over the
  native `fetch` API, with server state handled by custom hooks that refetch
  after mutations so the backend stays authoritative.
- Business rules are mirrored on the client only to gate the interface (enabling
  actions, showing completeness). The backend still enforces everything; the
  client never bypasses or fakes it.
- Tests add no new packages. Unit tests for the domain rules and API client run
  in Node and stub the global `fetch` with Vitest's built-in mocking. Component
  tests are written as Storybook stories with `play` functions, reusing the
  Storybook and Vitest browser tooling already in the project.
- The app is containerized for both development and production without changing
  any backend contract.

## Conventions

Formatting follows Prettier and is authoritative: single quotes, no semicolons,
trailing commas, print width 90. TypeScript is strict, so type-only imports use
`import type`, unused locals and parameters are not allowed, and runtime enums and
namespaces are avoided in favor of union types and `const` objects. The
`backend/` and `src/design-system/` directories are treated as read-only.
`npm run build` and `npm run lint` must both pass cleanly.

## Running locally

Requires Node.js 20 or newer.

    npm install
    npm run dev        # serves the app at http://localhost:5173

The backend base URL comes from VITE_API_URL and defaults to
http://localhost:5001 (already set in .env).

Other useful scripts:

    npm run build      # type-check and production build
    npm run preview    # preview the production build
    npm run lint       # lint the project
    npm run storybook  # design system at http://localhost:6006

## Testing

    npm test           # unit tests (domain + API client), Node environment
    npm run test:watch # the same in watch mode

Component tests run in a real browser via the Storybook and Vitest integration,
which uses Playwright as the browser provider:

    npx playwright install chromium   # one-time browser download, not a dependency
    npx vitest run --project storybook

## Running with Docker

The frontend is published on host port 5173 in every mode, matching the backend's
allowed origin. Because the browser runs on the host, it reaches the backend at
http://localhost:5001.

Development stack (frontend, backend, MongoDB) with one command:

    docker compose up -d --build

Production stack, with the frontend built and served by nginx:

    docker compose -f docker-compose.prod.yml up -d --build

Stop a stack with `docker compose down` (add `-f docker-compose.prod.yml` for the
production one).

If you are already running `npm run dev` locally it also binds port 5173 and can
shadow the container at http://localhost:5173; use http://127.0.0.1:5173 or stop
the local server to be sure you are hitting Docker.
