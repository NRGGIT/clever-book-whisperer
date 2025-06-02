
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '@/services/api';
import { AppConfig } from '@/types';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<AppConfig>({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4000,
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
                value={config.openaiApiKey || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, openaiApiKey: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Your API key is stored securely and used only for summarization requests
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select value={config.model} onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4O Mini (Fast & Economical)</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4O (Powerful)</SelectItem>
                  <SelectItem value="gpt-4.5-preview">GPT-4.5 Preview (Most Advanced)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-sm text-gray-500">{config.temperature}</span>
              </div>
              <Slider
                value={[config.temperature]}
                onValueChange={(value) => setConfig(prev => ({ ...prev, temperature: value[0] }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Controls creativity. Lower values are more focused, higher values are more creative.
              </p>
            </div>

            {/* Max Tokens */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <span className="text-sm text-gray-500">{config.maxTokens}</span>
              </div>
              <Slider
                value={[config.maxTokens]}
                onValueChange={(value) => setConfig(prev => ({ ...prev, maxTokens: value[0] }))}
                min={1000}
                max={8000}
                step={500}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Maximum length of generated summaries
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
