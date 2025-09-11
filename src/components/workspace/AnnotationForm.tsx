import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { Save, Lightbulb, BookOpen, Zap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnnotationData {
  question: string;
  response: string;
  styleFeatures: string[];
  quality: string;
  notes: string;
}

interface AnnotationFormProps {
  formData: AnnotationData;
  setFormData: React.Dispatch<React.SetStateAction<AnnotationData>>;
  onSave: () => void;
  onInsertTemplate: (template: string) => void;
  responseRef: React.RefObject<HTMLTextAreaElement>;
}

const styleOptions = [
  { id: 'analogy', key: 'style.analogy', labelKey: 'style.analogy', icon: Lightbulb, descKey: 'style.analogy.desc' },
  { id: 'simplify', key: 'style.simplify', labelKey: 'style.simplify', icon: Target, descKey: 'style.simplify.desc' },
  { id: 'story', key: 'style.story', labelKey: 'style.story', icon: BookOpen, descKey: 'style.story.desc' },
  { id: 'firstprinciples', key: 'style.firstprinciples', labelKey: 'style.firstprinciples', icon: Zap, descKey: 'style.firstprinciples.desc' },
];

export const AnnotationForm: React.FC<AnnotationFormProps> = ({
  formData,
  setFormData,
  onSave,
  onInsertTemplate,
  responseRef
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleStyleFeatureChange = (featureId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      styleFeatures: checked 
        ? [...prev.styleFeatures, featureId]
        : prev.styleFeatures.filter(id => id !== featureId)
    }));
  };

  const handleSave = () => {
    if (!formData.question.trim() || !formData.response.trim()) {
      toast({
        title: t('annotation.validation.title'),
        description: t('annotation.validation.desc'),
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const timestamp = new Date().toISOString();
    const annotation = {
      id: Date.now().toString(),
      ...formData,
      timestamp,
      annotator: 'user'
    };

    const existingData = JSON.parse(localStorage.getItem('feynman-annotations') || '[]');
    existingData.push(annotation);
    localStorage.setItem('feynman-annotations', JSON.stringify(existingData));

    toast({
      title: t('annotation.saved.title'),
      description: t('annotation.saved.desc2')
    });

    onSave();
  };

  return (
    <div className="space-y-10">
      {/* Question Input */}
      <div className="feynman-card spacing-lg">
        <div className="mb-6">
          <h2 className="text-heading text-foreground mb-2">
            {t('annotation.question')}
          </h2>
        </div>
        <Input
          placeholder={t('annotation.question.placeholder')}
          value={formData.question}
          onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
          className="feynman-input text-body"
        />
      </div>

      {/* Feynman Response */}
      <div className="feynman-card spacing-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading text-foreground">
            {t('annotation.response')}
          </h2>
          <TemplateSelector onSelectTemplate={onInsertTemplate} />
        </div>
        <div className="space-y-4">
          <Textarea
            ref={responseRef}
            placeholder={t('annotation.response.placeholder')}
            value={formData.response}
            onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
            rows={8}
            className="feynman-input text-body leading-relaxed resize-none"
          />
          <div className="flex justify-between items-center text-caption">
            <span>
              {t('preview.wordCount')}: <span className="text-foreground font-medium">{formData.response.length}</span>
            </span>
            <span className="text-muted-foreground">
              {t('annotation.templateHint')}
            </span>
          </div>
        </div>
      </div>

      {/* Style Features */}
      <div className="feynman-card spacing-lg">
        <div className="mb-6">
          <h2 className="text-heading text-foreground">
            {t('annotation.styleFeatures')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {styleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="feynman-card spacing-md hover:bg-secondary/30 transition-all duration-200 cursor-pointer">
                <div className="flex items-start gap-4">
                  <Checkbox
                    id={option.id}
                    checked={formData.styleFeatures.includes(option.id)}
                    onCheckedChange={(checked) => handleStyleFeatureChange(option.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="flex items-center gap-3 cursor-pointer">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-label text-foreground">{t(option.labelKey)}</span>
                    </Label>
                    <p className="text-caption mt-2">{t(option.descKey)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {formData.styleFeatures.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {formData.styleFeatures.map(featureId => {
              const feature = styleOptions.find(opt => opt.id === featureId);
              return feature ? (
                <Badge key={featureId} variant="secondary" className="text-caption px-3 py-1.5 rounded-lg">
                  {t(feature.labelKey)}
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Quality & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="feynman-card spacing-lg">
          <div className="mb-6">
            <h2 className="text-heading text-foreground">
              {t('annotation.quality')}
            </h2>
          </div>
          <Select value={formData.quality} onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
            <SelectTrigger className="feynman-input">
              <SelectValue placeholder={t('annotation.quality.placeholder')} />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-border">
              <SelectItem value="excellent">{t('quality.excellent')}</SelectItem>
              <SelectItem value="good">{t('quality.good')}</SelectItem>
              <SelectItem value="needs-work">{t('quality.needsWork')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="feynman-card spacing-lg">
          <div className="mb-6">
            <h2 className="text-heading text-foreground">{t('annotation.notes')}</h2>
          </div>
          <Textarea
            placeholder={t('annotation.notes.placeholder')}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="feynman-input resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={handleSave}
          className="feynman-button px-8 py-4"
        >
          <Save className="w-5 h-5 mr-3" />
          {t('annotation.save')}
        </Button>
      </div>
    </div>
  );
};