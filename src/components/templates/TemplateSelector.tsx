import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lightbulb, Target, BookOpen, Zap, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';

interface Template {
  id: string;
  key: string;
  icon: React.ComponentType<any>;
  category: 'explanation' | 'reasoning' | 'storytelling';
}

const templates: Template[] = [
  { id: 'analogy', key: 'template.analogy', icon: Lightbulb, category: 'explanation' },
  { id: 'simplify', key: 'template.simplify', icon: Target, category: 'explanation' },
  { id: 'story', key: 'template.story', icon: BookOpen, category: 'storytelling' },
  { id: 'firstPrinciple', key: 'template.firstPrinciple', icon: Zap, category: 'reasoning' },
  { id: 'example', key: 'template.example', icon: MessageCircle, category: 'explanation' },
  { id: 'why', key: 'template.why', icon: HelpCircle, category: 'reasoning' },
  { id: 'conclusion', key: 'template.conclusion', icon: CheckCircle, category: 'storytelling' },
];

interface TemplateSelectorProps {
  onSelectTemplate: (template: string) => void;
  trigger?: React.ReactNode;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate, 
  trigger 
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleSelect = (template: Template) => {
    onSelectTemplate(t(template.key));
    setOpen(false);
  };

  const categories = {
    explanation: templates.filter(t => t.category === 'explanation'),
    reasoning: templates.filter(t => t.category === 'reasoning'),
    storytelling: templates.filter(t => t.category === 'storytelling'),
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="font-mono">
            /
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium text-feynman-text">{t('template.title')}</div>
          
          {Object.entries(categories).map(([category, categoryTemplates]) => (
            <div key={category} className="space-y-2">
              <div className="text-xs text-feynman-muted uppercase tracking-wide">
                {t(`template.category.${category}`)}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {categoryTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Button
                      key={template.id}
                      variant="ghost"
                      size="sm"
                      className="justify-start h-auto p-2 hover:bg-feynman-blue/10"
                      onClick={() => handleSelect(template)}
                    >
                      <Icon className="w-4 h-4 mr-2 text-feynman-blue" />
                      <span className="text-sm">{t(template.key)}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="text-xs text-feynman-muted pt-2 border-t">
            {t('template.tip')}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};