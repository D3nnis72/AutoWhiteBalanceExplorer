"""Custom exceptions."""


class WhiteBalanceError(Exception):
    """Base exception for white balance processing errors."""

    pass


class InvalidImageError(WhiteBalanceError):
    """Raised when image cannot be loaded or processed."""

    pass


class UnsupportedAlgorithmError(WhiteBalanceError):
    """Raised when an unsupported algorithm is requested."""

    pass


class ColorSpaceConversionError(WhiteBalanceError):
    """Raised when color space conversion fails."""

    pass

