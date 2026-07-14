import { useEffect, useRef, useState } from 'react';
import type { Story } from '../utils/storyService';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const STORY_DURATION_MS = 10000;
const PROGRESS_TICK_MS = 50;
const SWIPE_THRESHOLD_PX = 50;
const HOLD_DELAY_MS = 200;

/** Full-screen Instagram-style story viewer with auto-advance, swipe, and press-and-hold pause. */
export function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const holdTimeoutRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const wasHoldRef = useRef(false);

  // No side effect here, so the functional updater form is fine as-is.
  const goToPrevious = () => {
    setProgress(0);
    setCurrentIndex((index) => (index === 0 ? index : index - 1));
  };

  const goToNext = () => {
    if (currentIndex >= stories.length - 1) {
      onClose();
      return;
    }
    setProgress(0);
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + (PROGRESS_TICK_MS / STORY_DURATION_MS) * 100, 100));
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(interval);
  }, [currentIndex, isPaused]);

  useEffect(() => {
    if (progress < 100) return;

    if (currentIndex >= stories.length - 1) {
      onClose();
    } else {
      setCurrentIndex((index) => index + 1);
      setProgress(0);
    }
  }, [progress, currentIndex, stories.length, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const clearHoldTimeout = () => {
    if (holdTimeoutRef.current !== null) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const startHold = () => {
    clearHoldTimeout();
    wasHoldRef.current = false;
    holdTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(true);
      wasHoldRef.current = true;
      holdTimeoutRef.current = null;
    }, HOLD_DELAY_MS);
  };

  const endHold = () => {
    clearHoldTimeout();
    setIsPaused(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', endHold);
    return () => document.removeEventListener('mouseup', endHold);
  }, []);

  const handleNavigationClick = (direction: 'previous' | 'next') => {
    if (wasHoldRef.current) {
      wasHoldRef.current = false;
      return;
    }
    if (direction === 'previous') {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartXRef.current = event.touches[0].clientX;
    touchEndXRef.current = null;
    startHold();
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    endHold();

    const startX = touchStartXRef.current;
    const endX = touchEndXRef.current;
    touchStartXRef.current = null;
    touchEndXRef.current = null;

    if (startX === null || endX === null) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

    wasHoldRef.current = true;

    if (deltaX < 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  const currentStory = stories[currentIndex];
  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {stories.map((story, index) => (
          <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{
                width: `${index < currentIndex ? 100 : index === currentIndex ? progress : 0}%`,
              }}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white text-2xl"
      >
        ×
      </button>

      <div
        className="relative max-w-full max-h-full"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={startHold}
        onMouseUp={endHold}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentStory.base64Image}
          alt=""
          className="max-w-full max-h-full object-contain"
        />

        <div className="absolute inset-y-0 left-0 w-1/2" onClick={() => handleNavigationClick('previous')} />
        <div className="absolute inset-y-0 right-0 w-1/2" onClick={() => handleNavigationClick('next')} />
      </div>
    </div>
  );
}
