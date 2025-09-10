import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Database, Search, Cpu, ArrowDown, Network, Book, Zap, Download } from 'lucide-react';

const ArchitectureOverview = () => {
  const layers = [
    {
      id: 'ui',
      title: '用户界面层 (Web)',
      description: '费曼标注界面、管理系统',
      icon: Brain,
      status: 'active',
      color: 'bg-feynman-blue',
      components: ['标注页面', '管理界面', '实时预览']
    },
    {
      id: 'knowledge-graph',
      title: '知识图谱层',
      description: '预处理的结构化知识',
      icon: Network,
      status: 'planned',
      color: 'bg-feynman-orange',
      components: ['费曼概念网络', '巴菲特投资原则树', '关系推理引擎']
    },
    {
      id: 'rag',
      title: 'RAG 检索层',
      description: '实时外挂资料检索',
      icon: Search,
      status: 'planned',
      color: 'bg-accent',
      components: ['向量数据库', '原始文本库', '相似度匹配']
    },
    {
      id: 'fine-tuning',
      title: '基础模型层',
      description: '微调后的 Mistral',
      icon: Cpu,
      status: 'ready',
      color: 'bg-secondary',
      components: ['费曼语感模型', '价值观对齐', '基础推理能力']
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: '已实现', variant: 'default' as const },
      ready: { label: '可开始', variant: 'secondary' as const },
      planned: { label: '计划中', variant: 'outline' as const }
    };
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 架构概览 */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-feynman-text">三层架构系统</h2>
        <p className="text-feynman-muted max-w-2xl mx-auto">
          结合微调、RAG 和知识图谱的费曼学习法 LLM 系统架构
        </p>
      </div>

      {/* 数据流展示 */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-feynman-orange" />
            <span>数据流示例</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-feynman-warm/20 p-4 rounded-lg space-y-2 text-sm">
            <div className="font-medium text-feynman-text">用户问："什么是复利？"</div>
            <div className="text-feynman-muted">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-feynman-orange rounded-full"></span>
                <span>1. 知识图谱找到：复利 → [指数增长, 时间价值, 巴菲特核心概念]</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>2. RAG 检索到：巴菲特1985年股东信第3段关于复利的解释...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span>3. 微调模型生成：用费曼的语气，结合图谱关系和原文，生成回答</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 架构层次图 */}
      <div className="space-y-4">
        {layers.map((layer, index) => (
          <div key={layer.id} className="relative">
            <Card className="shadow-medium bg-gradient-card hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${layer.color} flex items-center justify-center`}>
                      <layer.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-feynman-text">{layer.title}</CardTitle>
                      <p className="text-feynman-muted text-sm">{layer.description}</p>
                    </div>
                  </div>
                  <Badge {...getStatusBadge(layer.status)}>
                    {getStatusBadge(layer.status).label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {layer.components.map((component, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-feynman-warm/10 rounded-lg">
                      <div className="w-2 h-2 bg-feynman-blue rounded-full"></div>
                      <span className="text-sm text-feynman-text">{component}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* 连接线 */}
            {index < layers.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="w-6 h-6 text-feynman-muted" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 实现阶段 */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-feynman-blue" />
            <span>实施路线图</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <div className="font-medium text-green-800">第一阶段：微调训练</div>
                <div className="text-sm text-green-600">使用标注数据训练费曼风格模型</div>
              </div>
              <Badge variant="secondary">可开始</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <div className="font-medium text-blue-800">第二阶段：RAG 集成</div>
                <div className="text-sm text-blue-600">添加向量数据库和文档检索</div>
              </div>
              <Badge variant="outline">计划中</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <div className="font-medium text-purple-800">第三阶段：知识图谱</div>
                <div className="text-sm text-purple-600">构建概念关系网络和推理引擎</div>
              </div>
              <Badge variant="outline">计划中</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 开始按钮 */}
      <div className="text-center">
        <Button 
          size="lg"
          className="bg-gradient-hero hover:opacity-90 text-white px-8 py-3"
        >
          <Download className="w-5 h-5 mr-2" />
          开始本地训练
        </Button>
        <p className="text-sm text-feynman-muted mt-2">
          完全本地化，无需外部依赖
        </p>
      </div>
    </div>
  );
};

export default ArchitectureOverview;