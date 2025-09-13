import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, Lightbulb, BookOpen, Zap, Target, MessageCircle } from 'lucide-react';

interface BreakdownStep {
  step: number;
  explanation: string;
  linked_concept: string;
}

interface FeynmanMethod {
  core_concept: string;
  analogy: {
    domain: string;
    scenario: string;
    description: string;
  };
  breakdown: BreakdownStep[];
  summary: string;
}

interface AnnotationData {
  question: string;
  response: string;
  answer_final: string;
  feynman_method: FeynmanMethod;
  styleFeatures: string[];
  quality: string;
  notes: string;
  source?: string;
}

interface PreviewPanelProps {
  formData: AnnotationData;
}

const styleOptions = [
  { id: 'analogy', key: 'style.analogy', icon: Lightbulb },
  { id: 'simplify', key: 'style.simplify', icon: Target },
  { id: 'story', key: 'style.story', icon: BookOpen },
  { id: 'firstprinciples', key: 'style.firstprinciples', icon: Zap },
];

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ formData }) => {
  const { t } = useLanguage();

  // Generate dynamic Feynman-style narrative
  const generateFeynmanNarrative = () => {
    const { feynman_method } = formData;
    if (!feynman_method.core_concept) return '';

    let narrative = '';
    
    // Core concept introduction
    if (feynman_method.core_concept) {
      narrative += `Let's understand ${feynman_method.core_concept}. `;
    }

    // Analogy section
    if (feynman_method.analogy.scenario && feynman_method.analogy.description) {
      narrative += `Think of it like ${feynman_method.analogy.scenario}. ${feynman_method.analogy.description} `;
    }

    // Breakdown steps
    if (feynman_method.breakdown.length > 0) {
      narrative += "\n\nHere's how it works step by step:\n";
      feynman_method.breakdown.forEach((step, index) => {
        if (step.explanation) {
          narrative += `\n${index + 1}. ${step.explanation}`;
          if (step.linked_concept) {
            narrative += ` (This relates to: ${step.linked_concept})`;
          }
        }
      });
    }

    // Summary
    if (feynman_method.summary) {
      narrative += `\n\nIn summary: ${feynman_method.summary}`;
    }

    return narrative;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'needs-work': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const analyzeResponse = (text: string) => {
    return {
      wordCount: text.length,
      hasAnalogy: text.includes('就像') || text.includes('比如') || text.includes('类似'),
      hasExample: text.includes('例如') || text.includes('比方说'),
      isSimple: text.length > 0 && text.length < 500,
      complexity: text.length > 300 ? '复杂' : text.length > 150 ? '中等' : '简单'
    };
  };

  const analysis = analyzeResponse(formData.response);
  const narrative = generateFeynmanNarrative();

  return (
    <div className="space-y-4 h-full">
      <Card className="physics-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-feynman-text font-physics">
            <Eye className="w-5 h-5 text-feynman-blue" />
            <span>{t('preview.realTime')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Generated Feynman Narrative */}
          {narrative && (
            <div>
              <h4 className="text-sm font-semibold text-feynman-text mb-2">Generated Feynman Explanation</h4>
              <div className="p-4 bg-gradient-subtle rounded-lg border-l-4 border-primary">
                <p className="text-feynman-text leading-relaxed whitespace-pre-wrap text-sm">
                  {narrative}
                </p>
              </div>
            </div>
          )}

          {/* Question Preview */}
          {formData.question && (
            <div>
              <h4 className="text-sm font-semibold text-feynman-text mb-2">{t('manage.question')}</h4>
              <div className="p-3 bg-feynman-warm/10 rounded-lg">
                <p className="text-feynman-text font-mono">{formData.question}</p>
              </div>
            </div>
          )}

          {/* Final Answer Preview */}
          {formData.answer_final && (
            <div>
              <h4 className="text-sm font-semibold text-feynman-text mb-2">Final Answer</h4>
              <div className="p-4 bg-gradient-subtle rounded-lg">
                <p className="text-feynman-text leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {formData.answer_final}
                </p>
              </div>
            </div>
          )}

          {/* Knowledge Graph Concepts */}
          {formData.feynman_method.breakdown.some(step => step.linked_concept) && (
            <div>
              <h4 className="text-sm font-semibold text-feynman-text mb-2">Knowledge Graph Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {formData.feynman_method.breakdown
                  .filter(step => step.linked_concept)
                  .map((step, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {step.linked_concept}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Style Features Preview */}
          {formData.styleFeatures.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-feynman-text mb-2">{t('manage.stylePattern')}</h4>
              <div className="flex flex-wrap gap-2">
                {formData.styleFeatures.map(featureId => {
                  const feature = styleOptions.find(opt => opt.id === featureId);
                  const Icon = feature?.icon || MessageCircle;
                  return feature ? (
                    <Badge key={featureId} className="bg-feynman-blue/20 text-feynman-blue border-feynman-blue/30">
                      <Icon className="w-3 h-3 mr-1" />
                      {t(feature.key)}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Quality Preview */}
          {formData.quality && (
            <div>
              <h4 className="text-sm font-semibold text-feynman-text mb-2">{t('preview.quality')}</h4>
              <Badge className={getQualityColor(formData.quality)}>
                {t(`quality.${formData.quality}`)}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Card */}
      {formData.response && (
        <Card className="physics-card">
          <CardHeader>
            <CardTitle className="text-sm text-feynman-text font-physics">{t('preview.analysis')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-feynman-muted">{t('preview.wordCount')}</span>
              <span className="text-feynman-text font-mono">{analysis.wordCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-feynman-muted">{t('preview.complexity')}</span>
              <Badge variant="outline" className="text-xs">
                {t(`preview.complexity.${analysis.complexity}`)}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-feynman-muted">{t('preview.hasAnalogy')}</span>
                <div className={`w-2 h-2 rounded-full ${analysis.hasAnalogy ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-feynman-muted">{t('preview.hasExample')}</span>
                <div className={`w-2 h-2 rounded-full ${analysis.hasExample ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-feynman-muted">{t('preview.isSimple')}</span>
                <div className={`w-2 h-2 rounded-full ${analysis.isSimple ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Preview */}
      {formData.source && (
        <Card className="physics-card">
          <CardHeader>
            <CardTitle className="text-sm text-feynman-text font-physics">Source</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-feynman-muted whitespace-pre-wrap font-mono">
              {formData.source}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes Preview */}
      {formData.notes && (
        <Card className="physics-card">
          <CardHeader>
            <CardTitle className="text-sm text-feynman-text font-physics">{t('manage.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-feynman-muted whitespace-pre-wrap font-mono">
              {formData.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};