"""FastAPI exception handlers."""

from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.core.errors import (
    ColorSpaceConversionError,
    InvalidImageError,
    UnsupportedAlgorithmError,
    WhiteBalanceError,
)


async def white_balance_error_handler(
    request: Request, exc: WhiteBalanceError
) -> JSONResponse:
    """Handle white balance errors.

    Args:
        request: FastAPI request.
        exc: Exception instance.

    Returns:
        JSON error response.
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc), "type": exc.__class__.__name__},
    )


async def invalid_image_error_handler(
    request: Request, exc: InvalidImageError
) -> JSONResponse:
    """Handle invalid image errors.

    Args:
        request: FastAPI request.
        exc: Exception instance.

    Returns:
        JSON error response.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": str(exc), "type": "InvalidImageError"},
    )


async def unsupported_algorithm_error_handler(
    request: Request, exc: UnsupportedAlgorithmError
) -> JSONResponse:
    """Handle unsupported algorithm errors.

    Args:
        request: FastAPI request.
        exc: Exception instance.

    Returns:
        JSON error response.
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc), "type": "UnsupportedAlgorithmError"},
    )


async def color_space_conversion_error_handler(
    request: Request, exc: ColorSpaceConversionError
) -> JSONResponse:
    """Handle color space conversion errors.

    Args:
        request: FastAPI request.
        exc: Exception instance.

    Returns:
        JSON error response.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc), "type": "ColorSpaceConversionError"},
    )

