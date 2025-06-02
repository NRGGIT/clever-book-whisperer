
import { useParams, useNavigate } from 'react-router-dom';
import { useBookReader } from '@/hooks/useBooks';
import { Logo } from '@/components/ui/logo';
import { TableOfContents } from '@/components/reader/TableOfContents';
import { ReadingView } from '@/components/reader/ReadingView';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Menu, Loader2 } from 'lucide-react';

const Reader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { book, currentChapter, chapterContent, loading, loadingChapter, loadChapter } = useBookReader(bookId || null);

  const handleChapterSelect = (chapterId: string) => {
    if (bookId) {
      loadChapter(bookId, chapterId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
          <p className="text-gray-600 mb-6">The requested book could not be loaded.</p>
          <Button onClick={() => navigate('/')}>
            Return to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="hover:bg-amber-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Library
              </Button>
              <div className="hidden md:block">
                <Logo />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <h2 className="font-semibold text-gray-900">{book.title}</h2>
                {book.author && (
                  <p className="text-sm text-gray-600">{book.author}</p>
                )}
              </div>
              
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-81px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/50">
          <TableOfContents
            chapters={book.chapters}
            currentChapterId={currentChapter?.id}
            onChapterSelect={handleChapterSelect}
            loading={loadingChapter}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white/50">
          {currentChapter ? (
            <ReadingView
              chapter={currentChapter}
              content={chapterContent}
              bookId={bookId!}
              loading={loadingChapter}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Chapter
                </h3>
                <p className="text-gray-600">
                  Choose a chapter from the table of contents to start reading
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reader;
