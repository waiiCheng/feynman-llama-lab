import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Lightbulb, BookOpen, Zap, Target, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreakdownStep {
  step: number;
  explanation: string;
  linked_concept: string;
}

interface FeynmanMethod {
  core_concept: string;
  analogy: {
    domain: string;
    scenario: string;
    description: string;
  };
  breakdown: BreakdownStep[];
  summary: string;
}

interface AnnotationData {
  question: string;
  response: string;
  answer_final: string;
  feynman_method: FeynmanMethod;
  styleFeatures: string[];
  quality: string;
  notes: string;
}

const styleOptions = [
  { id: 'analogy', labelKey: 'style.analogy', icon: Lightbulb, descKey: 'style.analogy.desc' },
  { id: 'simplify', labelKey: 'style.simplify', icon: Target, descKey: 'style.simplify.desc' },
  { id: 'story', labelKey: 'style.story', icon: BookOpen, descKey: 'style.story.desc' },
  { id: 'firstprinciples', labelKey: 'style.firstprinciples', icon: Zap, descKey: 'style.firstprinciples.desc' },
];

const AnnotationForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
    notes: ''
  });

  const handleStyleFeatureChange = (featureId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      styleFeatures: checked 
        ? [...prev.styleFeatures, featureId]
        : prev.styleFeatures.filter(id => id !== featureId)
    }));
  };

  const addBreakdownStep = () => {
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

  const removeBreakdownStep = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      feynman_method: {
        ...prev.feynman_method,
        breakdown: prev.feynman_method.breakdown
          .filter((_, index) => index !== indexToRemove)
          .map((step, index) => ({ ...step, step: index + 1 }))
      }
    }));
  };

  const handleBreakdownChange = (index: number, field: keyof BreakdownStep, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      feynman_method: {
        ...prev.feynman_method,
        breakdown: prev.feynman_method.breakdown.map((step, i) => 
          i === index ? { ...step, [field]: value } : step
        )
      }
    }));
  };

  const handleSave = () => {
    if (!formData.question.trim() || !formData.answer_final.trim()) {
      toast({
        title: t('annotation.validation.title'),
        description: t('annotation.validation.desc'),
        variant: "destructive"
      });
      return;
    }

    // Save in new format - no JSON parsing needed, data is already structured
    const timestamp = new Date().toISOString();
    const annotation = {
      id: Date.now().toString(),
      question: formData.question,
      answer_final: formData.answer_final,
      feynman_method: formData.feynman_method,
      quality_score: formData.quality,
      styleFeatures: formData.styleFeatures,
      notes: formData.notes,
      timestamp,
      annotator: 'user'
    };

    const existingData = JSON.parse(localStorage.getItem('feynman-annotations') || '[]');
    existingData.push(annotation);
    localStorage.setItem('feynman-annotations', JSON.stringify(existingData));

    toast({
      title: t('annotation.saved.title'),
      description: t('annotation.saved.desc')
    });

    // Reset form
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
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Question Input */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            {t('annotation.question')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={t('annotation.question.placeholder')}
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className="text-base"
          />
        </CardContent>
      </Card>

      {/* Final Answer */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            {t('annotation.finalAnswer')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t('annotation.finalAnswer.placeholder')}
            value={formData.answer_final}
            onChange={(e) => setFormData(prev => ({ ...prev, answer_final: e.target.value }))}
            rows={4}
            className="text-base leading-relaxed resize-none"
          />
        </CardContent>
      </Card>

      {/* Feynman Method - Structured Input */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            {t('annotation.feynmanMethod')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Concept */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              {t('annotation.feynman.coreConcept')}
            </Label>
            <Input
              placeholder={t('annotation.feynman.coreConcept.placeholder')}
              value={formData.feynman_method.core_concept}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                feynman_method: { ...prev.feynman_method, core_concept: e.target.value }
              }))}
              className="text-base"
            />
          </div>

          {/* Analogy Section */}
          <Card className="bg-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-foreground">
                {t('annotation.feynman.analogy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-foreground mb-2 block">
                  {t('annotation.feynman.analogy.domain')}
                </Label>
                <Input
                  placeholder={t('annotation.feynman.analogy.domain.placeholder')}
                  value={formData.feynman_method.analogy.domain}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    feynman_method: {
                      ...prev.feynman_method,
                      analogy: { ...prev.feynman_method.analogy, domain: e.target.value }
                    }
                  }))}
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-2 block">
                  {t('annotation.feynman.analogy.scenario')}
                </Label>
                <Input
                  placeholder={t('annotation.feynman.analogy.scenario.placeholder')}
                  value={formData.feynman_method.analogy.scenario}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    feynman_method: {
                      ...prev.feynman_method,
                      analogy: { ...prev.feynman_method.analogy, scenario: e.target.value }
                    }
                  }))}
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-2 block">
                  {t('annotation.feynman.analogy.description')}
                </Label>
                <Textarea
                  placeholder={t('annotation.feynman.analogy.description.placeholder')}
                  value={formData.feynman_method.analogy.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    feynman_method: {
                      ...prev.feynman_method,
                      analogy: { ...prev.feynman_method.analogy, description: e.target.value }
                    }
                  }))}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Breakdown Steps */}
          <Card className="bg-accent/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-foreground">
                  {t('annotation.feynman.breakdown')}
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBreakdownStep}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('annotation.feynman.breakdown.add')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.feynman_method.breakdown.map((step, index) => (
                <Card key={index} className="border-l-4 border-primary/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-foreground">
                        {t('annotation.feynman.breakdown.step')} {step.step}
                      </h5>
                      {formData.feynman_method.breakdown.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBreakdownStep(index)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {t('annotation.feynman.breakdown.remove')}
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          {t('annotation.feynman.breakdown.explanation')}
                        </Label>
                        <Textarea
                          placeholder={t('annotation.feynman.breakdown.explanation.placeholder')}
                          value={step.explanation}
                          onChange={(e) => handleBreakdownChange(index, 'explanation', e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">
                          {t('annotation.feynman.breakdown.linkedConcept')}
                        </Label>
                        <Input
                          placeholder={t('annotation.feynman.breakdown.linkedConcept.placeholder')}
                          value={step.linked_concept}
                          onChange={(e) => handleBreakdownChange(index, 'linked_concept', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              {t('annotation.feynman.summary')}
            </Label>
            <Textarea
              placeholder={t('annotation.feynman.summary.placeholder')}
              value={formData.feynman_method.summary}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                feynman_method: { ...prev.feynman_method, summary: e.target.value }
              }))}
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feynman Response (Legacy) */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            {t('annotation.response')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t('annotation.response.placeholder')}
            value={formData.response}
            onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
            rows={8}
            className="text-base leading-relaxed resize-none"
          />
        </CardContent>
      </Card>

      {/* Style Features */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            {t('annotation.styleFeatures')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={formData.styleFeatures.includes(option.id)}
                      onCheckedChange={(checked) => handleStyleFeatureChange(option.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="flex items-center space-x-2 cursor-pointer">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{t(option.labelKey)}</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{t(option.descKey)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {formData.styleFeatures.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {formData.styleFeatures.map(featureId => {
                const feature = styleOptions.find(opt => opt.id === featureId);
                return feature ? (
                  <Badge key={featureId} variant="secondary" className="text-xs">
                    {t(feature.labelKey)}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-foreground">
              {t('annotation.quality')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.quality} onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t('annotation.quality.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">{t('quality.excellent')}</SelectItem>
                <SelectItem value="good">{t('quality.good')}</SelectItem>
                <SelectItem value="needs-work">{t('quality.needsWork')}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-foreground">{t('annotation.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t('annotation.notes.placeholder')}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          className="px-6"
        >
          <Save className="w-4 h-4 mr-2" />
          {t('annotation.save')}
        </Button>
      </div>
    </div>
  );
};

export default AnnotationForm;