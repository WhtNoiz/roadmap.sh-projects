
export function isStillValid(timestamp: number): boolean {
  const now = Date.now();
  const timeDiff = now - timestamp;
  return timeDiff < 24 * 60 * 60 * 1000;
}

export function isImageSizeValid(width: number, height: number): boolean {
  const maxWidth = 1080;
  const maxHeight = 1920;
  return width <= maxWidth && height <= maxHeight;
}