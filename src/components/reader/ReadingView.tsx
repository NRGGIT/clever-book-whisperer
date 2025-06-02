
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
import { Sparkles, BookOpen, Loader2, BarChart3, ChevronDown, Settings } from 'lucide-react';
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
  const [customPrompt, setCustomPrompt] = useState('');
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

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
    // Enhanced markdown parsing for better formatting
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal mb-1">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
      .replace(/<p class="mb-4"><\/p>/g, '');
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
                {summaryStats && (
                  <Badge variant="outline" className="text-xs">
                    {summaryStats.originalTokens} → {summaryStats.summaryTokens} tokens
                  </Badge>
                )}
              </div>
            </div>
            
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'full' | 'summary')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="full" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Full Text
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Summary
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'full' | 'summary')}>
          <TabsContent value="full" className="mt-0">
            <div className="max-w-4xl mx-auto p-6">
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
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            {/* AI Summarization Controls */}
            <Card className="m-6 mb-0">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Basic Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Compression Ratio: {Math.round(compressionRatio * 100)}%
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
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Language
                      </Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
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

                  {/* Advanced Options */}
                  <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Advanced Options
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="customPrompt" className="text-sm font-medium text-gray-700 mb-2 block">
                          Custom Prompt (Optional)
                        </Label>
                        <Textarea
                          id="customPrompt"
                          placeholder="e.g., Focus on key themes and character development..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Add specific instructions for the AI summarization
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>

            {/* Summary Content */}
            <div className="max-w-4xl mx-auto p-6">
              {summary ? (
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
                  
                  {/* Summary Statistics */}
                  {summaryStats && (
                    <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">Summary Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-amber-700">
                        <div>
                          <span className="font-medium">Original:</span> {summaryStats.originalTokens} tokens
                        </div>
                        <div>
                          <span className="font-medium">Summary:</span> {summaryStats.summaryTokens} tokens
                        </div>
                        <div>
                          <span className="font-medium">Compression:</span> {Math.round(summaryStats.actualRatio * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Summary Generated
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Adjust the settings above and click "Generate Summary" to create an AI-powered summary of this chapter
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
