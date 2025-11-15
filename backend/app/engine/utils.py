"""Utility functions for tensor operations."""

import torch


def image_to_tensor(image: "PIL.Image.Image") -> torch.Tensor:
    """Convert PIL Image to PyTorch tensor.

    Args:
        image: PIL Image in RGB mode.

    Returns:
        Tensor of shape (C, H, W) with values in [0, 1].
    """
    import numpy as np
    from PIL import Image

    # Convert to RGB if needed
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Convert to numpy array and normalize to [0, 1]
    arr = np.array(image, dtype=np.float32) / 255.0

    # Convert to tensor and rearrange from (H, W, C) to (C, H, W)
    tensor = torch.from_numpy(arr).permute(2, 0, 1)

    return tensor


def tensor_to_image(tensor: torch.Tensor) -> "PIL.Image.Image":
    """Convert PyTorch tensor to PIL Image.

    Args:
        tensor: Tensor of shape (C, H, W) with values in [0, 1].

    Returns:
        PIL Image in RGB mode.
    """
    import numpy as np
    from PIL import Image

    # Clamp values to [0, 1]
    tensor = torch.clamp(tensor, 0.0, 1.0)

    # Convert to numpy and rearrange from (C, H, W) to (H, W, C)
    arr = tensor.permute(1, 2, 0).cpu().numpy()

    # Denormalize to [0, 255] and convert to uint8
    arr = (arr * 255.0).astype(np.uint8)

    # Create PIL Image
    image = Image.fromarray(arr, mode="RGB")

    return image


def compute_average_rgb(tensor: torch.Tensor) -> tuple[float, float, float]:
    """Compute average RGB values for each channel.

    Args:
        tensor: Tensor of shape (C, H, W) with values in [0, 1].

    Returns:
        Tuple of (R, G, B) average values.
    """
    # Compute mean for each channel
    means = tensor.view(3, -1).mean(dim=1)
    return (means[0].item(), means[1].item(), means[2].item())

