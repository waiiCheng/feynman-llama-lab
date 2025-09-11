import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Database, Search, Cpu, ArrowDown, Network, Book, Zap, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface ArchitectureOverviewProps {
  onStartTraining?: () => void;
}

const ArchitectureOverview = ({ onStartTraining }: ArchitectureOverviewProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const handleStartTraining = () => {
    toast({
      title: t('action.trainingStarted'),
      description: t('action.trainingStartedDesc'),
    });
    onStartTraining?.();
  };
  
  const layers = [
    {
      id: 'ui',
      title: t('arch.ui.title'),
      description: t('arch.ui.desc'),
      icon: Brain,
      status: 'active',
      color: 'bg-feynman-blue',
      components: t('arch.ui.components') as string | string[]
    },
    {
      id: 'knowledge-graph',
      title: t('arch.kg.title'),
      description: t('arch.kg.desc'),
      icon: Network,
      status: 'planned',
      color: 'bg-feynman-orange',
      components: t('arch.kg.components') as string | string[]
    },
    {
      id: 'rag',
      title: t('arch.rag.title'),
      description: t('arch.rag.desc'),
      icon: Search,
      status: 'planned',
      color: 'bg-accent',
      components: t('arch.rag.components') as string | string[]
    },
    {
      id: 'fine-tuning',
      title: t('arch.model.title'),
      description: t('arch.model.desc'),
      icon: Cpu,
      status: 'ready',
      color: 'bg-secondary',
      components: t('arch.model.components') as string | string[]
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: t('arch.status.active'), variant: 'default' as const },
      ready: { label: t('arch.status.ready'), variant: 'secondary' as const },
      planned: { label: t('arch.status.planned'), variant: 'outline' as const }
    };
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 架构概览 */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-feynman-text">{t('arch.overview.title')}</h2>
        <p className="text-feynman-muted max-w-2xl mx-auto">
          {t('arch.overview.subtitle')}
        </p>
      </div>

      {/* 数据流展示 */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-feynman-orange" />
            <span>{t('arch.dataflow.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-feynman-warm/20 p-4 rounded-lg space-y-2 text-sm">
            <div className="font-medium text-feynman-text">{t('arch.dataflow.question')}</div>
            <div className="text-feynman-muted">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-feynman-orange rounded-full"></span>
                <span>{t('arch.dataflow.step1')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>{t('arch.dataflow.step2')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span>{t('arch.dataflow.step3')}</span>
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
                  {typeof layer.components === 'string' ? 
                    layer.components.split(', ').map((component, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-feynman-warm/10 rounded-lg">
                        <div className="w-2 h-2 bg-feynman-blue rounded-full"></div>
                        <span className="text-sm text-feynman-text">{component}</span>
                      </div>
                    )) : 
                    layer.components.map((component, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-feynman-warm/10 rounded-lg">
                        <div className="w-2 h-2 bg-feynman-blue rounded-full"></div>
                        <span className="text-sm text-feynman-text">{component}</span>
                      </div>
                    ))
                  }
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
            <span>{t('arch.roadmap.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <div className="font-medium text-green-800">{t('arch.phase1.title')}</div>
                <div className="text-sm text-green-600">{t('arch.phase1.desc')}</div>
              </div>
              <Badge variant="secondary">{t('arch.status.ready')}</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <div className="font-medium text-blue-800">{t('arch.phase2.title')}</div>
                <div className="text-sm text-blue-600">{t('arch.phase2.desc')}</div>
              </div>
              <Badge variant="outline">{t('arch.status.planned')}</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <div className="font-medium text-purple-800">{t('arch.phase3.title')}</div>
                <div className="text-sm text-purple-600">{t('arch.phase3.desc')}</div>
              </div>
              <Badge variant="outline">{t('arch.status.planned')}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 开始按钮 */}
      <div className="text-center">
        <Button 
          size="lg"
          className="bg-gradient-hero hover:opacity-90 text-white px-8 py-3"
          onClick={handleStartTraining}
        >
          <Download className="w-5 h-5 mr-2" />
          {t('arch.startTraining')}
        </Button>
        <p className="text-sm text-feynman-muted mt-2">
          {t('arch.localOnly')}
        </p>
      </div>
    </div>
  );
};

export default ArchitectureOverview;