
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '@/services/api';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConfigResponse {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
  prompt: string;
  defaultRatio: number;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<ConfigResponse>({
    apiEndpoint: 'https://api.openai.com/v1',
    apiKey: '',
    modelName: 'gpt-4o-mini',
    prompt: 'You are a helpful assistant that creates concise, accurate summaries of text content. Maintain the key information and main ideas while reducing the length according to the specified ratio. Keep the summary coherent and well-structured.',
    defaultRatio: 0.3,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const configData = await ApiService.getConfig();
      setConfig(configData);
    } catch (error) {
      console.error('Failed to load config:', error);
      toast({
        title: "Error",
        description: "Failed to load configuration settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      await ApiService.updateConfig(config);
      toast({
        title: "Settings Saved",
        description: "Configuration has been updated successfully",
      });
    } catch (error) {
      console.error('Failed to save config:', error);
      toast({
        title: "Save Failed",
        description: "Could not save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
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
              <SettingsIcon className="w-5 h-5 text-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              AI Configuration
            </CardTitle>
            <p className="text-gray-600">
              Configure OpenAI settings for summarization
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* OpenAI API Key */}
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={config.apiKey || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Your API key is stored securely and used only for summarization requests
              </p>
            </div>

            {/* API Endpoint */}
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                type="text"
                placeholder="https://api.openai.com/v1"
                value={config.apiEndpoint || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, apiEndpoint: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                OpenAI API endpoint URL
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={config.modelName} onValueChange={(value) => setConfig(prev => ({ ...prev, modelName: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4O Mini (Fast & Economical)</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4O (Powerful)</SelectItem>
                  <SelectItem value="gpt-4">GPT-4 (Legacy)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Economic)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Default Ratio */}
            <div className="space-y-2">
              <Label htmlFor="defaultRatio">Default Summarization Ratio</Label>
              <Input
                id="defaultRatio"
                type="number"
                min="0.1"
                max="0.8"
                step="0.1"
                value={config.defaultRatio}
                onChange={(e) => setConfig(prev => ({ ...prev, defaultRatio: parseFloat(e.target.value) }))}
              />
              <p className="text-sm text-gray-500">
                Default compression ratio for summaries (0.1 = very short, 0.8 = detailed)
              </p>
            </div>

            {/* System Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">System Prompt</Label>
              <textarea
                id="prompt"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter the system prompt for AI summarization..."
                value={config.prompt || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Instructions for the AI on how to generate summaries
              </p>
            </div>

            {/* Save Button */}
            <Button 
              onClick={saveConfig}
              disabled={saving}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
