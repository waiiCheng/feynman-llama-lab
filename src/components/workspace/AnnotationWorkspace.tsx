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
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-foreground">
                {t('annotation.title')}
              </h1>
              <Badge variant="outline" className="text-xs font-normal">
                {showPreview ? '双屏模式' : '单屏模式'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {showShortcuts && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mr-4">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">{t('shortcuts.save')}</kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">{t('shortcuts.template')}</kbd>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="h-8"
              >
                <Keyboard className="w-4 h-4 mr-1" />
                <span className="text-xs">快捷键</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="h-8 w-8 p-0"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="h-8"
              >
                <Languages className="w-4 h-4 mr-1" />
                <span className="text-xs font-mono">{language === 'zh' ? 'EN' : '中'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="container mx-auto px-6 py-8">
        {showPreview ? (
          <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-160px)]">
            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="pr-6">
                <AnnotationForm
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSaveAndNext}
                  onInsertTemplate={insertTemplateText}
                  responseRef={responseRef}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle className="bg-border hover:bg-border data-[panel-group-direction=vertical]:cursor-row-resize data-[panel-group-direction=horizontal]:cursor-col-resize data-[panel-group-direction=horizontal]:w-px data-[panel-group-direction=vertical]:h-px" />
            
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="pl-6">
                <PreviewPanel formData={formData} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="max-w-4xl mx-auto">
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