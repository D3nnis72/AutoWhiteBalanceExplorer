# Auto White Balance Explorer - Frontend

Frontend for the Interactive Auto White Balance Explorer.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** (via shadcn/ui components)
- **React Hooks** for state management

## Project Structure

- `src/app/` - Next.js pages and routes
- `src/components/` - React components
  - `layout/` - Layout components (Header, Footer, AppShell)
  - `ui/` - UI primitives (Button, Card, Select, Slider)
  - `whiteBalance/` - Feature components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities and helpers
- `src/styles/` - Global styles

