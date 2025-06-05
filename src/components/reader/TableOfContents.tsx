
import { Chapter } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, FileText, Sparkles, ChevronDown, BookOpen } from 'lucide-react';
import { useChapterSummaries } from '@/hooks/useChapterSummaries';
import { useState } from 'react';

interface TableOfContentsProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onChapterSelect: (chapterId: string, loadFull?: boolean) => void;
  loading?: boolean;
}

export const TableOfContents = ({
  chapters,
  currentChapterId,
  onChapterSelect,
  loading = false
}: TableOfContentsProps) => {
  const { hasChapterSummary } = useChapterSummaries();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleExpanded = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const renderChapter = (chapter: Chapter, level = 0) => {
    const hasChildren = chapter.children && chapter.children.length > 0;
    const isExpanded = expandedChapters.has(chapter.id);
    const isSelected = currentChapterId === chapter.id;
    const indentationClass = level > 0 ? `ml-${Math.min(level * 4, 12)}` : '';

    return (
      <div key={chapter.id} className="space-y-1">
        <div className={`flex items-start gap-2 ${indentationClass}`}>
          {/* Expand/Collapse button for chapters with children */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(chapter.id)}
              className="p-1 h-6 w-6 flex-shrink-0 mt-1"
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`} />
            </Button>
          ) : (
            <div className="w-6 h-6 flex-shrink-0"></div>
          )}
          
          {/* Chapter button - takes remaining space */}
          <Button
            variant={isSelected ? "secondary" : "ghost"}
            onClick={() => onChapterSelect(chapter.id)}
            disabled={loading}
            className={`flex-1 justify-start text-left p-3 h-auto min-h-[48px] overflow-hidden ${
              isSelected
                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-start gap-3 w-full min-w-0 overflow-hidden">
              <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'
              }`} />
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-sm font-medium leading-tight overflow-hidden text-ellipsis line-clamp-2 word-break-all">
                    {chapter.title}
                  </span>
                  {hasChapterSummary(chapter.id) && (
                    <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Chapter {chapter.order}
                  {hasChildren && ` (${chapter.children.length} sections)`}
                </span>
              </div>
              {isSelected && (
                <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              )}
            </div>
          </Button>

          {/* Full content button for chapters with children */}
          {hasChildren && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChapterSelect(chapter.id, true)}
              disabled={loading}
              className="p-2 h-8 w-8 flex-shrink-0 mt-2"
              title="Load full chapter with all subsections"
            >
              <BookOpen className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {chapter.children.map(child => renderChapter(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Table of Contents
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {chapters.length} chapters
        </p>
      </div>
      
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-2">
          {chapters.map(chapter => renderChapter(chapter))}
        </div>
      </ScrollArea>
    </div>
  );
};
