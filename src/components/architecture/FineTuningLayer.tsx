import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Play, Pause, Download, Upload, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const FineTuningLayer = () => {
  const { t } = useLanguage();
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
    { name: t('finetune.trainLoss'), value: 0.342, change: -0.023, trend: 'down' },
    { name: t('finetune.valLoss'), value: 0.398, change: -0.015, trend: 'down' },
    { name: t('finetune.bleuScore'), value: 0.756, change: +0.034, trend: 'up' },
    { name: t('finetune.feynmanSimilarity'), value: 0.823, change: +0.067, trend: 'up' }
  ];

  // Mock 费曼风格特征
  const feynmanFeatures = [
    { feature: t('finetune.featureName.analogy'), weight: 0.85, examples: 147 },
    { feature: t('finetune.featureName.simplify'), weight: 0.92, examples: 234 },
    { feature: t('finetune.featureName.story'), weight: 0.73, examples: 89 },
    { feature: t('finetune.featureName.firstprinciples'), weight: 0.88, examples: 156 },
    { feature: t('finetune.featureName.interactive'), weight: 0.79, examples: 112 }
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
        <h2 className="text-3xl font-bold text-feynman-text">{t('finetune.title')}</h2>
        <p className="text-feynman-muted max-w-2xl mx-auto">
          {t('finetune.subtitle')}
        </p>
      </div>

      {/* 训练控制面板 */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-feynman-blue" />
              <span>{t('finetune.console')}</span>
            </CardTitle>
            <Badge variant={trainingStatus === 'running' ? 'default' : 'secondary'}>
              {trainingStatus === 'running' ? t('finetune.status.training') : 
               trainingStatus === 'paused' ? t('finetune.status.paused') : t('finetune.status.idle')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-feynman-blue">{trainingStats.totalSamples}</div>
              <div className="text-sm text-feynman-muted">{t('finetune.totalSamples')}</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-feynman-orange">{trainingStats.epochs}</div>
              <div className="text-sm text-feynman-muted">{t('finetune.epochs')}</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-accent">{trainingStats.currentEpoch}</div>
              <div className="text-sm text-feynman-muted">{t('finetune.currentEpoch')}</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-feynman-blue">{trainingStats.progress}%</div>
              <div className="text-sm text-feynman-muted">{t('finetune.progress')}</div>
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
                {t('finetune.start')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setTrainingStatus('paused')}
                disabled={trainingStatus !== 'running'}
              >
                <Pause className="w-4 h-4 mr-2" />
                {t('finetune.pause')}
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                {t('finetune.config')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">{t('finetune.metrics')}</TabsTrigger>
          <TabsTrigger value="features">{t('finetune.features')}</TabsTrigger>
          <TabsTrigger value="data">{t('finetune.data')}</TabsTrigger>
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
                <span>{t('finetune.features')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feynmanFeatures.map((feature) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-feynman-text">{feature.feature}</span>
                      <div className="flex items-center space-x-4 text-sm text-feynman-muted">
                        <span>{t('finetune.weight')}: {feature.weight}</span>
                        <Badge variant="outline">{feature.examples} {t('finetune.samples')}</Badge>
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
                <CardTitle>{t('finetune.dataManagement')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-feynman-text mb-2">feynman_dataset.jsonl</h4>
                  <div className="text-sm text-feynman-muted space-y-1">
                    <div>{t('finetune.fileSize')}: 24.7 MB</div>
                    <div>{t('finetune.samples')}: {trainingStats.totalSamples} 条</div>
                    <div>{t('finetune.lastUpdate')}: 2024-01-20</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    {t('finetune.uploadDataset')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    {t('finetune.exportFormat')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle>{t('finetune.preprocessing')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t('finetune.dataCleaning')}</span>
                      <Badge variant="secondary">{t('finetune.completed')}</Badge>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t('finetune.formatConversion')}</span>
                      <Badge variant="secondary">{t('finetune.completed')}</Badge>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t('finetune.trainValSplit')}</span>
                      <Badge variant="secondary">{t('finetune.completed')}</Badge>
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
            <span>{t('finetune.deployment')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">{t('finetune.localDeploy')}</h4>
              <p className="text-sm text-feynman-muted mb-3">
                {t('finetune.localDeployDesc')}
              </p>
              <Button variant="outline" size="sm">
                {t('finetune.downloadModel')}
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">{t('finetune.apiDeploy')}</h4>
              <p className="text-sm text-feynman-muted mb-3">
                {t('finetune.apiDeployDesc')}
              </p>
              <Button variant="outline" size="sm">
                {t('finetune.createApi')}
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">{t('finetune.integrationDeploy')}</h4>
              <p className="text-sm text-feynman-muted mb-3">
                {t('finetune.integrationDeployDesc')}
              </p>
              <Button variant="outline" size="sm">
                {t('finetune.integrateDeploy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FineTuningLayer;