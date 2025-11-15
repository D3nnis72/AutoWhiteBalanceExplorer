"""Enums for white balance algorithms and color spaces."""

from enum import Enum


class WhiteBalanceAlgorithm(str, Enum):
    """White balance algorithm types."""

    GREY_WORLD = "grey_world"
    WHITE_PATCH = "white_patch"
    GREY_EDGE = "grey_edge"


class ColorSpace(str, Enum):
    """Color space types."""

    SRGB = "sRGB"
    LINEAR_RGB = "linear_rgb"

