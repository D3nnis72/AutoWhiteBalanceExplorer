"""Grey World white balance algorithm."""

import torch


def apply_grey_world(image: torch.Tensor) -> torch.Tensor:
    """Apply grey world white balance.

    Assumes that the average scene color should be neutral grey.
    Adjusts each channel so that the mean becomes grey (equal RGB values).

    Args:
        image: Tensor of shape (C, H, W) with values in [0, 1] in linear RGB.

    Returns:
        Tensor of same shape and range, white balanced in linear RGB.
    """
    # Compute mean for each channel
    means = image.view(3, -1).mean(dim=1, keepdim=True)

    # Compute overall mean (target grey value)
    overall_mean = means.mean()

    # Avoid division by zero
    means = torch.where(means < 1e-6, torch.ones_like(means), means)

    # Compute gains to make each channel mean equal to overall mean
    gains = overall_mean / means

    # Apply gains to each channel
    # Reshape gains to (C, 1, 1) for broadcasting
    gains = gains.view(3, 1, 1)
    balanced = image * gains

    # Clamp to valid range
    balanced = torch.clamp(balanced, 0.0, 1.0)

    return balanced

