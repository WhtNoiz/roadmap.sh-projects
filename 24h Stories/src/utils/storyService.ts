import { getImageDimensions, convertToBase64 } from './imageProcessing';
import { isImageSizeValid, isStillValid } from './storyValidation';

export interface Story {
  id: string;
  timestamp: number;
  base64Image: string;
}

export type UploadResult =
    | { success: true; story: Story }
    | { success: false; error: string }

export async function processStoryUpload(file: File): Promise<UploadResult> {
    try {
        const dimensions = await getImageDimensions(file);

        if (!isImageSizeValid(dimensions.width, dimensions.height)) {
            return { success: false, error: 'Image is too large' };
        }

        const base64Image = await convertToBase64(file);

        const story: Story = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            base64Image
        };

        return { success: true, story };
    } catch (_error) {
        return { success: false, error: 'Failed to process story upload' };
    }
};

export function saveStory(story: Story): void {
    const existingStories = localStorage.getItem('stories');
    const stories: Story[] = existingStories ? JSON.parse(existingStories) : [];

    const updatedStories = [...stories, story];
    localStorage.setItem('stories', JSON.stringify(updatedStories));

};

export function getStories(): Story[] {
    const existingStories = localStorage.getItem('stories');
    const stories: Story[] = existingStories ? JSON.parse(existingStories) : [];

    return stories.filter(story => isStillValid(story.timestamp));
}

export function markStoryAsViewed(storyId: string): void {
    const existingViewedStoryIds = localStorage.getItem('viewedStoryIds');
    const viewedStoryIds: string[] = existingViewedStoryIds ? JSON.parse(existingViewedStoryIds) : [];

    if (viewedStoryIds.includes(storyId)) {
        return;
    }

    const updatedViewedStoryIds = [...viewedStoryIds, storyId];
    localStorage.setItem('viewedStoryIds', JSON.stringify(updatedViewedStoryIds));
}

export function isStoryViewed(storyId: string): boolean {
    const existingViewedStoryIds = localStorage.getItem('viewedStoryIds');
    const viewedStoryIds: string[] = existingViewedStoryIds ? JSON.parse(existingViewedStoryIds) : [];

    return viewedStoryIds.includes(storyId);
}

export function deleteStory(storyId: string): void {
    const existingStories = localStorage.getItem('stories');
    const stories: Story[] = existingStories ? JSON.parse(existingStories) : [];

    const updatedStories = stories.filter(story => story.id !== storyId);
    localStorage.setItem('stories', JSON.stringify(updatedStories));
}