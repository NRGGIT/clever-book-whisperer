
import { Chapter } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, FileText } from 'lucide-react';

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
            ? 'bg-amber-100 text-amber-900 border-amber-200'
            : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-start gap-3 w-full">
          <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            currentChapterId === chapter.id ? 'text-amber-600' : 'text-gray-400'
          }`} />
          <div className="flex-1 min-w-0">
            <span className="block text-sm font-medium line-clamp-2">
              {chapter.title}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Chapter {chapter.order}
            </span>
          </div>
          {currentChapterId === chapter.id && (
            <ChevronRight className="w-4 h-4 text-amber-600 flex-shrink-0" />
          )}
        </div>
      </Button>
      {chapter.children && chapter.children.map(child => renderChapter(child, level + 1))}
    </div>
  );

  return (
    <div className="h-full">
      <div className="p-4 border-b bg-gray-50/50">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Table of Contents
        </h2>
        <p className="text-sm text-gray-600 mt-1">
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
