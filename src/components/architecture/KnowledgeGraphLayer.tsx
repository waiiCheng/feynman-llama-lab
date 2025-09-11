import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Network, Plus, Search, Link, Brain, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const KnowledgeGraphLayer = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock knowledge graph data
  const conceptNodes = [
    {
      id: 'quantum',
      name: t('kg.quantumMechanics'),
      type: 'physics',
      connections: 5,
      feynmanExplanations: 3
    },
    {
      id: 'compound-interest',
      name: t('kg.compoundInterest'),
      type: 'finance', 
      connections: 8,
      feynmanExplanations: 5
    },
    {
      id: 'energy',
      name: t('kg.energy'),
      type: 'physics',
      connections: 12,
      feynmanExplanations: 7
    },
    {
      id: 'probability',
      name: t('kg.probability'),
      type: 'math',
      connections: 6,
      feynmanExplanations: 4
    }
  ];

  const relationships = [
    {
      from: t('kg.quantumMechanics'),
      to: t('kg.probability'),
      type: 'depends_on',
      strength: 0.9
    },
    {
      from: t('kg.compoundInterest'),
      to: t('kg.exponentialGrowth'), 
      type: 'is_type_of',
      strength: 0.95
    },
    {
      from: t('kg.energy'),
      to: t('kg.conservationLaw'),
      type: 'follows',
      strength: 0.85
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      physics: 'bg-blue-100 text-blue-800 border-blue-200',
      finance: 'bg-green-100 text-green-800 border-green-200',
      math: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-feynman-text">{t('kg.title')}</h2>
        <p className="text-feynman-muted max-w-2xl mx-auto">
          {t('kg.subtitle')}
        </p>
      </div>

      {/* Search and Control */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-feynman-terminal" />
            <span>{t('kg.search')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder={t('kg.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              {t('kg.addConcept')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 概念节点管理 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-feynman-classical" />
              <span>{t('kg.conceptNodes')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conceptNodes.map((node) => (
                <div key={node.id} className="p-3 border rounded-lg hover:bg-feynman-warm/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-feynman-text">{node.name}</h4>
                    <Badge className={getTypeColor(node.type)}>
                      {node.type}
                    </Badge>
                  </div>
                  <div className="flex space-x-4 text-sm text-feynman-muted">
                    <div className="flex items-center space-x-1">
                      <Link className="w-3 h-3" />
                      <span>{node.connections} {t('kg.connections')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>{node.feynmanExplanations} {t('kg.feynmanExplanations')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relationship Network */}
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-feynman-quantum" />
              <span>{t('kg.relationshipNetwork')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relationships.map((rel, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-feynman-text">{rel.from}</span>
                    <Badge variant="outline" className="text-xs">
                      {rel.type}
                    </Badge>
                    <span className="font-medium text-feynman-text">{rel.to}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-feynman-terminal h-2 rounded-full" 
                        style={{ width: `${rel.strength * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-feynman-muted">
                      {t('kg.strength')}: {(rel.strength * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 推理引擎 */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-feynman-classical" />
            <span>推理引擎</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">路径查找</h4>
              <p className="text-sm text-feynman-muted mb-3">
                发现概念���的隐藏联系
              </p>
              <Button variant="outline" size="sm">
                运行路径分析
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">相似性计算</h4>
              <p className="text-sm text-feynman-muted mb-3">
                基于图结构的概念相似度
              </p>
              <Button variant="outline" size="sm">
                计算相似性
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 构建提示 */}
      <Card className="bg-gradient-terminal border border-feynman-terminal/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium text-feynman-text">本地图数据库</h3>
            <p className="text-sm text-feynman-muted">
              知识图谱可以使用 NetworkX (Python) 或 Neo4j 在本地构建
            </p>
            <Button className="bg-feynman-terminal hover:bg-feynman-terminal/90 text-feynman-cool">
              下载图谱构建脚本
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeGraphLayer;