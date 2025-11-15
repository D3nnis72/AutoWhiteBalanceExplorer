# Auto White Balance Explorer - Backend

Backend API for the Interactive Auto White Balance Explorer.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

API documentation is available at `http://localhost:8000/docs`.

## Environment Variables

Create a `.env` file in the backend directory:

```env
DEBUG=false
API_V1_PREFIX=/api/v1
CORS_ORIGINS=["http://localhost:3000"]
```

## API Endpoints

- `POST /api/v1/white-balance/apply` - Apply white balance algorithm to an image
  - Query parameters:
    - `algorithm`: `grey_world`, `white_patch`, or `grey_edge`
    - `input_color_space`: `sRGB` or `linear_rgb`
    - `processing_space`: `sRGB` or `linear_rgb`
  - Body: multipart/form-data with image file

