import cv2
import numpy as np

def run_inference(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (512, 512))

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    mask = np.zeros((512, 512), dtype=np.uint8)

    # Sky (very bright, high value)
    mask[v > 200] = 3

    # Rocks (dark, low saturation, low brightness)
    mask[(v < 80) & (s < 80)] = 4

    # Sand / road (yellow-orange hue, medium-high saturation)
    mask[(h > 5) & (h < 40) & (s > 30) & (v > 80)] = 1

    # Vegetation (green hue)
    mask[(h > 40) & (h < 90) & (s > 30) & (v > 80)] = 2

    return mask
