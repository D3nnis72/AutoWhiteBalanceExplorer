"""Pydantic models for API request and response validation."""

from pydantic import BaseModel

from app.models.enums import ColorSpace, WhiteBalanceAlgorithm


class WhiteBalanceRequest(BaseModel):
    """Request model for white balance processing."""

    algorithm: WhiteBalanceAlgorithm
    input_color_space: ColorSpace = ColorSpace.SRGB
    processing_space: ColorSpace = ColorSpace.LINEAR_RGB

    class Config:
        """Pydantic config."""

        use_enum_values = True


class WhiteBalanceResponse(BaseModel):
    """Response model for white balance processing."""

    algorithm: WhiteBalanceAlgorithm
    processing_space: ColorSpace
    image_base64: str
    avg_rgb_before: tuple[float, float, float] | None = None
    avg_rgb_after: tuple[float, float, float] | None = None

    class Config:
        """Pydantic config."""

        use_enum_values = True

