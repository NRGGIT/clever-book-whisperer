
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Settings as SettingsIcon, Loader2, Moon, Sun, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConfigResponse {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
  prompt: string;
  defaultRatio: number;
}

interface ModelInfo {
  name: string;
  alias: string;
  hostedBy: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [config, setConfig] = useState<ConfigResponse>({
    apiEndpoint: '',
    apiKey: '',
    modelName: '',
    prompt: '',
    defaultRatio: 0.3,
  });
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const configData = await ApiService.getConfig();
      console.log('Loaded config:', configData);
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

  const loadAvailableModels = async () => {
    try {
      setLoadingModels(true);
      const models = await ApiService.getAvailableModels();
      console.log('Loaded models:', models);
      setAvailableModels(models);
      toast({
        title: "Models Loaded",
        description: `Found ${models.length} available models`,
      });
    } catch (error) {
      console.error('Failed to load models:', error);
      toast({
        title: "Models Load Failed",
        description: "Could not load available models. Please check your API configuration.",
        variant: "destructive",
      });
    } finally {
      setLoadingModels(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      console.log('Saving config:', config);
      await ApiService.updateConfig(config);
      toast({
        title: "Settings Saved",
        description: "Configuration has been updated successfully",
      });
      // Reload config to ensure we have the latest data
      await loadConfig();
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-amber-100 dark:hover:bg-gray-800 p-1 sm:p-2"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Library</span>
              </Button>
              <div className="hidden md:block">
                <Logo />
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-1 sm:p-2"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-2xl">
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              AI Configuration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Configure AI settings for summarization
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-6">
            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your API key"
                value={config.apiKey || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your API key is stored securely and used only for summarization requests
              </p>
            </div>

            {/* API Endpoint */}
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint" className="text-sm">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                type="text"
                placeholder="https://api.example.com"
                value={config.apiEndpoint || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI API endpoint URL
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="model" className="text-sm">AI Model</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadAvailableModels}
                  disabled={loadingModels}
                  className="p-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingModels ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              {availableModels.length > 0 ? (
                <Select 
                  value={config.modelName || ''} 
                  onValueChange={(value) => setConfig(prev => ({ ...prev, modelName: value }))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.name} value={model.name} className="text-sm">
                        <div className="flex flex-col">
                          <span>{model.name}</span>
                          <span className="text-xs text-gray-500">
                            {model.alias} - {model.hostedBy}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="modelName"
                  type="text"
                  placeholder="Enter model name (e.g., gpt-4.1-nano)"
                  value={config.modelName || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, modelName: e.target.value }))}
                  className="text-sm"
                />
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {availableModels.length > 0 
                  ? `${availableModels.length} models loaded from API` 
                  : 'Enter model name manually or click refresh to load available models'
                }
              </p>
            </div>

            {/* Default Ratio */}
            <div className="space-y-2">
              <Label htmlFor="defaultRatio" className="text-sm">Default Summarization Ratio</Label>
              <Input
                id="defaultRatio"
                type="number"
                min="0.1"
                max="0.8"
                step="0.1"
                value={config.defaultRatio || 0.3}
                onChange={(e) => setConfig(prev => ({ ...prev, defaultRatio: parseFloat(e.target.value) || 0.3 }))}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Default compression ratio for summaries (0.1 = very short, 0.8 = detailed)
              </p>
            </div>

            {/* System Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm">System Prompt</Label>
              <textarea
                id="prompt"
                className="flex min-h-[80px] sm:min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter the system prompt for AI summarization..."
                value={config.prompt || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Instructions for the AI on how to generate summaries
              </p>
            </div>

            {/* Save Button */}
            <Button 
              onClick={saveConfig}
              disabled={saving}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-sm"
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
