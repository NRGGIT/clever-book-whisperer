
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useBookReader } from '@/hooks/useBooks';
import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/ui/logo';
import { TableOfContents } from '@/components/reader/TableOfContents';
import { ReadingView } from '@/components/reader/ReadingView';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Menu, Loader2, Moon, Sun } from 'lucide-react';

const Reader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { book, currentChapter, chapterContent, loading, loadingChapter, loadChapter } = useBookReader(bookId || null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const [viewMode, setViewMode] = useState<'toc' | 'reading'>('toc');

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, show TOC by default when no chapter is selected
      if (mobile && !currentChapter) {
        setViewMode('toc');
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [currentChapter]);

  // Update view mode when chapter changes
  useEffect(() => {
    if (currentChapter && isMobile) {
      setViewMode('reading');
    }
  }, [currentChapter, isMobile]);

  const handleChapterSelect = (chapterId: string) => {
    if (bookId) {
      loadChapter(bookId, chapterId);
      // Hide mobile TOC when chapter is selected
      if (isMobile) {
        setShowMobileTOC(false);
        setViewMode('reading');
      }
    }
  };

  const handleBackNavigation = () => {
    if (isMobile && viewMode === 'reading') {
      setViewMode('toc');
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Book Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The requested book could not be loaded.</p>
          <Button onClick={() => navigate('/')}>
            Return to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header - Optimized for mobile */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="hover:bg-amber-100 dark:hover:bg-gray-800 p-1 sm:p-2"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {isMobile && viewMode === 'reading' ? 'Contents' : 'Library'}
                </span>
              </Button>
              <div className="hidden md:block">
                <Logo />
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-1 sm:p-2"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              
              <div className="hidden sm:block text-right max-w-xs">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">{book.title}</h2>
                {book.author && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{book.author}</p>
                )}
              </div>
              
              {/* Mobile Menu - only show when in reading mode */}
              {isMobile && viewMode === 'reading' && (
                <Sheet open={showMobileTOC} onOpenChange={setShowMobileTOC}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="p-1">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <TableOfContents
                      chapters={book.chapters}
                      currentChapterId={currentChapter?.id}
                      onChapterSelect={handleChapterSelect}
                      loading={loadingChapter}
                    />
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)] sm:h-[calc(100vh-81px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50">
          <TableOfContents
            chapters={book.chapters}
            currentChapterId={currentChapter?.id}
            onChapterSelect={handleChapterSelect}
            loading={loadingChapter}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white/50 dark:bg-gray-800/50">
          {/* Mobile: Show TOC or Reading View based on state */}
          {isMobile ? (
            viewMode === 'toc' ? (
              <div className="h-full">
                <TableOfContents
                  chapters={book.chapters}
                  currentChapterId={currentChapter?.id}
                  onChapterSelect={handleChapterSelect}
                  loading={loadingChapter}
                />
              </div>
            ) : currentChapter ? (
              <ReadingView
                chapter={currentChapter}
                content={chapterContent}
                bookId={bookId!}
                loading={loadingChapter}
                onViewModeChange={setViewMode}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Select a Chapter
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Choose a chapter from the table of contents to start reading
                  </p>
                  <Button 
                    onClick={() => setViewMode('toc')}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Menu className="w-4 h-4 mr-2" />
                    Show Table of Contents
                  </Button>
                </div>
              </div>
            )
          ) : (
            /* Desktop: Always show reading view or placeholder */
            currentChapter ? (
              <ReadingView
                chapter={currentChapter}
                content={chapterContent}
                bookId={bookId!}
                loading={loadingChapter}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Select a Chapter
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Choose a chapter from the table of contents to start reading
                  </p>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Reader;
