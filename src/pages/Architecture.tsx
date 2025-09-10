import { useState } from 'react';
import Header from '@/components/layout/Header';
import ArchitectureOverview from '@/components/architecture/ArchitectureOverview';
import KnowledgeGraphLayer from '@/components/architecture/KnowledgeGraphLayer';
import RAGLayer from '@/components/architecture/RAGLayer';
import FineTuningLayer from '@/components/architecture/FineTuningLayer';
import LocalTrainingSetup from '@/components/architecture/LocalTrainingSetup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Architecture = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="local-training" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="local-training">本地训练</TabsTrigger>
            <TabsTrigger value="overview">架构概览</TabsTrigger>
            <TabsTrigger value="knowledge-graph">知识图谱</TabsTrigger>
            <TabsTrigger value="rag">RAG 检索</TabsTrigger>
            <TabsTrigger value="fine-tuning">模型微调</TabsTrigger>
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
    </div>
  );
};

export default Architecture;