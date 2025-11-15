# Interactive Auto White Balance Explorer

An interactive web application for exploring and comparing different auto white balance algorithms. This tool helps you understand how various white balance correction methods affect image appearance and demonstrates the importance of color space handling in image processing.

![Preview](img/preview.png)

## What is White Balance?

White balance is a crucial image processing technique that corrects color casts caused by different lighting conditions. When you take a photo under incandescent light, fluorescent light, or daylight, the image may appear too warm (yellow/orange) or too cool (blue). White balance algorithms automatically detect and correct these color shifts to make white objects appear truly white, which in turn corrects all other colors in the image.

## Purpose of This Tool

This explorer allows you to:

- **Compare algorithms side-by-side**: See how different white balance methods (Grey World, White Patch, Grey Edge) affect the same image
- **Understand color space impact**: Learn why processing in linear RGB produces more accurate results than sRGB
- **Interactive exploration**: Upload your own images and experiment with different settings in real-time
- **Visual comparison**: Use the split-view slider to precisely compare original and processed images

Perfect for students, photographers, and developers learning about computer vision and image processing techniques.

## Project Structure

```
.
├── backend/          # Python FastAPI backend
│   ├── app/
│   │   ├── api/     # HTTP endpoints
│   │   ├── services/# Business logic
│   │   ├── engine/  # Image processing algorithms
│   │   ├── models/  # Data models
│   │   └── core/    # Configuration and utilities
│   └── tests/       # Test suite
│
├── frontend/        # Next.js frontend
│   ├── src/
│   │   ├── app/     # Next.js pages
│   │   ├── components/
│   │   ├── hooks/   # React hooks
│   │   └── lib/     # Utilities
│   └── public/      # Static assets
│
└── docs/            # Documentation
```

## Quick Start

### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Features

### Core Functionality

- **Image Upload**: Upload JPEG or PNG images via drag-and-drop or file selection
- **Multiple Algorithms**: Compare three different white balance algorithms:
  - **Grey World**: Assumes the average color should be neutral grey, adjusting channels to achieve this
  - **White Patch**: Uses the brightest patch in the image as reference white
  - **Grey Edge**: Estimates illumination color from edges and gradients using local contrast

### Comparison Tools

- **Split View Comparison**: Interactive slider to precisely compare original and processed images side-by-side
- **Algorithm Comparison Grid**: View all processed results simultaneously in a grid layout
- **Click-to-Select**: Click any algorithm result in the grid to view it in the split comparison view

### Advanced Options

- **Color Space Configuration**:
  - **Auto Mode**: Automatically detects sRGB input and processes in linear RGB (recommended)
  - **Manual Mode**: Full control over input and processing color spaces
  - Learn why linear RGB processing produces more accurate results

### User Experience

- **Real-time Processing**: Instant feedback when changing algorithms or settings
- **Visual Feedback**: Selected algorithms are highlighted with clear indicators
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## Technical Details

### Algorithms Explained

1. **Grey World Algorithm**: Based on the assumption that the average color in a scene should be neutral grey. It computes the mean RGB values and scales each channel so the overall average becomes grey.

2. **White Patch Algorithm**: Identifies the brightest pixels in the image (typically representing white or light-colored objects) and uses them as a reference for white balance correction.

3. **Grey Edge Algorithm**: A more sophisticated approach that uses edge information and gradient statistics to estimate the illumination color. It assumes that edges should be neutral (grey) on average, making it more robust to scenes with dominant colors.

### Color Space Handling

The application demonstrates the importance of proper color space handling:

- **sRGB**: Gamma-corrected color space used by displays and most image formats
- **Linear RGB**: Color space where values are proportional to light intensity
- **Why it matters**: White balance algorithms work with light intensities. Processing in linear RGB (after converting from sRGB) produces mathematically correct results, then converts back to sRGB for display.

## Architecture

See the documentation in the `docs/` directory:

- `Prompt.md` - Project requirements
- `FrontendArchitecture.md` - Frontend architecture details
- `PythonArchitecture.md` - Backend architecture details

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, shadcn/ui
- **Backend**: Python 3.11+, FastAPI, PyTorch, Pillow
- **Image Processing**: Custom implementations of white balance algorithms using PyTorch tensors
