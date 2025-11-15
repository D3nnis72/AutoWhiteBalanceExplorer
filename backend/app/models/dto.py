"""Data Transfer Objects for internal use."""

from typing import Optional


class ProcessedImageResult:
    """Result of white balance processing."""

    def __init__(
        self,
        image_base64: str,
        algorithm: str,
        processing_space: str,
        avg_rgb_before: Optional[tuple[float, float, float]] = None,
        avg_rgb_after: Optional[tuple[float, float, float]] = None,
    ):
        """Initialize processed image result.

        Args:
            image_base64: Base64 encoded processed image.
            algorithm: Algorithm used for processing.
            processing_space: Color space used for processing.
            avg_rgb_before: Average RGB values before processing.
            avg_rgb_after: Average RGB values after processing.
        """
        self.image_base64 = image_base64
        self.algorithm = algorithm
        self.processing_space = processing_space
        self.avg_rgb_before = avg_rgb_before
        self.avg_rgb_after = avg_rgb_after


class HistogramData:
    """Histogram data for a single channel."""

    def __init__(self, bins: list[int], values: list[float]):
        """Initialize histogram data.

        Args:
            bins: Bin edges or indices.
            values: Count or frequency values for each bin.
        """
        self.bins = bins
        self.values = values

