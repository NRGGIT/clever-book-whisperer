
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { BookListItem, EpubStructure, Chapter } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useBooks = () => {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await ApiService.getAllBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Failed to load books:', error);
      toast({
        title: "Error",
        description: "Failed to load your book library",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadBook = async (file: File) => {
    try {
      setUploading(true);
      const result = await ApiService.uploadEpub(file);
      await loadBooks(); // Refresh the book list
      toast({
        title: "Success",
        description: `"${result.title}" has been added to your library`,
      });
      return result;
    } catch (error) {
      console.error('Failed to upload book:', error);
      toast({
        title: "Upload Failed",
        description: "Please check your file and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteBook = async (bookId: string) => {
    try {
      await ApiService.deleteBook(bookId);
      setBooks(prev => prev.filter(book => book.id !== bookId));
      toast({
        title: "Book Deleted",
        description: "The book has been removed from your library",
      });
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the book. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return {
    books,
    loading,
    uploading,
    loadBooks,
    uploadBook,
    deleteBook,
  };
};

export const useBookReader = (bookId: string | null) => {
  const [book, setBook] = useState<EpubStructure | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [chapterContent, setChapterContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const { toast } = useToast();

  const loadBook = async (id: string) => {
    try {
      setLoading(true);
      const bookData = await ApiService.getBookStructure(id);
      setBook(bookData);
      if (bookData.chapters.length > 0) {
        await loadChapter(id, bookData.chapters[0].id);
      }
    } catch (error) {
      console.error('Failed to load book:', error);
      toast({
        title: "Error",
        description: "Failed to load the book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadChapter = async (bookId: string, chapterId: string) => {
    try {
      setLoadingChapter(true);
      const chapterData = await ApiService.getChapterContent(bookId, chapterId);
      const chapter = book?.chapters.find(c => c.id === chapterId);
      if (chapter) {
        setCurrentChapter(chapter);
        setChapterContent(chapterData.content);
      }
    } catch (error) {
      console.error('Failed to load chapter:', error);
      toast({
        title: "Error",
        description: "Failed to load the chapter",
        variant: "destructive",
      });
    } finally {
      setLoadingChapter(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      loadBook(bookId);
    }
  }, [bookId]);

  return {
    book,
    currentChapter,
    chapterContent,
    loading,
    loadingChapter,
    loadChapter,
  };
};
