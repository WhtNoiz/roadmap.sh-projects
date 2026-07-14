import { useEffect, useState } from 'react'
import { StoryUploadButton } from './components/StoryUploadButton'
import { StoryList } from './components/StoryList'
import { StoryViewer } from './components/StoryViewer'
import { getStories, saveStory, markStoryAsViewed } from './utils/storyService'
import type { Story } from './utils/storyService'

function App() {
  const [stories, setStories] = useState<Story[]>([])
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  useEffect(() => {
    setStories(getStories())
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-4 overflow-x-auto overflow-y-hidden p-4">
        <StoryUploadButton
          onUploadSuccess={(newStory) => {
            saveStory(newStory)
            setStories((prev) => [...prev, newStory])
          }}
        />
        <StoryList
          stories={stories}
          onStoryClick={(index) => {
            markStoryAsViewed(stories[index].id)
            setViewerIndex(index)
          }}
          onStoryDeleted={(storyId) => setStories((prev) => prev.filter((s) => s.id !== storyId))}
        />
      </div>
      {viewerIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  )
}

export default App
