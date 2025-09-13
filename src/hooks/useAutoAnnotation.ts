import { useState, useCallback } from 'react';
import { AutoAnnotator } from '@/lib/autoAnnotator';
import { FeynmanMethod } from '@/types/annotation';
import patternsData from '@/data/patterns.json';

export const useAutoAnnotation = () => {
  const [autoAnnotator] = useState(() => new AutoAnnotator(patternsData.patterns));

  const applyTemplate = useCallback((
    template: Partial<FeynmanMethod>,
    currentData: FeynmanMethod,
    setFormData: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const newFeynmanMethod = autoAnnotator.applyTemplate(template, currentData);
    
    setFormData((prev: any) => ({
      ...prev,
      feynman_method: newFeynmanMethod
    }));
  }, [autoAnnotator]);

  return {
    autoAnnotator,
    applyTemplate
  };
};