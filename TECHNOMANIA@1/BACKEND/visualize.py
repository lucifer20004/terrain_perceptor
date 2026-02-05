import numpy as np

COLORS = {
    0: (0, 0, 0),           # background - pure black
    1: (50, 200, 255),      # sand - bright orange/yellow
    2: (0, 255, 0),         # vegetation - bright lime green
    3: (255, 0, 0),         # sky - bright cyan/blue
    4: (0, 0, 255)          # rocks - bright red
}

def colorize_mask(mask):
    h, w = mask.shape
    colored = np.zeros((h, w, 3), dtype=np.uint8)

    for k, color in COLORS.items():
        colored[mask == k] = color

    return colored
