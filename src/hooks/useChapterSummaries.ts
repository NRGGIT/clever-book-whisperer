
import { useState, useEffect } from 'react';

interface ChapterSummaryState {
  [chapterId: string]: boolean;
}

export const useChapterSummaries = () => {
  const [chapterSummaries, setChapterSummaries] = useState<ChapterSummaryState>({});

  useEffect(() => {
    const saved = localStorage.getItem('chapterSummaries');
    if (saved) {
      try {
        setChapterSummaries(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved chapter summaries:', error);
      }
    }
  }, []);

  const markChapterSummary = (chapterId: string) => {
    setChapterSummaries(prev => {
      const updated = { ...prev, [chapterId]: true };
      localStorage.setItem('chapterSummaries', JSON.stringify(updated));
      return updated;
    });
  };

  const hasChapterSummary = (chapterId: string) => {
    return chapterSummaries[chapterId] || false;
  };

  return { markChapterSummary, hasChapterSummary };
};
