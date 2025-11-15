"""Color space conversion functions."""

import torch

from app.core.errors import ColorSpaceConversionError


def srgb_to_linear(tensor: torch.Tensor) -> torch.Tensor:
    """Convert sRGB to linear RGB.

    Applies inverse gamma correction to convert from gamma-corrected sRGB
    to linear RGB (values proportional to light intensity).

    Args:
        tensor: Tensor of shape (C, H, W) with values in [0, 1] in sRGB.

    Returns:
        Tensor of same shape with values in [0, 1] in linear RGB.
    """
    try:
        # sRGB to linear conversion
        # For values <= 0.04045: linear = sRGB / 12.92
        # For values > 0.04045: linear = ((sRGB + 0.055) / 1.055) ^ 2.4
        mask = tensor <= 0.04045
        linear = torch.where(
            mask,
            tensor / 12.92,
            torch.pow((tensor + 0.055) / 1.055, 2.4),
        )
        return linear
    except Exception as e:
        raise ColorSpaceConversionError(f"Failed to convert sRGB to linear: {e}") from e


def linear_to_srgb(tensor: torch.Tensor) -> torch.Tensor:
    """Convert linear RGB to sRGB.

    Applies gamma correction to convert from linear RGB to gamma-corrected sRGB.

    Args:
        tensor: Tensor of shape (C, H, W) with values in [0, 1] in linear RGB.

    Returns:
        Tensor of same shape with values in [0, 1] in sRGB.
    """
    try:
        # Linear to sRGB conversion
        # For values <= 0.0031308: sRGB = linear * 12.92
        # For values > 0.0031308: sRGB = 1.055 * (linear ^ (1/2.4)) - 0.055
        mask = tensor <= 0.0031308
        srgb = torch.where(
            mask,
            tensor * 12.92,
            1.055 * torch.pow(tensor, 1.0 / 2.4) - 0.055,
        )
        # Clamp to valid range
        return torch.clamp(srgb, 0.0, 1.0)
    except Exception as e:
        raise ColorSpaceConversionError(f"Failed to convert linear to sRGB: {e}") from e

