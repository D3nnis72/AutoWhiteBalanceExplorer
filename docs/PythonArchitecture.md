# Python Backend Architecture

Backend for the **Auto White Balance Explorer**.
Provides a clean FastAPI service that exposes white balance algorithms implemented with PyTorch.

---

## 1. Tech Stack

- **Language**, Python 3.11+
- **Web framework**, FastAPI
- **Image and tensor processing**

  - PyTorch, core tensor operations and GPU support
  - Pillow, image loading and basic conversion

- **Config and validation**

  - Pydantic, request and response models

- **Tooling**

  - uvicorn, ASGI server
  - pytest, unit tests
  - mypy, static typing
  - black and isort, formatting
  - ruff, linting

---

## 2. High level design

Clean layered design with clear responsibilities.

```text
app/
  api/           # HTTP layer, FastAPI routers, input and output models
  services/      # Orchestration, business logic, combines engine parts
  engine/        # Core image processing and white balance algorithms with PyTorch
  models/        # Shared types, enums, DTOs, domain models
  core/          # Config, logging, wiring, error handling utilities
tests/
  unit/
  integration/
```

### Responsibilities

- `api`

  - Defines HTTP endpoints
  - Validates and parses requests via Pydantic models
  - Returns clean responses and error codes
  - No algorithmic logic

- `services`

  - Knows which engine function to call for which algorithm
  - Handles conversions between uploaded files and engine inputs
  - Combines multiple steps, for example sRGB to linear, apply algorithm, convert back

- `engine`

  - Contains pure, testable functions that operate on tensors
  - Implements grey world, white patch, grey edge etc
  - No FastAPI, no HTTP, no file system logic

- `models`

  - Shared enums like `WhiteBalanceAlgorithm`, `ColorSpace`
  - Domain types like `ProcessedImageResult`

- `core`

  - Central FastAPI app creation
  - Application settings and environment configuration
  - Logging setup
  - Generic exception handlers

---

## 3. Folder structure in detail

```text
app/
  __init__.py

  main.py              # create_app(), FastAPI instance

  api/
    __init__.py
    routes_white_balance.py
    dependencies.py    # shared dependencies, for example engine provider

  services/
    __init__.py
    white_balance_service.py

  engine/
    __init__.py
    color_spaces.py    # sRGB <-> linear conversions
    white_balance_grey_world.py
    white_balance_white_patch.py
    white_balance_grey_edge.py
    utils.py           # tensor helpers

  models/
    __init__.py
    enums.py           # ColorSpace, WhiteBalanceAlgorithm
    dto.py             # ProcessedImage, HistogramData
    api_schemas.py     # Pydantic request and response models

  core/
    __init__.py
    config.py          # Settings, environment variables
    logging.py         # logger setup
    errors.py          # custom exceptions
    error_handlers.py  # FastAPI exception handlers

tests/
  unit/
    test_engine_grey_world.py
    test_engine_white_patch.py
    test_color_spaces.py

  integration/
    test_api_white_balance.py
```

---

## 4. Data flow for processing an image

End to end flow for a single HTTP request.

1. **Upload**

   - Frontend uploads an image file via `multipart/form-data` to `POST /white-balance/apply`
   - Request includes

     - `algorithm`, for example `grey_world`
     - `input_color_space`, for example `sRGB`
     - `processing_space`, for example `linear_rgb` or `gamma_rgb`

2. **API layer (`api/routes_white_balance.py`)**

   - FastAPI parses request into `WhiteBalanceRequest` Pydantic model
   - Validates algorithm and color space enums
   - Passes `UploadFile` and settings into the service

3. **Service layer (`services/white_balance_service.py`)**

   - Reads image bytes from `UploadFile`
   - Uses Pillow to load image into `PIL.Image`
   - Converts image to tensor, for example `torch.FloatTensor` with shape `(C, H, W)`
   - If `processing_space` is `linear_rgb` and input is sRGB

     - Calls `engine.color_spaces.srgb_to_linear(tensor)`

   - Calls correct engine function based on requested algorithm

     - For example `engine.white_balance_grey_world.apply_grey_world(tensor)`

   - Converts processing space back to sRGB if needed

     - `engine.color_spaces.linear_to_srgb(tensor)`

   - Converts tensor back to image bytes, for example PNG
   - Optionally computes extra data like histograms

4. **Engine layer (`engine/...`)**

   - Pure PyTorch code
   - Example for grey world

     - Compute per channel mean
     - Compute gain per channel to make average equal to neutral grey
     - Multiply channels with their gains
     - Clamp values to valid range

5. **Response**

   - Service returns a `ProcessedImageResult` object

     - `image_base64` or `image_url`
     - algorithm metadata
     - optional histograms or statistics

   - API transforms it into `WhiteBalanceResponse` Pydantic model
   - FastAPI returns JSON with embedded image representation

---

## 5. Clean code principles

### 5.1 General rules

- Every function should do **one thing** and do it clearly
- No business logic inside FastAPI route functions
- Prefer pure functions in `engine` with explicit inputs and outputs
- Use `Enum` for algorithm names and color spaces, avoid magic strings
- Use type hints everywhere and run mypy
- Use small modules rather than huge files, but keep related algorithms together

### 5.2 Engine layer rules

- Accept and return tensors with clear shape and value ranges

  - For example, always `(C, H, W)` with values between `0.0` and `1.0`

- Do not depend on FastAPI, file system, or request objects
- Keep parameterization explicit

  - For example thresholds or kernel sizes as function parameters

- Provide clear docstrings with

  - expected input space, linear or sRGB
  - expected ranges
  - returned value description

Example engine function signature

```python
def apply_grey_world(
    image: torch.Tensor,
) -> torch.Tensor:
    """Apply grey world white balance.

    Args:
        image, Tensor of shape (C, H, W) with values in [0, 1] in linear RGB.
    Returns:
        Tensor of same shape and range, white balanced in linear RGB.
    """
```

### 5.3 Service layer rules

- Translate from external representation to internal representation

  - File to tensor
  - API enums to internal enums

- Never hide algorithm details inside the service

  - Service selects algorithm, engine implements it

- Handle error conditions

  - Invalid image formats
  - Corrupted files
  - Unsupported color spaces

### 5.4 API layer rules

- Route functions should be very short

  - parse request
  - call service
  - return response

- Validation belongs to Pydantic models
- Use exception handlers in `core.error_handlers` for uniform error responses

---

## 6. Example key components

### 6.1 Enums

```python
# app/models/enums.py
from enum import Enum


class WhiteBalanceAlgorithm(str, Enum):
    GREY_WORLD = "grey_world"
    WHITE_PATCH = "white_patch"
    GREY_EDGE = "grey_edge"


class ColorSpace(str, Enum):
    SRGB = "sRGB"
    LINEAR_RGB = "linear_rgb"
```

### 6.2 API schema

```python
# app/models/api_schemas.py
from pydantic import BaseModel
from .enums import WhiteBalanceAlgorithm, ColorSpace


class WhiteBalanceRequest(BaseModel):
    algorithm: WhiteBalanceAlgorithm
    input_color_space: ColorSpace = ColorSpace.SRGB
    processing_space: ColorSpace = ColorSpace.LINEAR_RGB


class WhiteBalanceResponse(BaseModel):
    algorithm: WhiteBalanceAlgorithm
    processing_space: ColorSpace
    image_base64: str
    avg_rgb_before: tuple[float, float, float] | None = None
    avg_rgb_after: tuple[float, float, float] | None = None
```

### 6.3 Route

```python
# app/api/routes_white_balance.py
from fastapi import APIRouter, UploadFile, File, Depends
from app.models.api_schemas import WhiteBalanceRequest, WhiteBalanceResponse
from app.services.white_balance_service import WhiteBalanceService

router = APIRouter(prefix="/white-balance", tags=["white-balance"])


@router.post("/apply", response_model=WhiteBalanceResponse)
async def apply_white_balance(
    file: UploadFile = File(...),
    request: WhiteBalanceRequest = Depends(),
    service: WhiteBalanceService = Depends(WhiteBalanceService),
) -> WhiteBalanceResponse:
    return await service.apply(file, request)
```

---

## 7. Configuration and environment

- Use a `Settings` class with Pydantic for configuration

```python
# app/core/config.py
from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Auto White Balance Backend"
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
```

- Use `settings` in `main.py` when creating the FastAPI app
- Keep secrets like `SECRET_KEY` or database URLs only if needed later

---
