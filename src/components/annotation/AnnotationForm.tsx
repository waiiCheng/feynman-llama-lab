import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Lightbulb, BookOpen, Zap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnnotationData {
  question: string;
  response: string;
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

  const handleSave = () => {
    if (!formData.question.trim() || !formData.response.trim()) {
      toast({
        title: t('annotation.validation.title'),
        description: t('annotation.validation.desc'),
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage for now (later connect to backend)
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
      description: t('annotation.saved.desc')
    });

    // Reset form
    setFormData({
      question: '',
      response: '',
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

      {/* Feynman Response */}
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