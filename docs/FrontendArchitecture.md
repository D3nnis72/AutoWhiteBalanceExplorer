Here is a `FrontendArchitecture.md` you can drop straight into your repo and tweak.

---

# Frontend Architecture, Auto White Balance Explorer

Frontend for the **Interactive Auto White Balance Explorer**.
Built with **Next.js**, **TypeScript**, **shadcn/ui**, and **Tailwind CSS**.
Focus on clean code, reusable components, and a clear separation between layout, UI building blocks, hooks, and data access.

---

## 1. Tech stack

- **Framework**, Next.js (App Router)
- **Language**, TypeScript
- **UI library**, shadcn/ui (Radix based primitives)
- **Styling**, Tailwind CSS
- **State**, Local React state and lightweight context for global settings
- **HTTP client**, native `fetch` with typed helpers
- **Build tooling**, Next build system, no separate bundler needed

---

## 2. High level goals

1. **Wow effect for white balance exploration**

   - Smooth interactions, for example split slider, comparison grid
   - Instant visual feedback when switching algorithms or color spaces

2. **Clean separation of concerns**

   - Pages are minimal, they wire high level containers
   - Containers handle data flow and composition
   - Reusable UI primitives for buttons, sliders, cards, panels

3. **Reusability**

   - Shared components for layout, controls, cards, and visualizations
   - Shared hooks for image upload, algorithm selection, and API calls

4. **Clarity**

   - Code structure should be easy to navigate
   - Names should reflect intent, not implementation detail

---

## 3. Folder structure

Using the Next.js App Router inside `src`:

```text
src/
  app/
    layout.tsx
    page.tsx                     # Landing page, main explorer
    api-schema.md                # Optional, docs for frontend contracts

    white-balance/
      page.tsx                   # Direct route for explorer, /white-balance

  components/
    layout/
      AppShell.tsx
      Header.tsx
      Footer.tsx
      MainContent.tsx

    ui/                          # wrappers around shadcn primitives
      Button.tsx
      Select.tsx
      Slider.tsx
      ToggleGroup.tsx
      Card.tsx
      Tabs.tsx
      Tooltip.tsx

    whiteBalance/
      WhiteBalanceExplorer.tsx        # main container component
      ImageUploadPanel.tsx
      AlgorithmControls.tsx
      ColorSpaceToggle.tsx
      ComparisonSplitView.tsx         # slider, original vs processed
      ComparisonGrid.tsx              # original plus algorithms
      PixelInspector.tsx              # hover info, RGB values
      HistogramPanel.tsx              # optional, per channel histograms
      AlgorithmExplanationPanel.tsx   # short explanations, diagrams

  hooks/
    useWhiteBalanceApi.ts
    useImageUpload.ts
    useExplorerState.ts              # central hook for explorer UI state

  lib/
    apiClient.ts                     # typed fetch helpers
    imageHelpers.ts                  # base64 handling, URL creation
    types.ts                         # shared frontend types, DTOs

  styles/
    globals.css
    shadcn.css                       # generated styles
```

You can adjust naming, but this structure keeps responsibilities clear and discoverable.

---

## 4. Core UI and data flow

### 4.1 User journey

1. User visits `/` or `/white-balance`
2. Sees the **WhiteBalanceExplorer** with

   - upload panel
   - algorithm and color space controls
   - main comparison view

3. User uploads an image
4. Explorer

   - shows the original image
   - calls backend to compute processed versions based on selected algorithm and processing space

5. User interacts with

   - split view slider
   - comparison grid
   - pixel inspector, histograms, explanations

All of this should feel responsive and consistent.

### 4.2 Data flow in the explorer

**Component level**

- `WhiteBalanceExplorer`
  Central container, holds high level UI state and orchestrates children

- `ImageUploadPanel`
  Handles local file selection, calls `useImageUpload`

- `AlgorithmControls`
  Lets user pick algorithm, input color space, processing space

- `ComparisonSplitView` and `ComparisonGrid`
  Only render what they receive through props, no data fetching inside

- `PixelInspector` and `HistogramPanel`
  React to processed results and cursor position

**Hook level**

- `useExplorerState`

  - Holds selected algorithm, selected spaces, current upload
  - Coordinates when to trigger API calls

- `useWhiteBalanceApi`

  - Exposes functions like `applyWhiteBalance(imageFile, params)`
  - Handles backend call and returns processed image data, metadata

- `useImageUpload`

  - Handles file input
  - Extracts preview URL for original image
  - Provides image file for API calls

---

## 5. Component responsibilities

### 5.1 Layout components

`AppShell`, `Header`, `Footer`, `MainContent`

- Contain branding and navigation
- Provide consistent padding, max width, background
- No domain specific logic

### 5.2 UI primitives (wrapping shadcn)

`components/ui/*`

- Thin wrappers around shadcn components with project specific defaults
- Examples

  - `Button`, sets base size, font, radius, variant mapping
  - `Card`, standard padding and shadow for panels
  - `Tabs`, consistent behavior across pages

- No white balance logic here

Purpose, keep design consistent, reduce duplication, and avoid repeating configuration for shadcn components.

### 5.3 White balance feature components

All in `components/whiteBalance`

- `WhiteBalanceExplorer`

  - Top level feature component used in page
  - Uses hooks to access state and data
  - Composes sub components

- `ImageUploadPanel`

  - Uses shadcn `Card`, `Button`, and a drag and drop area
  - Shows selected file name and preview
  - Emits `onImageSelected(file)` to parent

- `AlgorithmControls`

  - Uses `Select`, `ToggleGroup`, maybe `Tabs`
  - Lets user choose:

    - algorithm, grey world, white patch, grey edge
    - input color space, sRGB or linear
    - processing space, linear or gamma corrected

  - Emits `onSettingsChange(settings)` to parent

- `ComparisonSplitView`

  - Receives `originalSrc` and `processedSrc` as props
  - Implements a slider handle
  - Uses a single container with two absolutely positioned images and a clipped overlay
  - Only visual logic, no API calls

- `ComparisonGrid`

  - Receives a map `{ label, imageSrc }[]`
  - Displays original and each algorithm result in a responsive grid
  - Possibly uses `Card` and `Tabs` to switch layouts

- `PixelInspector`

  - Receives precomputed per pixel data or a callback for sampling
  - Shows RGB before and after, maybe a small color swatch

- `AlgorithmExplanationPanel`

  - Simple text and small visuals that show each algorithm idea
  - Might react to selected algorithm to show the right explanation

---

## 6. Hooks

### 6.1 `useExplorerState`

Centralizes UI state for the explorer:

```ts
type ExplorerState = {
  selectedAlgorithm: WhiteBalanceAlgorithm;
  inputColorSpace: ColorSpace;
  processingSpace: ColorSpace;
  originalFile: File | null;
  originalPreviewUrl: string | null;
  processedImage: ProcessedImage | null;
  isProcessing: boolean;
  error: string | null;
};
```

Responsibilities:

- Manage state changes when user uploads images or changes settings
- Trigger processing call when relevant settings change and an image is present
- Expose simple methods like `setAlgorithm`, `setColorSpaces`, `setImage`, `reprocess`

### 6.2 `useWhiteBalanceApi`

Handles communication with the backend:

- Accepts `file` and parameters
- Uses `FormData` for upload
- Calls `/white-balance/apply` with query or body parameters
- Returns:

  - processed image as base64 or URL
  - optional metadata like average RGB, histograms

This hook is a thin wrapper around a typed `apiClient.fetchJson` helper in `lib/apiClient.ts`.

### 6.3 `useImageUpload`

Handles input type `file` and drag and drop:

- Normalizes file selection for both click and drag
- Validates file type and size
- Creates a preview URL with `URL.createObjectURL`
- Cleans up URL on unmount

---

## 7. State management

The project is small, so full global state management is not necessary.

Rules:

- Prefer local state in `WhiteBalanceExplorer` for explorer specific data
- Use React context only for:

  - theme (light, dark)
  - global app configuration (for example API base URL)

- Avoid global stores for algorithm and image state unless the UI grows significantly

If needed later, a small store with Zustand can be added, but initial version should stay simple.

---

## 8. Styling and design

### 8.1 Tailwind baseline

- Use Tailwind for spacing, layout, and responsive design
- Keep utility classes readable
- For repeated patterns, create tiny wrapper components or compose classes with `cn` helper

Example patterns:

- Page container

```tsx
<div className='mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8'>
  {/* content */}
</div>
```

- Section card

```tsx
<Card className='h-full'>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

### 8.2 shadcn usage

- Generate components with shadcn and wrap them in `components/ui` where needed
- Keep a consistent naming scheme:

  - `Button`, `Input`, `Select`, `Tabs`, `Card`, `Tooltip`, `Dialog`

- Avoid importing Radix primitives directly in feature components
- All design tokens and decisions live in Tailwind config and shadcn config themes

---

## 9. Clean code guidelines

1. **Separation of concerns**

   - Pages should be thin
   - Containers orchestrate hooks and components
   - Presentational components only take props and render

2. **Naming**

   - Components named by what they are, `ImageUploadPanel`, `ComparisonSplitView`
   - Hooks named by their purpose, `useExplorerState`, `useWhiteBalanceApi`
   - Avoid vague names like `Helper`, `Stuff`, `DataManager`

3. **Props**

   - Prefer explicit props over generic `props` bags
   - Remove unused props quickly
   - Use TypeScript interfaces and types for clarity

4. **No duplication**

   - Shared UI patterns belong in `components/ui` or small layout components
   - Shared domain logic belongs in hooks or `lib`

5. **Responsiveness**

   - Design and implement mobile first
   - Use CSS grid and flexbox for the comparison views

6. **Error handling**

   - User friendly messages for invalid uploads and failed processing
   - Clear empty states, for example:

     - before upload, show “Upload an image to start exploring”
     - on error, show a retry button

7. **Accessibility**

   - Use accessible shadcn components
   - Ensure all interactive elements are keyboard reachable
   - Provide alt text for images where appropriate

---

This architecture gives you a clear, modern frontend structure that fits Next.js and shadcn, keeps the code clean, and supports the wow interactions for your auto white balance explorer.
