import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useShortcuts } from '@/hooks/useShortcuts';
import { useAutoAnnotation } from '@/hooks/useAutoAnnotation';
import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { AnnotationForm } from './AnnotationForm';
import { PreviewPanel } from './PreviewPanel';
import { AutoSuggestionPanel } from '@/components/suggestion/AutoSuggestionPanel';
import { TypewriterTitle } from '@/components/effects/TypewriterTitle';
import { Keyboard, EyeOff, Eye, Languages, Code, FileText } from 'lucide-react';

import { BreakdownStep, FeynmanMethod, AnnotationData } from '@/types/annotation';

const FEYNMAN_JSON_TEMPLATE = `{
  "core_concept": "这里填写核心概念",
  "analogy": {
    "domain": "日常生活",
    "scenario": "这里填写类比的场景，比如'推箱子'",
    "description": "这里详细描述类比"
  },
  "breakdown": [
    {
      "step": 1,
      "explanation": "这里写分解步骤一的解释",
      "linked_concept": "这里写关联的概念"
    }
  ],
  "summary": "这里填写最终的总结"
}`;

export const AnnotationWorkspace: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { applyTemplate } = useAutoAnnotation();
  const [formData, setFormData] = useState<AnnotationData>({
    question: '',
    response: '',
    answer_final: '',
    feynman_method: {
      core_concept: '',
      analogy: {
        domain: '日常生活',
        scenario: '',
        description: ''
      },
      breakdown: [
        { step: 1, explanation: '', linked_concept: '' }
      ],
      summary: ''
    },
    styleFeatures: [],
    quality: '',
    notes: '',
    source: ''
  });
  const [showPreview, setShowPreview] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonError, setJsonError] = useState<string>('');
  const responseRef = useRef<HTMLTextAreaElement>(null);

  const handleSaveAndNext = () => {
    // TODO: Implement save logic
    console.log('Save and next:', formData);
    // Reset form after save
    setFormData({
      question: '',
      response: '',
      answer_final: '',
      feynman_method: {
        core_concept: '',
        analogy: {
          domain: '日常生活',
          scenario: '',
          description: ''
        },
        breakdown: [
          { step: 1, explanation: '', linked_concept: '' }
        ],
        summary: ''
      },
      styleFeatures: [],
      quality: '',
      notes: '',
      source: ''
    });
  };

  const handleClear = () => {
    setFormData({
      question: '',
      response: '',
      answer_final: '',
      feynman_method: {
        core_concept: '',
        analogy: {
          domain: '日常生活',
          scenario: '',
          description: ''
        },
        breakdown: [
          { step: 1, explanation: '', linked_concept: '' }
        ],
        summary: ''
      },
      styleFeatures: [],
      quality: '',
      notes: '',
      source: ''
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

  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      feynman_method: {
        ...prev.feynman_method,
        breakdown: [
          ...prev.feynman_method.breakdown,
          { 
            step: prev.feynman_method.breakdown.length + 1, 
            explanation: '', 
            linked_concept: '' 
          }
        ]
      }
    }));
  };

  // JSON模式相关函数
  const handleJsonModeToggle = () => {
    setJsonMode(!jsonMode);
    setJsonError('');
  };

  const parseJsonToForm = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        setFormData(prev => ({
          ...prev,
          feynman_method: {
            core_concept: parsed.core_concept || prev.feynman_method.core_concept,
            analogy: {
              domain: parsed.analogy?.domain || prev.feynman_method.analogy.domain,
              scenario: parsed.analogy?.scenario || prev.feynman_method.analogy.scenario,
              description: parsed.analogy?.description || prev.feynman_method.analogy.description,
            },
            breakdown: parsed.breakdown || prev.feynman_method.breakdown,
            summary: parsed.summary || prev.feynman_method.summary,
          }
        }));
        setJsonError('');
      }
    } catch (error) {
      setJsonError('JSON格式错误，请检查语法');
    }
  };

  const handleAutoSuggestion = (template: Partial<FeynmanMethod>) => {
    applyTemplate(template, formData.feynman_method, setFormData);
  };

  const getJsonFromForm = () => {
    return JSON.stringify(formData.feynman_method, null, 2);
  };

  useShortcuts({
    onSave: handleSaveAndNext,
    onSaveAndNext: handleSaveAndNext,
    onClear: handleClear,
    onTemplate: handleInsertTemplate,
    onAddStep: handleAddStep,
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
                {showPreview ? t('workspace.dualMode') : t('workspace.singleMode')}
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
                <span className="text-label">{t('shortcuts.keyboard')}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="h-9 w-9 p-0 rounded-lg hover:bg-secondary transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="container mx-auto px-8 py-10">
        {showPreview ? (
          <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-180px)] gap-8">
            <ResizablePanel defaultSize={50} minSize={35}>
              <div className="pr-4">
                <AnnotationForm
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSaveAndNext}
                  onInsertTemplate={insertTemplateText}
                  responseRef={responseRef}
                  jsonMode={jsonMode}
                  onJsonModeToggle={handleJsonModeToggle}
                  onJsonChange={parseJsonToForm}
                  jsonError={jsonError}
                  getJsonFromForm={getJsonFromForm}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="w-px bg-border hover:bg-primary/20 transition-colors" />
            
            <ResizablePanel defaultSize={30} minSize={25}>
              <div className="pl-4 space-y-6">
                <AutoSuggestionPanel
                  text={formData.answer_final}
                  onApplySuggestion={handleAutoSuggestion}
                />
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
              jsonMode={jsonMode}
              onJsonModeToggle={handleJsonModeToggle}
              onJsonChange={parseJsonToForm}
              jsonError={jsonError}
              getJsonFromForm={getJsonFromForm}
            />
          </div>
        )}
      </div>
    </div>
  );
};