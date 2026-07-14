import { useState } from 'react'
import { StoryUploadButton } from './components/StoryUploadButton'
import type { Story } from './utils/storyService'

function App() {
  const [stories, setStories] = useState<Story[]>([])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <StoryUploadButton
        onUploadSuccess={(newStory) => setStories((prev) => [...prev, newStory])}
      />
      <p>Stories caricate: {stories.length}</p>
    </div>
  )
}

export default App
