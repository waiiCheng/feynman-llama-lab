export interface BreakdownStep {
  step: number;
  explanation: string;
  linked_concept: string;
}

export interface FeynmanMethod {
  core_concept: string;
  analogy: {
    domain: string;
    scenario: string;
    description: string;
  };
  breakdown: BreakdownStep[];
  summary: string;
}

export interface AnnotationData {
  question: string;
  response: string;
  answer_final: string;
  feynman_method: FeynmanMethod;
  styleFeatures: string[];
  quality: string;
  notes: string;
  source?: string;
}

export interface AutoSuggestion {
  id: string;
  confidence: number;
  template: Partial<FeynmanMethod>;
  description: string;
  matchedText: string;
}