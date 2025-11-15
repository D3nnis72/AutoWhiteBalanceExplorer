"""Shared API dependencies."""

from app.services.white_balance_service import WhiteBalanceService


def get_white_balance_service() -> WhiteBalanceService:
    """Get white balance service instance.

    Returns:
        White balance service instance.
    """
    return WhiteBalanceService()

