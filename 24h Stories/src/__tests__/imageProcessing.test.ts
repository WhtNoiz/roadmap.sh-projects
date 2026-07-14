// @vitest-environment jsdom

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { getImageDimensions, convertToBase64 } from '../utils/imageProcessing';

class MockImage {
    onload: (() => void) | null = null;
    onerror: ((error: Event) => void) | null = null;
    width: number = 0;
    height: number = 0;

    set src(_value: string) {
        setTimeout(() => {
            this.width = 800;
            this.height = 600;
            this.onload?.();
        }, 5);
    }
}


class MockFileReader {
    onload: (() => void) | null = null;
    onerror: ((error: Event) => void) | null = null;
    result: string | null = null;

    readAsDataURL(_file: File) {
        setTimeout(() => {
            this.result = 'data:image/jpeg;base64,FAKE_BASE64_STRING';
            this.onload?.();
        }, 5);
    }

};

describe('getImageDimensions', () => {
    beforeAll(() => {
        vi.stubGlobal('Image', MockImage);
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    it('should return the correct dimensions for a valid image file', async () => {
        const mockFile = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
        const dimensions = await getImageDimensions(mockFile);
        expect(dimensions).toEqual({ width: 800, height: 600 });
    });
    
});


describe('convertToBase64', () => {
    beforeAll(() => {
        vi.stubGlobal('FileReader', MockFileReader);
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    it('should return a base64 string for a valid image file', async () => {
        const mockFile = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
        const base64String = await convertToBase64(mockFile);
        expect(base64String).toBe('data:image/jpeg;base64,FAKE_BASE64_STRING');
    });
});