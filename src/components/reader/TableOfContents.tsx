
import { Chapter } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, FileText, Sparkles } from 'lucide-react';
import { useChapterSummaries } from '@/hooks/useChapterSummaries';

interface TableOfContentsProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onChapterSelect: (chapterId: string) => void;
  loading?: boolean;
}

export const TableOfContents = ({
  chapters,
  currentChapterId,
  onChapterSelect,
  loading = false
}: TableOfContentsProps) => {
  const { hasChapterSummary } = useChapterSummaries();

  const renderChapter = (chapter: Chapter, level = 0) => (
    <div key={chapter.id} className="space-y-1">
      <Button
        variant={currentChapterId === chapter.id ? "secondary" : "ghost"}
        onClick={() => onChapterSelect(chapter.id)}
        disabled={loading}
        className={`w-full justify-start text-left p-3 h-auto min-h-[48px] ${
          level > 0 ? 'ml-4' : ''
        } ${
          currentChapterId === chapter.id
            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <div className="flex items-start gap-3 w-full">
          <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            currentChapterId === chapter.id ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'
          }`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="block text-sm font-medium line-clamp-2">
                {chapter.title}
              </span>
              {hasChapterSummary(chapter.id) && (
                <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400 flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Chapter {chapter.order}
            </span>
          </div>
          {currentChapterId === chapter.id && (
            <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          )}
        </div>
      </Button>
      {chapter.children && chapter.children.map(child => renderChapter(child, level + 1))}
    </div>
  );

  return (
    <div className="h-full">
      <div className="p-4 border-b bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Table of Contents
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {chapters.length} chapters
        </p>
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100%-80px)]">
        <div className="p-4 space-y-2">
          {chapters.map(chapter => renderChapter(chapter))}
        </div>
      </ScrollArea>
    </div>
  );
};
