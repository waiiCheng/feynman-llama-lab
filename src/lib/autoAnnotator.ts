import { FeynmanMethod } from '@/types/annotation';

export interface PatternMatch {
  rule: string;
  confidence: number;
  template: Partial<FeynmanMethod>;
  matched_text: string;
}

export interface AnnotationPattern {
  id: string;
  name: string;
  rule: string;
  template: Partial<FeynmanMethod>;
  priority: number;
}

// 简化的JavaScript规则匹配引擎
export class AutoAnnotator {
  private patterns: AnnotationPattern[];

  constructor(patterns: AnnotationPattern[]) {
    this.patterns = patterns.sort((a, b) => b.priority - a.priority);
  }

  // 检测用户输入，返回匹配的模式
  detectPatterns(text: string): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    for (const pattern of this.patterns) {
      try {
        const regex = new RegExp(pattern.rule, 'gi');
        const match = text.match(regex);
        
        if (match) {
          const confidence = this.calculateConfidence(text, pattern);
          matches.push({
            rule: pattern.name,
            confidence,
            template: pattern.template,
            matched_text: match[0]
          });
        }
      } catch (error) {
        console.warn(`Pattern matching error for ${pattern.id}:`, error);
      }
    }
    
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  // 计算匹配置信度
  private calculateConfidence(text: string, pattern: AnnotationPattern): number {
    const words = text.split(/\s+/).length;
    const minWords = 10;
    const maxWords = 100;
    
    // 基础分数：60-90%
    let baseScore = 60 + Math.random() * 30;
    
    // 文本长度调整
    if (words >= minWords && words <= maxWords) {
      baseScore += 10;
    }
    
    // 特定关键词加成
    const keywordBonus = this.getKeywordBonus(text, pattern);
    
    return Math.min(95, Math.round(baseScore + keywordBonus));
  }

  private getKeywordBonus(text: string, pattern: AnnotationPattern): number {
    let bonus = 0;
    const lowerText = text.toLowerCase();
    
    // 费曼方法指示词
    const feynmanKeywords = ['简单', '解释', '类比', '步骤', '总结', '想象', '比如'];
    const analogyKeywords = ['就像', '类似于', '比如说', '想象一下', '如同'];
    const structureKeywords = ['首先', '然后', '最后', '接下来', '因此'];
    
    feynmanKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) bonus += 3;
    });
    
    analogyKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) bonus += 5;
    });
    
    structureKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) bonus += 2;
    });
    
    return bonus;
  }

  // 应用模式到表单数据
  applyTemplate(template: Partial<FeynmanMethod>, currentData: FeynmanMethod): FeynmanMethod {
    return {
      core_concept: template.core_concept || currentData.core_concept,
      analogy: {
        domain: template.analogy?.domain || currentData.analogy.domain,
        scenario: template.analogy?.scenario || currentData.analogy.scenario,
        description: template.analogy?.description || currentData.analogy.description,
      },
      breakdown: template.breakdown || currentData.breakdown,
      summary: template.summary || currentData.summary,
    };
  }
}

// 防抖函数，避免过度计算
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}