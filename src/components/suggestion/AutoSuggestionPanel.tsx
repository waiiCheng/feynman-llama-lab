import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';
import { AutoAnnotator, PatternMatch } from '@/lib/autoAnnotator';
import { FeynmanMethod } from '@/types/annotation';
import patternsData from '@/data/patterns.json';

interface AutoSuggestionPanelProps {
  text: string;
  onApplySuggestion: (template: Partial<FeynmanMethod>) => void;
  className?: string;
}

export const AutoSuggestionPanel: React.FC<AutoSuggestionPanelProps> = ({
  text,
  onApplySuggestion,
  className = ''
}) => {
  const [matches, setMatches] = useState<PatternMatch[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnnotator] = useState(() => new AutoAnnotator(patternsData.patterns));

  useEffect(() => {
    if (!text.trim() || text.length < 20) {
      setMatches([]);
      return;
    }

    setIsAnalyzing(true);
    
    // 500ms 防抖
    const timer = setTimeout(() => {
      try {
        const detectedMatches = autoAnnotator.detectPatterns(text);
        setMatches(detectedMatches.slice(0, 3)); // 只显示前3个最佳匹配
      } catch (error) {
        console.error('Pattern detection error:', error);
        setMatches([]);
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [text, autoAnnotator]);

  if (!text.trim() || text.length < 20) {
    return (
      <Card className={`feynman-card ${className}`}>
        <CardContent className="spacing-md text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-caption">
            <Lightbulb className="w-4 h-4" />
            输入更多内容以获得智能建议...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className={`feynman-card ${className}`}>
        <CardContent className="spacing-md text-center">
          <div className="flex items-center justify-center gap-2 text-primary text-caption">
            <Sparkles className="w-4 h-4 animate-pulse" />
            正在分析您的输入...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className={`feynman-card ${className}`}>
        <CardContent className="spacing-md text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-caption">
            <AlertCircle className="w-4 h-4" />
            未检测到费曼方法模式
          </div>
        </CardContent>
      </Card>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return CheckCircle;
    if (confidence >= 60) return Lightbulb;
    return AlertCircle;
  };

  return (
    <Card className={`feynman-card ${className}`}>
      <CardHeader className="spacing-md">
        <CardTitle className="text-heading flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          智能建议
        </CardTitle>
      </CardHeader>
      <CardContent className="spacing-md space-y-4">
        {matches.map((match, index) => {
          const ConfidenceIcon = getConfidenceIcon(match.confidence);
          
          return (
            <div key={index} className="feynman-card spacing-sm bg-secondary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ConfidenceIcon className={`w-4 h-4 ${getConfidenceColor(match.confidence)}`} />
                  <span className="text-label text-foreground">{match.rule}</span>
                </div>
                <Badge variant="outline" className={`text-xs ${getConfidenceColor(match.confidence)}`}>
                  {match.confidence}% 匹配
                </Badge>
              </div>
              
              <div className="text-caption text-muted-foreground mb-3">
                检测到: &quot;{match.matched_text.substring(0, 50)}...&quot;
              </div>
              
              <div className="space-y-2">
                {match.template.core_concept && (
                  <div className="text-caption">
                    <span className="text-primary font-medium">核心概念:</span> {match.template.core_concept}
                  </div>
                )}
                
                {match.template.analogy?.scenario && (
                  <div className="text-caption">
                    <span className="text-primary font-medium">类比场景:</span> {match.template.analogy.scenario}
                  </div>
                )}
                
                {match.template.breakdown && match.template.breakdown.length > 0 && (
                  <div className="text-caption">
                    <span className="text-primary font-medium">建议步骤:</span> {match.template.breakdown.length}个分解步骤
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApplySuggestion(match.template)}
                className="w-full mt-3 text-caption"
              >
                应用此建议
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};