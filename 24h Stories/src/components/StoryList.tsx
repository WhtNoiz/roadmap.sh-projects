import type { Story } from '../utils/storyService';
import { isStoryViewed, deleteStory } from '../utils/storyService';

interface StoryListProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
  onStoryDeleted: (storyId: string) => void;
}

export function StoryList({ stories, onStoryClick, onStoryDeleted }: StoryListProps) {
  if (stories.length === 0) return null;

  return (
    <>
      {stories.map((story, index) => (
        <div key={story.id} className="relative group flex-shrink-0">
          <button
            type="button"
            onClick={() => onStoryClick(index)}
            className={`rounded-full ring-2 ring-offset-2 ${
              isStoryViewed(story.id) ? 'ring-gray-300' : 'ring-pink-500'
            }`}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img src={story.base64Image} className="w-full h-full object-cover" alt="" />
            </div>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              deleteStory(story.id);
              onStoryDeleted(story.id);
            }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150"
          >
            ×
          </button>
        </div>
      ))}
    </>
  );
}
