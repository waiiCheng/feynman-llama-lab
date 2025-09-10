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
    <div className="min-h-screen bg-background relative">
      {/* Workspace Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-display text-foreground font-display">
                {t('annotation.title')}
              </h1>
              <Badge variant="outline" className="text-caption px-3 py-1 rounded-lg">
                {showPreview ? '双屏模式' : '单屏模式'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {showShortcuts && (
                <div className="flex items-center gap-3 text-caption mr-6">
                  <kbd className="px-3 py-1.5 bg-secondary rounded-md font-mono">{t('shortcuts.save')}</kbd>
                  <kbd className="px-3 py-1.5 bg-secondary rounded-md font-mono">{t('shortcuts.template')}</kbd>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="h-9 px-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                <span className="text-label">快捷键</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="h-9 w-9 p-0 rounded-lg hover:bg-secondary transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="h-9 px-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Languages className="w-4 h-4 mr-2" />
                <span className="text-label font-mono">{language === 'zh' ? 'EN' : '中'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="container mx-auto px-8 py-10">
        {showPreview ? (
          <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-180px)] gap-8">
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
            
            <ResizableHandle className="w-px bg-border hover:bg-primary/20 transition-colors" />
            
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
  );
};