
import { Link } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/library/BookCard';
import { UploadZone } from '@/components/library/UploadZone';
import { RefreshCw, Settings, Loader2 } from 'lucide-react';

const Index = () => {
  const { books, loading, uploading, loadBooks, uploadBook, deleteBook } = useBooks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadBooks}
                disabled={loading}
                className="hover:bg-amber-100"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              
              <Button
                asChild
                variant="ghost"
                className="hover:bg-amber-100"
              >
                <Link to="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Your AI-Powered Library
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload EPUB books and experience intelligent reading with AI-generated summaries and insights
          </p>
        </div>

        {/* Upload Zone */}
        <div className="mb-12">
          <UploadZone onUpload={uploadBook} uploading={uploading} />
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your library...</p>
            </div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Books Yet</h3>
            <p className="text-gray-600 mb-6">Upload your first EPUB file to get started with AI-powered reading</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Books ({books.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onDelete={() => deleteBook(book.id)}
                  onRead={() => window.location.href = `/reader/${book.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
