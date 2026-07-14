import { describe, it, expect, vi, afterEach } from 'vitest';
import { isStillValid, isImageSizeValid } from '../utils/storyValidation';

describe('isStillValid', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for a timestamp within the last 24 hours', () => {
    const currentTime = Date.now();
    const timestamp = currentTime - (12 * 60 * 60 * 1000); // 12 hours ago
    expect(isStillValid(timestamp)).toBe(true);
  });

  it('should return false for a timestamp outside the last 24 hours', () => {
    const currentTime = Date.now();
    const timestamp = currentTime - (25 * 60 * 60 * 1000); // 25 hours ago
    expect(isStillValid(timestamp)).toBe(false);
  });

  it('should return false for a timestamp exactly 24 hours ago', () => {
    const frozenNow = new Date('2026-01-01T12:00:00Z').getTime();
    vi.useFakeTimers();
    vi.setSystemTime(frozenNow);

    const timestamp = frozenNow - (24 * 60 * 60 * 1000); // exactly 24h ago
    expect(isStillValid(timestamp)).toBe(false);
  });
}); 

describe('isImageSizeValid', () => {
  it('should return true for valid image dimensions', () => {
    expect(isImageSizeValid(1080, 1920)).toBe(true);
  });

  it('should return true for lower valid image dimensions', () => {
    expect(isImageSizeValid(800, 600)).toBe(true);
  });

  it('should return false for image dimensions that exceed the maximum', () => {
    expect(isImageSizeValid(1081, 1920)).toBe(false);
  });

  it('should return false for other image dimensions that exceed the maximum', () => {
    expect(isImageSizeValid(1080, 1921)).toBe(false);
  });
});