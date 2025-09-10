import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { Save, Lightbulb, BookOpen, Zap, Target, MessageCircle } from 'lucide-react';
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
  { id: 'analogy', key: 'style.analogy', icon: Lightbulb, description: '用简单例子解释复杂概念' },
  { id: 'simplify', key: 'style.simplify', icon: Target, description: '化繁为简的表达方式' },
  { id: 'story', key: 'style.story', icon: BookOpen, description: '用故事情节增强理解' },
  { id: 'firstprinciples', key: 'style.firstprinciples', icon: Zap, description: '从基本原理出发思考' },
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
        title: "请填写必要字段",
        description: "问题和回答都是必填项",
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
      title: "标注已保存",
      description: "数据已成功保存，可继续下一条标注"
    });

    onSave();
  };

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <Card className="physics-card quantum-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-feynman-text font-physics">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero text-feynman-cool text-sm flex items-center justify-center font-bold animate-quantum-pulse">1</div>
            <span className="tracking-wide">{t('annotation.question')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="例如：什么是量子力学？"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className="text-lg bg-gradient-subtle border-classical-gold/30 focus:border-classical-gold focus:ring-classical-gold/20 font-mono shadow-soft hover:shadow-classical transition-all duration-300"
          />
        </CardContent>
      </Card>

      {/* Feynman Response */}
      <Card className="physics-card quantum-hover">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-feynman-text font-physics">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero text-feynman-cool text-sm flex items-center justify-center font-bold animate-quantum-pulse">2</div>
              <span className="tracking-wide">{t('annotation.response')}</span>
            </div>
            <TemplateSelector onSelectTemplate={onInsertTemplate} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            ref={responseRef}
            placeholder="费曼会怎么解释这个问题？用简单、直观的方式... (按 / 插入模板)"
            value={formData.response}
            onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
            rows={8}
            className="text-base leading-relaxed bg-gradient-subtle border-classical-gold/30 focus:border-classical-gold focus:ring-classical-gold/20 font-mono resize-none shadow-soft hover:shadow-royal transition-all duration-300"
          />
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-feynman-muted science-text">
              字数: <span className="text-classical-gold font-bold">{formData.response.length}</span>
            </span>
            <span className="text-classical-gold/70 bg-classical-gold/10 px-2 py-1 rounded border border-classical-gold/20 animate-energy-wave">
              按 / 快速插入模板
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Style Features */}
      <Card className="physics-card quantum-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-feynman-text font-physics">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero text-feynman-cool text-sm flex items-center justify-center font-bold animate-quantum-pulse">3</div>
            <span className="tracking-wide">{t('annotation.styleFeatures')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.id} className="glow-border rounded-xl p-4 hover:bg-gradient-royal transition-all duration-500 hover:scale-[1.02] hover:shadow-glow group">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id={option.id}
                      checked={formData.styleFeatures.includes(option.id)}
                      onCheckedChange={(checked) => handleStyleFeatureChange(option.id, checked as boolean)}
                      className="border-classical-gold/50 data-[state=checked]:bg-classical-gold data-[state=checked]:border-classical-gold shadow-classical"
                    />
                    <div className="flex-1">
                      <label htmlFor={option.id} className="flex items-center space-x-3 cursor-pointer group-hover:text-marble-white transition-colors">
                        <Icon className="w-5 h-5 text-classical-gold animate-quantum-pulse group-hover:text-feynman-terminal transition-colors" />
                        <span className="font-medium text-feynman-text font-physics">{t(option.key)}</span>
                      </label>
                      <p className="text-sm text-feynman-muted mt-2 science-text leading-relaxed group-hover:text-classical-gold/80 transition-colors">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {formData.styleFeatures.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {formData.styleFeatures.map(featureId => {
                const feature = styleOptions.find(opt => opt.id === featureId);
                return feature ? (
                  <Badge key={featureId} className="bg-gradient-hero text-feynman-cool px-3 py-1 animate-energy-wave">
                    {t(feature.key)}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="physics-card quantum-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-feynman-text font-physics">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero text-feynman-cool text-sm flex items-center justify-center font-bold animate-quantum-pulse">4</div>
              <span className="tracking-wide">{t('annotation.quality')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.quality} onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
              <SelectTrigger className="bg-gradient-subtle border-feynman-blue/30 focus:border-feynman-blue">
                <SelectValue placeholder="选择质量等级" />
              </SelectTrigger>
              <SelectContent className="bg-card border-feynman-blue/30">
                <SelectItem value="excellent" className="focus:bg-feynman-blue/20">{t('quality.excellent')}</SelectItem>
                <SelectItem value="good" className="focus:bg-feynman-blue/20">{t('quality.good')}</SelectItem>
                <SelectItem value="needs-work" className="focus:bg-feynman-blue/20">{t('quality.needsWork')}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="physics-card quantum-hover">
          <CardHeader>
            <CardTitle className="text-feynman-text font-physics tracking-wide">{t('annotation.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="其他备注信息..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="bg-gradient-subtle border-feynman-blue/30 focus:border-feynman-blue focus:ring-feynman-blue/20 font-mono resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={handleSave}
          size="lg"
          className="glow-border bg-gradient-hero hover:shadow-glow text-marble-white px-12 py-5 rounded-2xl font-physics text-lg tracking-wide transition-all duration-500 hover:scale-110 hover:rotate-1 shadow-royal animate-energy-wave relative group overflow-hidden"
        >
          <div className="flex items-center relative z-10">
            <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            <span className="group-hover:tracking-wider transition-all duration-300">{t('annotation.saveAndNext')}</span>
            <span className="ml-3 text-sm opacity-80 bg-marble-white/10 px-2 py-1 rounded border border-marble-white/20">Ctrl+Enter</span>
          </div>
          <div className="absolute inset-0 bg-gradient-marble opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </Button>
      </div>
    </div>
  );
};