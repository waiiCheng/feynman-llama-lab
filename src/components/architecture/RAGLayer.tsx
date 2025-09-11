import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Database, FileText, Search, Upload, Zap, BookOpen } from 'lucide-react';
import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const RAGLayer = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: string, content: string, similarity: number}>>([]);
  const [topK, setTopK] = useState([5]);
  const [similarityThreshold, setSimilarityThreshold] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([1000]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Mock search results
      const mockResults = [
        {
          id: '1',
          content: '费曼关于光的解释：光是由光子组成的，光子是能量包，当它们撞击电子时会发生散射...',
          similarity: 0.92
        },
        {
          id: '2', 
          content: '瑞利散射的机制：当光波长远大于粒子尺寸时，散射强度与波长的四次方成反比...',
          similarity: 0.85
        },
        {
          id: '3',
          content: '费曼在《物理学讲义》中提到：要理解天空为什么是蓝色，我们需要从光与原子的相互作用开始...',
          similarity: 0.78
        }
      ];
      setSearchResults(mockResults);
      toast({
        title: t('action.searchCompleted'),
        description: t('action.searchDesc', { count: mockResults.length }),
      });
    }
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      toast({
        title: '文档上传成功',
        description: `已上传 ${files.length} 个文档，正在处理中...`,
      });
    }
  };

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
      id: 'feynman-interviews',
      name: t('rag.feynmanInterviews'),
      documents: 423,
      embeddings: 42300,
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
      source: '费曼访谈录：量子电动力学',
      content: '光是一种奇怪的东西。它既不是波，也不是粒子，而是一种我们没有直接经验的东西。想象一下...',
      similarity: 0.89,
      tokens: 142
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button className="bg-feynman-blue hover:bg-feynman-blue/90" onClick={handleSearch}>
              <Zap className="w-4 h-4 mr-2" />
              {t('rag.retrieve')}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">{t('rag.results')}</h3>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <Card key={result.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{t('rag.similarity')}: {(result.similarity * 100).toFixed(1)}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('rag.topK')}: {topK[0]}</label>
              <p className="text-xs text-muted-foreground mb-2">{t('rag.topKDesc')}</p>
              <Slider 
                value={topK} 
                onValueChange={setTopK}
                max={20} 
                min={1} 
                step={1} 
                className="w-full" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">{t('rag.similarityThreshold')}: {similarityThreshold[0]}</label>
              <p className="text-xs text-muted-foreground mb-2">{t('rag.similarityThresholdDesc')}</p>
              <Slider 
                value={similarityThreshold} 
                onValueChange={setSimilarityThreshold}
                max={1} 
                min={0} 
                step={0.1} 
                className="w-full" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">{t('rag.maxTokens')}: {maxTokens[0]}</label>
              <p className="text-xs text-muted-foreground mb-2">{t('rag.maxTokensDesc')}</p>
              <Slider 
                value={maxTokens} 
                onValueChange={setMaxTokens}
                max={4000} 
                min={100} 
                step={100} 
                className="w-full" 
              />
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