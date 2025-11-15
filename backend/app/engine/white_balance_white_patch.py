"""White Patch white balance algorithm."""

import torch


def apply_white_patch(
    image: torch.Tensor, percentile: float = 99.5
) -> torch.Tensor:
    """Apply white patch white balance.

    Uses the brightest region in the image as reference white.
    Scales channels so that the brightest patch becomes white.

    Args:
        image: Tensor of shape (C, H, W) with values in [0, 1] in linear RGB.
        percentile: Percentile to use for white patch detection (default: 99.5).

    Returns:
        Tensor of same shape and range, white balanced in linear RGB.
    """
    # Compute intensity/luminance across all channels to find brightest pixels
    # Use a simple average or max across channels
    # For white patch, we want pixels that are bright in all channels
    intensity = image.mean(dim=0)  # (H, W) - average intensity per pixel
    
    # Flatten to find percentile
    flat_intensity = intensity.view(-1)
    
    # Find threshold for brightest pixels
    threshold = torch.quantile(flat_intensity, percentile / 100.0)
    
    # Create mask for brightest pixels
    bright_mask = intensity >= threshold  # (H, W)
    
    # Get RGB values at brightest pixels for each channel
    white_patch_values = []
    for c in range(3):
        channel_values = image[c][bright_mask]  # Get values where mask is True
        if channel_values.numel() > 0:
            # Use the maximum value in the bright region for this channel
            white_patch_value = channel_values.max()
        else:
            # Fallback to overall max if no bright pixels found
            white_patch_value = image[c].max()
        white_patch_values.append(white_patch_value)
    
    white_patch_values_tensor = torch.tensor(white_patch_values, dtype=image.dtype, device=image.device)
    
    # Avoid division by zero
    white_patch_values_tensor = torch.where(
        white_patch_values_tensor < 1e-6,
        torch.ones_like(white_patch_values_tensor),
        white_patch_values_tensor,
    )
    
    # Compute gains to make white patch values equal (neutral white)
    # Use maximum of white patch values as target
    target = white_patch_values_tensor.max()
    gains = target / white_patch_values_tensor
    
    # Apply gains to each channel
    # Reshape gains to (C, 1, 1) for broadcasting
    gains = gains.view(3, 1, 1)
    balanced = image * gains
    
    # Clamp to valid range
    balanced = torch.clamp(balanced, 0.0, 1.0)
    
    return balanced

