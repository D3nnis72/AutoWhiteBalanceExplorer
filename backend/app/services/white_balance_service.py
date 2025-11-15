"""White balance service for orchestrating image processing."""

import base64
import io
from typing import Optional

from fastapi import UploadFile
from PIL import Image

from app.core.errors import InvalidImageError, UnsupportedAlgorithmError
from app.core.logging import get_logger
from app.engine import color_spaces, utils
from app.engine.white_balance_grey_edge import apply_grey_edge
from app.engine.white_balance_grey_world import apply_grey_world
from app.engine.white_balance_white_patch import apply_white_patch
from app.models.api_schemas import WhiteBalanceRequest
from app.models.dto import ProcessedImageResult
from app.models.enums import ColorSpace, WhiteBalanceAlgorithm

logger = get_logger(__name__)


class WhiteBalanceService:
    """Service for applying white balance algorithms to images."""

    async def apply(
        self, file: UploadFile, request: WhiteBalanceRequest
    ) -> ProcessedImageResult:
        """Apply white balance algorithm to uploaded image.

        Args:
            file: Uploaded image file.
            request: White balance request parameters.

        Returns:
            Processed image result.

        Raises:
            InvalidImageError: If image cannot be loaded.
            UnsupportedAlgorithmError: If algorithm is not supported.
        """
        try:
            # Read image bytes
            image_bytes = await file.read()

            # Load image with Pillow
            try:
                image = Image.open(io.BytesIO(image_bytes))
            except Exception as e:
                raise InvalidImageError(f"Failed to load image: {e}") from e

            # Convert to tensor
            tensor = utils.image_to_tensor(image)

            # Compute average RGB before processing
            avg_rgb_before = utils.compute_average_rgb(tensor)

            # Handle color space conversion (pre-processing)
            # Convert string values to enums for comparison
            input_space_str = (
                str(request.input_color_space)
                if not isinstance(request.input_color_space, str)
                else request.input_color_space
            )
            processing_space_str = (
                str(request.processing_space)
                if not isinstance(request.processing_space, str)
                else request.processing_space
            )

            input_space = ColorSpace(input_space_str)
            processing_space_enum = ColorSpace(processing_space_str)

            if (
                input_space == ColorSpace.SRGB
                and processing_space_enum == ColorSpace.LINEAR_RGB
            ):
                tensor = color_spaces.srgb_to_linear(tensor)
                logger.debug("Converted sRGB to linear RGB for processing")

            # Apply white balance algorithm
            # Convert string value to enum for comparison
            algorithm_str = (
                str(request.algorithm)
                if not isinstance(request.algorithm, str)
                else request.algorithm
            )
            algorithm = WhiteBalanceAlgorithm(algorithm_str)
            balanced_tensor = self._apply_algorithm(tensor, algorithm)

            # Handle color space conversion (post-processing)
            if (
                input_space == ColorSpace.SRGB
                and processing_space_enum == ColorSpace.LINEAR_RGB
            ):
                balanced_tensor = color_spaces.linear_to_srgb(balanced_tensor)
                logger.debug("Converted linear RGB back to sRGB for display")

            # Compute average RGB after processing
            avg_rgb_after = utils.compute_average_rgb(balanced_tensor)

            # Convert tensor back to image
            processed_image = utils.tensor_to_image(balanced_tensor)

            # Convert to base64
            buffer = io.BytesIO()
            processed_image.save(buffer, format="PNG")
            image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

            # Get string values from enums
            algorithm_result_str = algorithm.value
            processing_space_result_str = processing_space_enum.value

            return ProcessedImageResult(
                image_base64=image_base64,
                algorithm=algorithm_result_str,
                processing_space=processing_space_result_str,
                avg_rgb_before=avg_rgb_before,
                avg_rgb_after=avg_rgb_after,
            )

        except (InvalidImageError, UnsupportedAlgorithmError):
            raise
        except Exception as e:
            logger.error(f"Unexpected error during white balance processing: {e}")
            raise InvalidImageError(f"Failed to process image: {e}") from e

    def _apply_algorithm(
        self, tensor: "torch.Tensor", algorithm: WhiteBalanceAlgorithm
    ) -> "torch.Tensor":
        """Apply the specified white balance algorithm.

        Args:
            tensor: Image tensor of shape (C, H, W) in [0, 1].
            algorithm: Algorithm to apply.

        Returns:
            White balanced tensor.

        Raises:
            UnsupportedAlgorithmError: If algorithm is not supported.
        """
        if algorithm == WhiteBalanceAlgorithm.GREY_WORLD:
            return apply_grey_world(tensor)
        elif algorithm == WhiteBalanceAlgorithm.WHITE_PATCH:
            return apply_white_patch(tensor)
        elif algorithm == WhiteBalanceAlgorithm.GREY_EDGE:
            return apply_grey_edge(tensor)
        else:
            raise UnsupportedAlgorithmError(f"Unsupported algorithm: {algorithm}")

