// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processStoryUpload, getStories, saveStory, markStoryAsViewed, isStoryViewed, deleteStory } from '../utils/storyService';

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


describe('saveStory', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should save a story to localStorage', () => {
        const story = {
            id: 'test-id',
            timestamp: Date.now(),
            base64Image: 'data:image/jpeg;base64,FAKE_BASE64_STRING'
        };

        saveStory(story);

        const rawData = localStorage.getItem('stories');
        const savedStories = rawData ? JSON.parse(rawData) : [];

        expect(savedStories).toContainEqual(story);
    });
});

describe('getStories', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should include a story that is still valid', () => {
        const validStory = {
            id: 'valid-id',
            timestamp: Date.now(),
            base64Image: 'data:image/jpeg;base64,FAKE_BASE64_STRING'
        };

        saveStory(validStory);

        const stories = getStories();
        expect(stories).toContainEqual(validStory);
    });

    it('should exclude a story that has expired', () => {
        const expiredStory = {
            id: 'expired-id',
            timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
            base64Image: 'data:image/jpeg;base64,FAKE_BASE64_STRING'
        };

        saveStory(expiredStory);

        const stories = getStories();
        expect(stories).not.toContainEqual(expiredStory);
    });
});

describe('markStoryAsViewed', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should make isStoryViewed return true for the marked id', () => {
        markStoryAsViewed('viewed-id');

        expect(isStoryViewed('viewed-id')).toBe(true);
    });

    it('should not create duplicate entries when called twice with the same id', () => {
        markStoryAsViewed('duplicate-id');
        markStoryAsViewed('duplicate-id');

        const rawData = localStorage.getItem('viewedStoryIds');
        const savedViewedStoryIds = rawData ? JSON.parse(rawData) : [];

        expect(savedViewedStoryIds).toHaveLength(1);
    });
});

describe('isStoryViewed', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should return false for an id that was never marked as viewed', () => {
        expect(isStoryViewed('never-viewed-id')).toBe(false);
    });

    it('should return true for an id previously marked with markStoryAsViewed', () => {
        markStoryAsViewed('previously-viewed-id');

        expect(isStoryViewed('previously-viewed-id')).toBe(true);
    });
});

describe('deleteStory', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should leave only the remaining story after deleting one of two saved stories', () => {
        const remainingStory = {
            id: 'remaining-id',
            timestamp: Date.now(),
            base64Image: 'data:image/jpeg;base64,FAKE_BASE64_STRING'
        };
        const deletedStory = {
            id: 'deleted-id',
            timestamp: Date.now(),
            base64Image: 'data:image/jpeg;base64,FAKE_BASE64_STRING'
        };

        saveStory(remainingStory);
        saveStory(deletedStory);

        deleteStory('deleted-id');

        const rawData = localStorage.getItem('stories');
        const savedStories = rawData ? JSON.parse(rawData) : [];

        expect(savedStories).toEqual([remainingStory]);
    });

    it('should not throw and should leave the array unchanged when deleting a non-existent id', () => {
        const story = {
            id: 'existing-id',
            timestamp: Date.now(),
            base64Image: 'data:image/jpeg;base64,FAKE_BASE64_STRING'
        };

        saveStory(story);

        expect(() => deleteStory('non-existent-id')).not.toThrow();

        const rawData = localStorage.getItem('stories');
        const savedStories = rawData ? JSON.parse(rawData) : [];

        expect(savedStories).toEqual([story]);
    });

    it('should leave an empty array when deleting the last remaining story', () => {
        const onlyStory = {
            id: 'only-id',
            timestamp: Date.now(),
            base64Image: 'data:image/jpeg;base64,FAKE_BASE64_STRING'
        };

        saveStory(onlyStory);

        deleteStory('only-id');

        const rawData = localStorage.getItem('stories');
        const savedStories = rawData ? JSON.parse(rawData) : [];

        expect(savedStories).toEqual([]);
    });
});