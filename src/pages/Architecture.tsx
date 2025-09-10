import ArchitectureOverview from '@/components/architecture/ArchitectureOverview';
import KnowledgeGraphLayer from '@/components/architecture/KnowledgeGraphLayer';
import RAGLayer from '@/components/architecture/RAGLayer';
import FineTuningLayer from '@/components/architecture/FineTuningLayer';
import LocalTrainingSetup from '@/components/architecture/LocalTrainingSetup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const Architecture = () => {
  const { t } = useLanguage();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <Tabs defaultValue="local-training" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="local-training">{t('arch.localTraining')}</TabsTrigger>
          <TabsTrigger value="overview">{t('arch.overview')}</TabsTrigger>
          <TabsTrigger value="knowledge-graph">{t('arch.knowledgeGraph')}</TabsTrigger>
          <TabsTrigger value="rag">{t('arch.rag')}</TabsTrigger>
          <TabsTrigger value="fine-tuning">{t('arch.fineTuning')}</TabsTrigger>
        </TabsList>

          <TabsContent value="local-training">
            <LocalTrainingSetup />
          </TabsContent>

          <TabsContent value="overview">
            <ArchitectureOverview />
          </TabsContent>

          <TabsContent value="knowledge-graph">
            <KnowledgeGraphLayer />
          </TabsContent>

          <TabsContent value="rag">
            <RAGLayer />
          </TabsContent>

          <TabsContent value="fine-tuning">
            <FineTuningLayer />
          </TabsContent>
        </Tabs>
    </main>
  );
};

export default Architecture;