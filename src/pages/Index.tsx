
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { Logo } from '@/components/ui/logo';
import { BookCard } from '@/components/library/BookCard';
import { UploadZone } from '@/components/library/UploadZone';
import { Button } from '@/components/ui/button';
import { RefreshCw, Library, Plus } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { books, loading, uploading, loadBooks, uploadBook, deleteBook } = useBooks();
  const [showUpload, setShowUpload] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadBook(file);
      navigate(`/reader/${result.id}`);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleReadBook = (bookId: string) => {
    navigate(`/reader/${bookId}`);
  };

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
                className="hidden sm:flex"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                onClick={() => setShowUpload(!showUpload)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Upload Section */}
        {showUpload && (
          <UploadZone 
            onUpload={handleUpload}
            uploading={uploading}
          />
        )}

        {/* Library Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6 text-amber-500" />
              <h1 className="text-3xl font-bold text-gray-900">Your Library</h1>
            </div>
            <div className="text-sm text-gray-600">
              {books.length} book{books.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <Library className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Books Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first EPUB book to start reading with AI-powered summaries
              </p>
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Your First Book
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onRead={handleReadBook}
                  onDelete={deleteBook}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
