
import { BookListItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, FileText, Trash2, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: BookListItem;
  onDelete: () => void;
  onRead: () => void;
}

export const BookCard = ({ book, onDelete, onRead }: BookCardProps) => {
  const uploadDate = new Date(book.uploadDate).toLocaleDateString();

  return (
    <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{book.chapterCount} chapters</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Added {uploadDate}</span>
          </div>
          
          {book.metadata?.language && (
            <div className="inline-block">
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                {book.metadata.language}
              </span>
            </div>
          )}
          
          <Button 
            onClick={onRead}
            className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Read Book
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
