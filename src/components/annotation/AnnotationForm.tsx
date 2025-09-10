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

interface AnnotationData {
  question: string;
  response: string;
  styleFeatures: string[];
  quality: string;
  notes: string;
}

const styleOptions = [
  { id: 'analogy', label: '使用类比', icon: Lightbulb, description: '用简单例子解释复杂概念' },
  { id: 'simplify', label: '简化复杂', icon: Target, description: '化繁为简的表达方式' },
  { id: 'story', label: '讲故事', icon: BookOpen, description: '用故事情节增强理解' },
  { id: 'firstprinciples', label: '第一性原理', icon: Zap, description: '从基本原理出发思考' },
];

const AnnotationForm = () => {
  const { toast } = useToast();
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
        title: "请填写必要字段",
        description: "问题和回答都是必填项",
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
      title: "标注已保存",
      description: "数据已成功保存到本地存储"
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question Input */}
      <Card className="physics-card quantum-hover particle-bg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-feynman-text font-physics">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero text-feynman-cool text-sm flex items-center justify-center font-bold animate-quantum-pulse">1</div>
            <span className="tracking-wide">用户问题</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="例如：什么是量子力学？"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className="text-lg bg-gradient-subtle border-feynman-blue/30 focus:border-feynman-blue focus:ring-feynman-blue/20"
          />
        </CardContent>
      </Card>

      {/* Feynman Response */}
      <Card className="physics-card quantum-hover particle-bg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-feynman-text font-physics">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero text-feynman-cool text-sm flex items-center justify-center font-bold animate-quantum-pulse">2</div>
            <span className="tracking-wide">费曼式回答</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="费曼会怎么解释这个问题？用简单、直观的方式..."
            value={formData.response}
            onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
            rows={8}
            className="text-base leading-relaxed bg-gradient-subtle border-feynman-blue/30 focus:border-feynman-blue focus:ring-feynman-blue/20"
          />
        </CardContent>
      </Card>

      {/* Style Features */}
      <Card className="physics-card quantum-hover particle-bg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-feynman-text font-physics">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero text-feynman-cool text-sm flex items-center justify-center font-bold animate-quantum-pulse">3</div>
            <span className="tracking-wide">思维模式标签</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.id} className="glow-border rounded-xl p-4 hover:bg-gradient-accent transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={formData.styleFeatures.includes(option.id)}
                      onCheckedChange={(checked) => handleStyleFeatureChange(option.id, checked as boolean)}
                      className="border-feynman-blue/50 data-[state=checked]:bg-feynman-blue"
                    />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="flex items-center space-x-3 cursor-pointer">
                        <Icon className="w-5 h-5 text-feynman-blue animate-quantum-pulse" />
                        <span className="font-medium text-feynman-text">{option.label}</span>
                      </Label>
                      <p className="text-sm text-feynman-muted mt-1 science-text">{option.description}</p>
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
                    {feature.label}
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
              <span className="tracking-wide">回答质量</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.quality} onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
              <SelectTrigger className="bg-gradient-subtle border-feynman-blue/30 focus:border-feynman-blue">
                <SelectValue placeholder="选择质量等级" />
              </SelectTrigger>
              <SelectContent className="bg-card border-feynman-blue/30">
                <SelectItem value="excellent" className="focus:bg-feynman-blue/20">优秀范例</SelectItem>
                <SelectItem value="good" className="focus:bg-feynman-blue/20">良好</SelectItem>
                <SelectItem value="needs-work" className="focus:bg-feynman-blue/20">需改进</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="physics-card quantum-hover">
          <CardHeader>
            <CardTitle className="text-feynman-text font-physics tracking-wide">备注</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="其他备注信息..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="bg-gradient-subtle border-feynman-blue/30 focus:border-feynman-blue focus:ring-feynman-blue/20"
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={handleSave}
          size="lg"
          className="glow-border bg-gradient-hero hover:shadow-glow text-feynman-cool px-10 py-4 rounded-xl font-physics text-lg tracking-wide transition-all duration-300 hover:scale-105"
        >
          <Save className="w-6 h-6 mr-3" />
          保存标注
        </Button>
      </div>
    </div>
  );
};

export default AnnotationForm;