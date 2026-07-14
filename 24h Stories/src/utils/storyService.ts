import { getImageDimensions, convertToBase64 } from './imageProcessing';
import { isImageSizeValid } from './storyValidation';

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
}