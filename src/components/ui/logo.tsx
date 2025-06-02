
import { BookOpen } from 'lucide-react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-sm"></div>
        <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          EpubAI
        </span>
        <span className="text-xs text-gray-500 -mt-1">Smart Reader</span>
      </div>
    </div>
  );
};
