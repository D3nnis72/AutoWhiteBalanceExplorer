Here is a version you can basically hand in as the official project description.

---

## Project 1, Interactive Auto White Balance Explorer

### 1. Goal

Build an interactive web experience that lets users upload a photo and visually explore how different auto white balance algorithms change the image. The focus is on:

- understanding and comparing the algorithms,
- correctly handling linear RGB versus gamma corrected RGB (sRGB),
- creating a visual wow effect through smooth, intuitive interaction.

---

### 2. Functional requirements

1. **Image upload and basic workflow**

   - The website allows users to upload at least one image from disk (JPEG or PNG).
   - After upload, the original image is shown immediately.
   - Users can choose which white balance algorithm to apply and which color space to process in.
   - The frontend communicates with the backend API (`POST /white-balance/apply`) to process images.
   - The site displays the processed result so that differences are clearly visible.

2. **Comparison views**

   Implement at least two of the following comparison options:

   - Side by side view: original image on the left, processed image on the right.
   - Split view slider: a draggable vertical slider where one side shows the original and the other side shows the corrected image on the same canvas.
   - Comparison grid: original image plus each algorithm result shown in a grid for instant visual comparison.

---

### 3. Algorithmic requirements

1. **White balance algorithms**

   Implement at least two automatic white balance algorithms, for example:

   - Grey world assumption:

     - Assumes that the average scene color should be neutral grey.

   - White patch:

     - Uses the brightest region in the image as reference white.

   - Grey edge:

     - Uses edge information and gradient statistics to estimate white.

   It is recommended to implement all three (grey world, white patch, grey edge) if time permits, to enable richer comparison.

2. **Algorithm selection**

   - Users can select which algorithm to apply from a control panel (for example a dropdown or radio buttons).
   - The currently active algorithm is clearly indicated in the UI.
   - The interface should make it easy to switch algorithms and instantly see how the result changes.

---

### 4. Color space and linear RGB handling

This project must explicitly address the question of applying white balance in linear versus gamma corrected RGB.

1. **Input images**

   - Assume uploaded images are in sRGB color space by default.

2. **Processing spaces**

   The system must support at least:

   - Processing directly in gamma corrected RGB (sRGB values as they come from the image).
   - Processing in linear RGB (values proportional to light intensity).

3. **Pre processing**

   - If the user selects processing in linear RGB and the input is sRGB:

     - Convert from sRGB to linear RGB before applying the white balance algorithm.

   - If the user selects processing in gamma corrected RGB:

     - You may process the sRGB values directly, but this choice and its implications should be made explicit in the explanation.

4. **Post processing**

   - After applying the white balance algorithm in linear RGB:

     - Convert the result back to sRGB for correct display in the browser.

   - Ensure that values are clamped or otherwise handled to stay within the valid displayable range.

5. **User control and indication**

   - Provide a control that lets the user choose the processing space:

     - Example options: "Process in linear RGB" and "Process in sRGB (gamma corrected)".

   - Clearly indicate in the UI which processing mode is currently active.
   - Ideally, allow comparison between:

     - The same algorithm in linear RGB versus in gamma corrected RGB, for the same image.

---

### 5. Wow effect and interaction requirements

To create a wow effect, implement at least two of the following advanced interaction or visualization features.

1. **Split view slider**

   - A smooth, draggable slider that reveals the original image on one side and the white balanced image on the other.
   - The transition should be visually smooth so users can literally see the color cast being corrected while moving the slider.

2. **Algorithm comparison grid**

   - Display original image plus all implemented algorithms in a grid layout.
   - Each cell is labeled with the algorithm name and processing mode (for example "Grey world, linear RGB").

3. **Pixel inspector**

   - When the user hovers or clicks on a point in the image, show:

     - RGB values before white balance.
     - RGB values after white balance.
     - Optionally a simple label like "warmer" or "cooler" or an approximate color temperature.

4. **Dynamic visual statistics**

   - Show simple statistics that update when algorithms or modes change, for example:

     - Average R, G, B channel values before and after.
     - Per channel histograms before and after (even very simple ones).

   - These should help explain why the image looks more neutral after balancing.

5. **Animated transitions**

   - When switching algorithms or processing modes, blend smoothly from the old result to the new result instead of a hard jump.
   - This makes it intuitively visible how different assumptions change the color balance.

---

### 6. Explanatory and educational elements

The website should not just show results, but also explain what is happening.

1. **Short algorithm explanations**

   For each implemented algorithm, show a short explanation near the controls, for example:

   - Grey world:

     - "Assumes that the average color over the whole image should be neutral grey, adjusts each channel so that the mean becomes grey."

   - White patch:

     - "Uses the brightest patch in the image as reference white and scales the channels so that this patch becomes white."

   - Grey edge:

     - "Uses edges and gradients to estimate the illumination color from local contrast instead of global averages."

2. **Color space explanation**

   - Provide a concise explanation of:

     - What linear RGB is.
     - What gamma corrected sRGB is.

   - Explicitly mention why it might be more correct to apply white balance in linear RGB.

3. **Processing mode highlight**

   - Make it visually clear which combination is currently active, for example:

     - "Grey world, linear RGB" versus "Grey world, sRGB".

   - Encourage the user to try both and see differences.

---

### 7. Technical constraints and architecture

- The project must be implemented as a web application with a clear separation between frontend and backend.

- **Frontend architecture**

  - Built with **Next.js** (App Router), **TypeScript**, **shadcn/ui**, and **Tailwind CSS**.
  - Follow a clean component structure:
    - Pages are minimal and wire high level containers.
    - Feature components (for example `WhiteBalanceExplorer`) orchestrate data flow and compose sub components.
    - Presentational components (for example `ComparisonSplitView`, `ComparisonGrid`) receive data via props and handle only visual logic.
    - Reusable UI primitives wrap shadcn components for consistent design.
  - Use React hooks for state management and API communication:
    - `useExplorerState` centralizes UI state for the explorer.
    - `useWhiteBalanceApi` handles backend communication.
    - `useImageUpload` manages file selection and preview URLs.
  - Folder structure should follow Next.js App Router conventions with clear separation:
    - `src/app/` for pages and routes.
    - `src/components/` organized into `layout/`, `ui/`, and `whiteBalance/`.
    - `src/hooks/` for custom React hooks.
    - `src/lib/` for utilities like API client and image helpers.

- **Backend architecture**

  - Built with **Python 3.11+**, **FastAPI**, **PyTorch**, **Pillow**, and **Pydantic**.
  - Follow a clean layered architecture:
    - **API layer** (`app/api/`): Defines HTTP endpoints, validates requests via Pydantic models, returns responses. No algorithmic logic.
    - **Service layer** (`app/services/`): Orchestrates engine calls, handles file to tensor conversions, manages color space transformations (sRGB to linear and back).
    - **Engine layer** (`app/engine/`): Contains pure PyTorch functions that implement white balance algorithms. No FastAPI, HTTP, or file system dependencies. Functions operate on tensors with shape `(C, H, W)` and values in `[0, 1]`.
    - **Models layer** (`app/models/`): Shared enums (`WhiteBalanceAlgorithm`, `ColorSpace`), DTOs, and Pydantic request/response schemas.
    - **Core layer** (`app/core/`): Application configuration, logging, error handling.
  - Endpoint: `POST /white-balance/apply` accepts `multipart/form-data` with image file and parameters (`algorithm`, `input_color_space`, `processing_space`).
  - Returns JSON with processed image as base64 and optional metadata (average RGB, histograms).

- **Algorithm implementation**

  - No external white balance algorithm library should be used as a black box. The core algorithmic logic for grey world, white patch, grey edge, and any additional algorithms must be implemented by you so that their behavior is understandable and explainable.
  - Algorithms should be implemented as pure functions in the engine layer, accepting and returning PyTorch tensors.

---

### 8. Deliverables

- A running website that:

  - Accepts image uploads.
  - Applies at least two auto white balance algorithms.
  - Lets users choose between processing in linear RGB and gamma corrected RGB for sRGB images, including correct pre and post processing.
  - Provides at least two wow effect features from section 5.
  - Explains algorithms and color space choices in an understandable way.
  - Follows the frontend and backend architecture guidelines specified in section 7.

- Code that demonstrates:

  - Clean separation of concerns (thin pages, orchestration in containers, presentational components).
  - Proper use of React hooks for state and API communication.
  - Layered backend architecture (API, service, engine, models, core).
  - Pure engine functions with clear tensor interfaces.
  - Type safety with TypeScript (frontend) and type hints (backend).

- A short written summary (or short text on the site) that:

  - Describes which algorithms you implemented.
  - Explains how you handle sRGB to linear RGB conversion and back.
  - Reflects on differences you observed between processing in linear versus gamma corrected RGB.

---

### 9. Additional algorithm suggestions

Which extra algorithms are realistic and valuable for your project

If we filter for:

implementable in a reasonable amount of time,

good for visual comparison,

good for explaining linear RGB vs sRGB,

I would suggest this set for a strong "wow" demo:

Grey world
Baseline, simple, good for teaching.

White patch, robust variant with percentile
Nice contrast to grey world.

Shades of gray
Single parameter p that interpolates between grey world and white patch. Great UI slider.

Retinex inspired method
Gives a very different visual look, nice to show non linear methods.

If you have time, chromatic adaptation in XYZ with estimated illuminant
Good link to color science.

Then you can have a UI like:

Algorithm dropdown

Grey world

White patch

Shades of gray

Retinex

Chromatic adaptation

For shades of gray and grey edge, a p slider.

For Retinex, a "scale" slider controlling blur radius.

For each algorithm, options:

process in sRGB directly,

process in linear RGB (with correct sRGB to linear conversion and back).
