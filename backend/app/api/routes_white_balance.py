"""White balance API routes."""

from fastapi import APIRouter, Depends, File, Query, UploadFile

from app.models.api_schemas import WhiteBalanceRequest, WhiteBalanceResponse
from app.models.enums import ColorSpace, WhiteBalanceAlgorithm
from app.services.white_balance_service import WhiteBalanceService

router = APIRouter(prefix="/white-balance", tags=["white-balance"])


@router.post("/apply", response_model=WhiteBalanceResponse)
async def apply_white_balance(
    file: UploadFile = File(...),
    algorithm: WhiteBalanceAlgorithm = Query(
        default=WhiteBalanceAlgorithm.GREY_WORLD,
        description="White balance algorithm to apply",
    ),
    input_color_space: ColorSpace = Query(
        default=ColorSpace.SRGB,
        description="Input color space",
    ),
    processing_space: ColorSpace = Query(
        default=ColorSpace.LINEAR_RGB,
        description="Processing color space",
    ),
    service: WhiteBalanceService = Depends(),
) -> WhiteBalanceResponse:
    """Apply white balance algorithm to uploaded image.

    Args:
        file: Image file to process.
        algorithm: Algorithm to use (grey_world, white_patch, grey_edge).
        input_color_space: Input color space (sRGB, linear_rgb).
        processing_space: Processing color space (sRGB, linear_rgb).
        service: White balance service instance.

    Returns:
        White balance response with processed image.
    """
    # Create request model
    request = WhiteBalanceRequest(
        algorithm=algorithm,
        input_color_space=input_color_space,
        processing_space=processing_space,
    )

    # Process image
    result = await service.apply(file, request)

    # Convert to response model
    return WhiteBalanceResponse(
        algorithm=result.algorithm,
        processing_space=result.processing_space,
        image_base64=result.image_base64,
        avg_rgb_before=result.avg_rgb_before,
        avg_rgb_after=result.avg_rgb_after,
    )

