import { describe, it, expect, vi } from 'vitest';
import { processStoryUpload } from '../utils/storyService';

vi.mock('../utils/imageProcessing', () => ({
    getImageDimensions: vi.fn().mockResolvedValue({ width: 800, height: 600 }),
    convertToBase64: vi.fn().mockResolvedValue('data:image/jpeg;base64,FAKE_BASE64_STRING'),
}));

describe('processStoryUpload', () => {

    it('should return success with story for valid image', async () => {
        const mockFile = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
        const result = await processStoryUpload(mockFile);
        
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.story.base64Image).toBe('data:image/jpeg;base64,FAKE_BASE64_STRING');
            expect(typeof result.story.id).toBe('string');
            expect(result.story.id.length).toBeGreaterThan(0);
            expect(typeof result.story.timestamp).toBe('number');
        };
    });
});


    