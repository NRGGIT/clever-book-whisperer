
import { useState } from 'react';
import { Chapter } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, BookOpen, Loader2, BarChart3 } from 'lucide-react';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ReadingViewProps {
  chapter: Chapter;
  content: string;
  bookId: string;
  loading?: boolean;
}

export const ReadingView = ({ chapter, content, bookId, loading }: ReadingViewProps) => {
  const [viewMode, setViewMode] = useState<'full' | 'summary'>('full');
  const [summary, setSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0.3);
  const [language, setLanguage] = useState('English');
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const { toast } = useToast();

  const generateSummary = async () => {
    try {
      setSummaryLoading(true);
      const response = await ApiService.summarizeContent({
        content,
        ratio: compressionRatio,
        language: language.toLowerCase()
      });
      setSummary(response.summary);
      setSummaryStats(response);
      setViewMode('summary');
      toast({
        title: "Summary Generated",
        description: `Compressed to ${Math.round(response.actualRatio * 100)}% of original length`,
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        title: "Summary Failed",
        description: "Could not generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown parsing for basic formatting
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {chapter.title}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  Chapter {chapter.order}
                </Badge>
                {summaryStats && (
                  <Badge variant="secondary" className="text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {Math.round(summaryStats.actualRatio * 100)}% compressed
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'full' ? 'default' : 'outline'}
                onClick={() => setViewMode('full')}
                size="sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Full Text
              </Button>
              <Button
                variant={viewMode === 'summary' ? 'default' : 'outline'}
                onClick={() => setViewMode('summary')}
                size="sm"
                disabled={!summary}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Summary
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Controls */}
      {viewMode === 'summary' && (
        <Card className="m-6 mb-0">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Compression Ratio: {Math.round(compressionRatio * 100)}%
                </label>
                <Slider
                  value={[compressionRatio]}
                  onValueChange={(value) => setCompressionRatio(value[0])}
                  min={0.1}
                  max={0.8}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Russian">Russian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateSummary}
                disabled={summaryLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {summaryLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {viewMode === 'full' ? (
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                style={{ 
                  fontFamily: 'Crimson Pro, Georgia, serif',
                  fontSize: '18px',
                  lineHeight: '1.7'
                }}
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
              />
            </div>
          ) : summary ? (
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                style={{ 
                  fontFamily: 'Crimson Pro, Georgia, serif',
                  fontSize: '18px',
                  lineHeight: '1.7'
                }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Summary Generated
              </h3>
              <p className="text-gray-600 mb-6">
                Generate an AI summary to see a condensed version of this chapter
              </p>
              <Button 
                onClick={generateSummary}
                disabled={summaryLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Summary
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
