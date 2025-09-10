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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Question Input */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            用户问题
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="例如：什么是量子力学？"
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
            费曼式回答
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="费曼会怎么解释这个问题？用简单、直观的方式..."
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
            思维模式标签
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
                        <span className="font-medium text-foreground">{option.label}</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
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
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-foreground">
              回答质量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.quality} onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="选择质量等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">优秀范例</SelectItem>
                <SelectItem value="good">良好</SelectItem>
                <SelectItem value="needs-work">需改进</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-foreground">备注</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="其他备注信息..."
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
          保存标注
        </Button>
      </div>
    </div>
  );
};

export default AnnotationForm;