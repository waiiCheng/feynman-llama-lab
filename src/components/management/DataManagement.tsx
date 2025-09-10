import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Download, Search, Eye, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Annotation {
  id: string;
  question: string;
  response: string;
  styleFeatures: string[];
  quality: string;
  notes: string;
  timestamp: string;
  annotator: string;
}

const DataManagement = () => {
  const { toast } = useToast();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  useEffect(() => {
    loadAnnotations();
  }, []);

  const loadAnnotations = () => {
    const data = JSON.parse(localStorage.getItem('feynman-annotations') || '[]');
    setAnnotations(data.reverse()); // Show newest first
  };

  const filteredAnnotations = annotations.filter(annotation => {
    const matchesSearch = !searchQuery || 
      annotation.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      annotation.response.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesQuality = qualityFilter === 'all' || annotation.quality === qualityFilter;
    
    return matchesSearch && matchesQuality;
  });

  const deleteAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(ann => ann.id !== id);
    setAnnotations(updatedAnnotations);
    localStorage.setItem('feynman-annotations', JSON.stringify(updatedAnnotations.reverse()));
    toast({
      title: "已删除",
      description: "标注数据已成功删除"
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(annotations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feynman-annotations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "导出完成",
      description: "标注数据已导出为JSON文件"
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-work': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return '优秀范例';
      case 'good': return '良好';
      case 'needs-work': return '需改进';
      default: return quality;
    }
  };

  const getStyleFeatureText = (feature: string) => {
    const map = {
      'analogy': '使用类比',
      'simplify': '简化复杂',
      'story': '讲故事',
      'firstprinciples': '第一性原理'
    };
    return map[feature as keyof typeof map] || feature;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Stats and Controls */}
      <Card className="shadow-medium bg-gradient-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-feynman-text">数据管理</CardTitle>
              <p className="text-feynman-muted mt-1">
                共 {annotations.length} 条标注数据，已筛选 {filteredAnnotations.length} 条
              </p>
            </div>
            <Button onClick={exportData} className="bg-feynman-blue hover:bg-feynman-blue/90">
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-feynman-muted" />
                <Input
                  placeholder="搜索问题或回答内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="筛选质量等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部质量</SelectItem>
                <SelectItem value="excellent">优秀范例</SelectItem>
                <SelectItem value="good">良好</SelectItem>
                <SelectItem value="needs-work">需改进</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Annotations List */}
      <div className="space-y-4">
        {filteredAnnotations.length === 0 ? (
          <Card className="shadow-medium bg-gradient-card">
            <CardContent className="py-12 text-center">
              <p className="text-feynman-muted text-lg">暂无标注数据</p>
              <p className="text-feynman-muted/70 mt-2">开始创建第一个标注吧！</p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnotations.map((annotation) => (
            <Card key={annotation.id} className="shadow-medium bg-gradient-card hover:shadow-strong transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-feynman-text mb-2 line-clamp-2">
                      {annotation.question}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-feynman-muted">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(annotation.timestamp).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <Badge className={getQualityColor(annotation.quality)}>
                        {getQualityText(annotation.quality)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAnnotation(annotation)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-feynman-text">查看标注详情</DialogTitle>
                        </DialogHeader>
                        {selectedAnnotation && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-feynman-text mb-2">问题</h4>
                              <p className="text-feynman-text bg-feynman-warm/20 p-4 rounded-lg">
                                {selectedAnnotation.question}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-feynman-text mb-2">费曼式回答</h4>
                              <p className="text-feynman-text bg-card p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                                {selectedAnnotation.response}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-feynman-text mb-2">思维模式</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedAnnotation.styleFeatures.map(feature => (
                                  <Badge key={feature} variant="secondary" className="bg-feynman-blue text-white">
                                    {getStyleFeatureText(feature)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {selectedAnnotation.notes && (
                              <div>
                                <h4 className="font-semibold text-feynman-text mb-2">备注</h4>
                                <p className="text-feynman-muted">{selectedAnnotation.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteAnnotation(annotation.id)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-feynman-text/80 mb-4 line-clamp-3">
                  {annotation.response}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {annotation.styleFeatures.map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {getStyleFeatureText(feature)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DataManagement;