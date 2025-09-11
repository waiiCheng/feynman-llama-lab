import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, FileText, Search, Upload, Zap, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const RAGLayer = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock vector database data
  const vectorCollections = [
    {
      id: 'feynman-lectures',
      name: t('rag.feynmanLectures'),
      documents: 1247,
      embeddings: 125600,
      status: 'active',
      lastUpdate: '2024-01-15'
    },
    {
      id: 'buffett-letters',
      name: t('rag.buffettLetters'),
      documents: 687,
      embeddings: 68700,
      status: 'active', 
      lastUpdate: '2024-01-10'
    },
    {
      id: 'scientific-papers',
      name: t('rag.scientificPapers'),
      documents: 2341,
      embeddings: 234100,
      status: 'indexing',
      lastUpdate: '2024-01-20'
    }
  ];

  // Mock 检索结果
  const retrievalResults = [
    {
      id: 1,
      source: '费曼物理学讲义 第2卷 第13章',
      content: '想象你推一个箱子。如果你推得很慢，箱子就慢慢移动；如果你推得快，箱子就快速移动。能量就像是你推箱子时所做的工作...',
      similarity: 0.92,
      tokens: 156
    },
    {
      id: 2, 
      source: '巴菲特1987年股东信',
      content: '复利是世界第八大奇迹。理解它的人，可以从中获益；不理解它的人，将会付出代价...',
      similarity: 0.87,
      tokens: 134
    },
    {
      id: 3,
      source: '费曼物理学讲义 第1卷 第4章', 
      content: '如果你不能用简单的语言解释某个概念，那说明你还没有真正理解它...',
      similarity: 0.83,
      tokens: 89
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: t('rag.active'), className: 'bg-green-100 text-green-800' },
      indexing: { label: t('rag.indexing'), className: 'bg-yellow-100 text-yellow-800' },
      error: { label: t('rag.error'), className: 'bg-red-100 text-red-800' }
    };
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-feynman-text">{t('rag.title')}</h2>
        <p className="text-feynman-muted max-w-2xl mx-auto">
          {t('rag.subtitle')}
        </p>
      </div>

      {/* Retrieval Test */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-feynman-blue" />
            <span>{t('rag.semanticRetrieval')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder={t('rag.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-feynman-blue hover:bg-feynman-blue/90">
              <Zap className="w-4 h-4 mr-2" />
              {t('rag.retrieve')}
            </Button>
          </div>

          {/* Retrieval Results */}
          {searchQuery && (
            <div className="space-y-3 mt-6">
              <h4 className="font-medium text-feynman-text">{t('rag.retrievalResults')}</h4>
              {retrievalResults.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg hover:bg-feynman-warm/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {result.source}
                    </Badge>
                    <div className="flex items-center space-x-4 text-xs text-feynman-muted">
                      <span>{t('rag.similarity')}: {(result.similarity * 100).toFixed(0)}%</span>
                      <span>{result.tokens} tokens</span>
                    </div>
                  </div>
                  <p className="text-sm text-feynman-text leading-relaxed">
                    {result.content}
                  </p>
                  <div className="mt-2">
                    <Progress value={result.similarity * 100} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 向量数据库管理 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-feynman-orange" />
              <span>{t('rag.vectorCollections')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vectorCollections.map((collection) => (
                <div key={collection.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-feynman-text">{collection.name}</h4>
                    <Badge className={getStatusBadge(collection.status).className}>
                      {getStatusBadge(collection.status).label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-feynman-muted">
                    <div>
                      <span className="font-medium">{collection.documents.toLocaleString()}</span> {t('rag.documents')}
                    </div>
                    <div>
                      <span className="font-medium">{collection.embeddings.toLocaleString()}</span> {t('rag.vectors')}
                    </div>
                  </div>
                  <div className="text-xs text-feynman-muted mt-2">
                    {t('rag.lastUpdate')}: {collection.lastUpdate}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Management */}
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-feynman-blue" />
              <span>{t('rag.documentManagement')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              {t('rag.uploadNewDocument')}
            </Button>
            
            <div className="space-y-2">
              <h4 className="font-medium text-feynman-text text-sm">{t('rag.supportedFormats')}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Badge variant="secondary">PDF</Badge>
                <Badge variant="secondary">TXT</Badge>
                <Badge variant="secondary">DOCX</Badge>
                <Badge variant="secondary">MD</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-feynman-text text-sm mb-2">{t('rag.processingWorkflow')}</h4>
              <div className="space-y-2 text-xs text-feynman-muted">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-feynman-blue rounded-full"></div>
                  <span>{t('rag.documentChunking')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-feynman-orange rounded-full"></div>
                  <span>{t('rag.vectorEncoding')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>{t('rag.indexBuilding')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retrieval Configuration */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-feynman-orange" />
            <span>{t('rag.retrievalConfig')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">{t('rag.topKRetrieval')}</h4>
              <p className="text-sm text-feynman-muted mb-3">
                {t('rag.topKDesc')}
              </p>
              <Input placeholder="K = 5" className="text-sm" />
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">{t('rag.similarityThreshold')}</h4>
              <p className="text-sm text-feynman-muted mb-3">
                {t('rag.similarityThresholdDesc')}
              </p>
              <Input placeholder="0.7" className="text-sm" />
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-feynman-text mb-2">{t('rag.maxTokens')}</h4>
              <p className="text-sm text-feynman-muted mb-3">
                {t('rag.maxTokensDesc')}
              </p>
              <Input placeholder="4096" className="text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Hint */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto" />
            <h3 className="font-medium text-green-800">{t('rag.localVectorDatabase')}</h3>
            <p className="text-sm text-green-600">
              {t('rag.vectorDatabaseDesc')}
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              {t('rag.downloadRAGScript')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RAGLayer;