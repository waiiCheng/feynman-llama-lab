import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Play, Pause, Download, Upload, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

const FineTuningLayer = () => {
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  // Mock 训练数据
  const trainingStats = {
    totalSamples: 2847,
    trainingSamples: 2277,
    validationSamples: 570,
    epochs: 3,
    currentEpoch: 0,
    progress: 0
  };

  // Mock 模型性能
  const modelMetrics = [
    { name: '训练损失', value: 0.342, change: -0.023, trend: 'down' },
    { name: '验证损失', value: 0.398, change: -0.015, trend: 'down' },
    { name: 'BLEU 分数', value: 0.756, change: +0.034, trend: 'up' },
    { name: '费曼风格相似度', value: 0.823, change: +0.067, trend: 'up' }
  ];

  // Mock 费曼风格特征
  const feynmanFeatures = [
    { feature: '使用类比', weight: 0.85, examples: 147 },
    { feature: '简化复杂概念', weight: 0.92, examples: 234 },
    { feature: '讲故事', weight: 0.73, examples: 89 },
    { feature: '第一性原理', weight: 0.88, examples: 156 },
    { feature: '互动提问', weight: 0.79, examples: 112 }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : '↘';
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 概览 */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-feynman-text">基础模型层</h2>
        <p className="text-feynman-muted max-w-2xl mx-auto">
          微调 Mistral 模型，注入费曼式解释风格和价值观对齐
        </p>
      </div>

      {/* 训练控制面板 */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-feynman-blue" />
              <span>训练控制台</span>
            </CardTitle>
            <Badge variant={trainingStatus === 'running' ? 'default' : 'secondary'}>
              {trainingStatus === 'running' ? '训练中' : 
               trainingStatus === 'paused' ? '已暂停' : '空闲'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-feynman-blue">{trainingStats.totalSamples}</div>
              <div className="text-sm text-feynman-muted">总样本数</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-feynman-orange">{trainingStats.epochs}</div>
              <div className="text-sm text-feynman-muted">训练轮数</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-accent">{trainingStats.currentEpoch}</div>
              <div className="text-sm text-feynman-muted">当前轮次</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-feynman-blue">{trainingStats.progress}%</div>
              <div className="text-sm text-feynman-muted">完成度</div>
            </div>
          </div>

          <div className="space-y-4">
            <Progress value={trainingStats.progress} className="h-2" />
            
            <div className="flex space-x-3 justify-center">
              <Button 
                onClick={() => setTrainingStatus('running')}
                disabled={trainingStatus === 'running'}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                开始训练
              </Button>
              <Button 
                variant="outline"
                onClick={() => setTrainingStatus('paused')}
                disabled={trainingStatus !== 'running'}
              >
                <Pause className="w-4 h-4 mr-2" />
                暂停
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                配置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">性能指标</TabsTrigger>
          <TabsTrigger value="features">费曼特征</TabsTrigger>
          <TabsTrigger value="data">训练数据</TabsTrigger>
        </TabsList>

        {/* 性能指标 */}
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modelMetrics.map((metric) => (
              <Card key={metric.name} className="bg-gradient-card shadow-medium">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-feynman-text">
                      {metric.value}
                    </div>
                    <div className={`flex items-center text-sm ${getTrendColor(metric.trend)}`}>
                      <span>{getTrendIcon(metric.trend)}</span>
                      <span className="ml-1">
                        {metric.change > 0 ? '+' : ''}{metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-feynman-blue rounded-full" 
                      style={{ width: `${metric.value * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 费曼特征 */}
        <TabsContent value="features">
          <Card className="bg-gradient-card shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-feynman-orange" />
                <span>费曼风格特征权重</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feynmanFeatures.map((feature) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-feynman-text">{feature.feature}</span>
                      <div className="flex items-center space-x-4 text-sm text-feynman-muted">
                        <span>权重: {feature.weight}</span>
                        <Badge variant="outline">{feature.examples} 样本</Badge>
                      </div>
                    </div>
                    <Progress value={feature.weight * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 训练数据 */}
        <TabsContent value="data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle>数据集管理</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-feynman-text mb-2">feynman_dataset.jsonl</h4>
                  <div className="text-sm text-feynman-muted space-y-1">
                    <div>大小: 24.7 MB</div>
                    <div>样本: {trainingStats.totalSamples} 条</div>
                    <div>最后更新: 2024-01-20</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    上传数据集
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    导出格式
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle>数据预处理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">数据清洗</span>
                      <Badge variant="secondary">完成</Badge>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">格式转换</span>
                      <Badge variant="secondary">完成</Badge>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">训练验证分割</span>
                      <Badge variant="secondary">完成</Badge>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 模型部署 */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-feynman-blue" />
            <span>模型部署</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">本地部署</h4>
              <p className="text-sm text-feynman-muted mb-3">
                下载模型到本地运行
              </p>
              <Button variant="outline" size="sm">
                下载模型
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">API 部署</h4>
              <p className="text-sm text-feynman-muted mb-3">
                部署为 REST API 服务
              </p>
              <Button variant="outline" size="sm">
                创建 API
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">集成部署</h4>
              <p className="text-sm text-feynman-muted mb-3">
                与 RAG 和知识图谱集成
              </p>
              <Button variant="outline" size="sm">
                集成部署
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FineTuningLayer;