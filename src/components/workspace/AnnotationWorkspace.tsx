import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useShortcuts } from '@/hooks/useShortcuts';
import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { AnnotationForm } from './AnnotationForm';
import { PreviewPanel } from './PreviewPanel';
import { ClassicalBackground } from '@/components/effects/ClassicalBackground';
import { TypewriterTitle } from '@/components/effects/TypewriterTitle';
import { Keyboard, EyeOff, Eye, Languages } from 'lucide-react';

interface AnnotationData {
  question: string;
  response: string;
  styleFeatures: string[];
  quality: string;
  notes: string;
}

export const AnnotationWorkspace: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [formData, setFormData] = useState<AnnotationData>({
    question: '',
    response: '',
    styleFeatures: [],
    quality: '',
    notes: ''
  });
  const [showPreview, setShowPreview] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const responseRef = useRef<HTMLTextAreaElement>(null);

  const handleSaveAndNext = () => {
    // TODO: Implement save logic
    console.log('Save and next:', formData);
    // Reset form after save
    setFormData({
      question: '',
      response: '',
      styleFeatures: [],
      quality: '',
      notes: ''
    });
  };

  const handleClear = () => {
    setFormData({
      question: '',
      response: '',
      styleFeatures: [],
      quality: '',
      notes: ''
    });
  };

  const handleInsertTemplate = () => {
    // Focus the response textarea for template insertion
    responseRef.current?.focus();
  };

  const insertTemplateText = (template: string) => {
    const textarea = responseRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newText = before + template + ' ' + after;
    setFormData(prev => ({ ...prev, response: newText }));
    
    // Set cursor position after template
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length + 1, start + template.length + 1);
    }, 0);
  };

  useShortcuts({
    onSaveAndNext: handleSaveAndNext,
    onClear: handleClear,
    onTemplate: handleInsertTemplate,
  });

  return (
    <div className="min-h-screen classical-bg animate-classical-float relative">
      {/* Classical Background Canvas */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-black via-classical-bronze/10 to-feynman-blue/5" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, hsl(var(--classical-gold) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--royal-purple) / 0.08) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, hsl(var(--classical-gold) / 0.02) 42%, transparent 44%)
          `
        }} />
      </div>

      {/* Workspace Header */}
      <div className="relative z-10 border-b border-classical-gold/20 bg-gradient-classical backdrop-blur-xl shadow-royal">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 animate-royal-entrance">
              <div className="typewriter-title-container">
                <h1 className="text-3xl font-bold font-physics tracking-wide">
                  <span className="bg-gradient-hero bg-clip-text text-transparent animate-typewriter">
                    {t('annotation.title')}
                  </span>
                </h1>
              </div>
              <div className="flex items-center space-x-4 animate-marble-shimmer">
                <Badge variant="outline" className="font-mono text-xs bg-gradient-subtle border-classical-gold/40 text-classical-gold shadow-soft">
                  {showPreview ? '双屏模式' : '单屏模式'}
                </Badge>
                {showShortcuts && (
                  <div className="flex items-center space-x-2 text-xs text-feynman-muted science-text">
                    <span className="bg-classical-gold/10 px-2 py-1 rounded border border-classical-gold/20">{t('shortcuts.save')}</span>
                    <span className="text-classical-gold">•</span>
                    <span className="bg-feynman-terminal/10 px-2 py-1 rounded border border-feynman-terminal/20">{t('shortcuts.template')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="glow-border hover:shadow-terminal font-physics text-classical-gold hover:text-marble-white transition-all duration-300"
              >
                <Keyboard className="w-4 h-4 mr-2 animate-quantum-pulse" />
                快捷键
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="glow-border hover:shadow-glow bg-gradient-subtle hover:bg-gradient-royal transition-all duration-300"
              >
                {showPreview ? <EyeOff className="w-4 h-4 text-royal-purple" /> : <Eye className="w-4 h-4 text-feynman-terminal" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="glow-border hover:shadow-classical bg-gradient-subtle transition-all duration-300"
              >
                <Languages className="w-4 h-4 mr-2 text-feynman-terminal animate-energy-wave" />
                <span className="font-mono text-classical-gold">{language === 'zh' ? 'EN' : '中'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-royal-entrance" style={{ animationDelay: '0.3s' }}>
          {showPreview ? (
            <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-200px)]">
              <ResizablePanel defaultSize={60} minSize={40}>
                <div className="pr-4">
                  <AnnotationForm
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSaveAndNext}
                    onInsertTemplate={insertTemplateText}
                    responseRef={responseRef}
                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle className="bg-classical-gold/20 hover:bg-classical-gold/30 transition-colors" />
              
              <ResizablePanel defaultSize={40} minSize={30}>
                <div className="pl-4">
                  <PreviewPanel formData={formData} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="max-w-5xl mx-auto">
              <AnnotationForm
                formData={formData}
                setFormData={setFormData}
                onSave={handleSaveAndNext}
                onInsertTemplate={insertTemplateText}
                responseRef={responseRef}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed bottom-4 left-4 opacity-20 pointer-events-none">
        <div className="w-32 h-32 border border-classical-gold/30 rounded-full animate-quantum-pulse" />
      </div>
      <div className="fixed top-1/3 right-4 opacity-15 pointer-events-none">
        <div className="w-24 h-24 border border-royal-purple/40 rotate-45 animate-energy-wave" />
      </div>
    </div>
  );
};