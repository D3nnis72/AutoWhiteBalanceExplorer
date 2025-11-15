"""Main FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_white_balance
from app.core.config import settings
from app.core.error_handlers import (
    color_space_conversion_error_handler,
    invalid_image_error_handler,
    unsupported_algorithm_error_handler,
    white_balance_error_handler,
)
from app.core.errors import (
    ColorSpaceConversionError,
    InvalidImageError,
    UnsupportedAlgorithmError,
    WhiteBalanceError,
)
from app.core.logging import setup_logging

# Setup logging
setup_logging()

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
app.add_exception_handler(WhiteBalanceError, white_balance_error_handler)
app.add_exception_handler(InvalidImageError, invalid_image_error_handler)
app.add_exception_handler(UnsupportedAlgorithmError, unsupported_algorithm_error_handler)
app.add_exception_handler(ColorSpaceConversionError, color_space_conversion_error_handler)

# Include routers
app.include_router(routes_white_balance.router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Auto White Balance Explorer API", "version": "1.0.0"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

