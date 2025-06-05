import { useState } from 'react';
import { Chapter } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, BookOpen, Loader2, BarChart3, ChevronDown, Settings, Book } from 'lucide-react';
import { Mermaid } from '@/components/ui/mermaid';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useChapterSummaries } from '@/hooks/useChapterSummaries';

interface ReadingViewProps {
  chapter: Chapter;
  content: string;
  bookId: string;
  loading?: boolean;
  onViewModeChange?: (mode: 'toc' | 'reading') => void;
  isFullContent?: boolean;
}

export const ReadingView = ({ chapter, content, bookId, loading, onViewModeChange, isFullContent = false }: ReadingViewProps) => {
  const [viewMode, setViewMode] = useState<'full' | 'summary'>('full');
  const [summary, setSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0.3);
  const [language, setLanguage] = useState('English');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const { markChapterSummary } = useChapterSummaries();

  const handleTabChange = (value: string) => {
    setViewMode(value as 'full' | 'summary');
    
    // On mobile, if switching back to full text and we have onViewModeChange, 
    // we can update the parent state if needed
    if (value === 'full' && onViewModeChange && window.innerWidth < 768) {
      // This ensures proper mobile navigation state
    }
  };

  const generateSummary = async () => {
    try {
      setSummaryLoading(true);
      const response = await ApiService.summarizeContent({
        content,
        ratio: compressionRatio,
        language: language.toLowerCase(),
        customPrompt: customPrompt || undefined
      });
      setSummary(response.summary);
      setSummaryStats(response);
      markChapterSummary(chapter.id);
      toast({
        title: "Summary Generated",
        description: `Compressed to ${Math.round(response.actualRatio * 100)}% of original length`,
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        title: "Summary Failed",
        description: "Could not generate summary. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    // Split text by mermaid code blocks
    const parts = text.split(/(```mermaid[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a mermaid diagram
      if (part.startsWith('```mermaid') && part.endsWith('```')) {
        const mermaidCode = part.replace(/```mermaid\n?/, '').replace(/\n?```$/, '');
        return (
          <Mermaid
            key={`mermaid-${index}`}
            chart={mermaidCode}
            id={`diagram-${chapter.id}-${index}`}
          />
        );
      }
      
      // Regular markdown processing for non-mermaid parts
      if (part.trim()) {
        const processed = part
          .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">$1</h1>')
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
          .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc mb-1">$1</li>')
          .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal mb-1">$1</li>')
          .replace(/\n\n/g, '</p><p class="mb-4">')
          .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
          .replace(/<p class="mb-4"><\/p>/g, '');
        
        return (
          <div
            key={`text-${index}`}
            dangerouslySetInnerHTML={{ __html: processed }}
          />
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header - Mobile optimized */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-3 sm:p-6">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">
                {chapter.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge variant="outline" className="text-xs">
                  Chapter {chapter.order}
                </Badge>
                {isFullContent && (
                  <Badge variant="secondary" className="text-xs">
                    <Book className="w-3 h-3 mr-1" />
                    Full Content
                  </Badge>
                )}
                {summaryStats && (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {Math.round(summaryStats.actualRatio * 100)}% compressed
                    </Badge>
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                      {summaryStats.originalTokens} → {summaryStats.summaryTokens} tokens
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <Tabs value={viewMode} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 h-8 sm:h-10">
                <TabsTrigger value="full" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">
                    {isFullContent ? 'Full Content' : 'Chapter Text'}
                  </span>
                  <span className="sm:hidden">Text</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">AI Summary</span>
                  <span className="sm:hidden">Summary</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={viewMode} onValueChange={handleTabChange}>
          <TabsContent value="full" className="mt-0">
            <div className="max-w-4xl mx-auto p-3 sm:p-6">
              {isFullContent && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-sm flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    Full Chapter Content
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    This view includes the main chapter content along with all its subsections and subchapters.
                  </p>
                </div>
              )}
              <div className="prose prose-sm sm:prose-lg max-w-none">
                <div 
                  className="text-gray-800 dark:text-gray-200 leading-relaxed"
                  style={{ 
                    fontFamily: 'Crimson Pro, Georgia, serif',
                    fontSize: window.innerWidth < 640 ? '16px' : '18px',
                    lineHeight: '1.7'
                  }}
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            {/* AI Summarization Controls - Mobile optimized */}
            <Card className="m-3 sm:m-6 mb-0">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-4">
                  {isFullContent && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1 text-sm flex items-center gap-2">
                        <Book className="w-4 h-4" />
                        Summarizing Full Chapter
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        You're about to summarize the complete chapter including all subsections. This may take longer to process.
                      </p>
                    </div>
                  )}

                  {/* Basic Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Compression: {Math.round(compressionRatio * 100)}%
                      </Label>
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
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Language
                      </Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Russian">Russian</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Button 
                        onClick={generateSummary}
                        disabled={summaryLoading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-sm"
                        size="sm"
                      >
                        {summaryLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Generate Summary
                      </Button>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Advanced Options
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="customPrompt" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Custom Prompt (Optional)
                        </Label>
                        <Textarea
                          id="customPrompt"
                          placeholder="e.g., Focus on key themes and character development, include diagrams where helpful..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          className="min-h-[60px] sm:min-h-[80px] text-sm"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Add specific instructions for the AI summarization. You can request Mermaid diagrams for visual representation.
                          {isFullContent && ' Note: Full chapter summaries work especially well with structural diagrams.'}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>

            {/* Summary Content */}
            <div className="max-w-4xl mx-auto p-3 sm:p-6">
              {summary ? (
                <div className="prose prose-sm sm:prose-lg max-w-none">
                  <div 
                    className="text-gray-800 dark:text-gray-200 leading-relaxed"
                    style={{ 
                      fontFamily: 'Crimson Pro, Georgia, serif',
                      fontSize: window.innerWidth < 640 ? '16px' : '18px',
                      lineHeight: '1.7'
                    }}
                  >
                    {renderMarkdown(summary)}
                  </div>
                  
                  {/* Summary Statistics */}
                  {summaryStats && (
                    <div className="mt-8 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 text-sm">Summary Statistics</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                        <div>
                          <span className="font-medium">Original:</span> {summaryStats.originalTokens} tokens
                        </div>
                        <div>
                          <span className="font-medium">Summary:</span> {summaryStats.summaryTokens} tokens
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <span className="font-medium">Compression:</span> {Math.round(summaryStats.actualRatio * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Summary Generated
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm px-4">
                    Adjust the settings above and click "Generate Summary" to create an AI-powered summary of this {isFullContent ? 'full chapter' : 'chapter'}. You can request diagrams in your custom prompt!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
