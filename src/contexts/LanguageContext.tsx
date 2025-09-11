import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // Navigation
    'nav.annotation': '标注',
    'nav.management': '管理',
    'nav.architecture': '架构',
    'nav.settings': '设置',
    'nav.statistics': '统计',
    
    // Architecture tabs
    'arch.localTraining': '本地训练',
    'arch.overview': '架构概览',
    'arch.knowledgeGraph': '知识图谱',
    'arch.rag': 'RAG 检索',
    'arch.fineTuning': '模型微调',
    
    // Annotation Form
    'annotation.title': '费曼学习法标注',
    'annotation.subtitle': '"If you want to learn about nature, to appreciate nature, it is necessary that you understand the language that she speaks in."',
    'annotation.author': '— Richard P. Feynman',
    'annotation.question': '用户问题',
    'annotation.response': '费曼式回答',
    'annotation.styleFeatures': '思维模式标签',
    'annotation.quality': '回答质量',
    'annotation.notes': '备注',
    'annotation.save': '保存标注',
    'annotation.saveAndNext': '保存并下一条',
    
    // Templates
    'template.analogy': '这就像...',
    'template.simplify': '简单来说...',
    'template.story': '想象一下...',
    'template.firstPrinciple': '从最基础开始...',
    'template.example': '比如说...',
    'template.why': '为什么会这样呢？',
    'template.conclusion': '总结一下...',
    
    // Quality levels
    'quality.excellent': '优秀范例',
    'quality.good': '良好',
    'quality.needsWork': '需改进',
    
    // Style features
    'style.analogy': '使用类比',
    'style.simplify': '简化复杂',
    'style.story': '讲故事',
    'style.firstprinciples': '第一性原理',
    
    // Shortcuts
    'shortcuts.save': 'Ctrl+Enter: 保存并下一条',
    'shortcuts.tab': 'Tab: 切换字段',
    'shortcuts.template': '/: 插入模板',
    'shortcuts.clear': 'Escape: 清空',
    'shortcuts.keyboard': '快捷键',
    
    // Workspace
    'workspace.dualMode': '双屏模式',
    'workspace.singleMode': '单屏模式',
    
    // Data Management
    'manage.title': '数据管理',
    'manage.subtitle': '共 {total} 条标注数据，已筛选 {filtered} 条',
    'manage.export': '导出数据',
    'manage.search': '搜索问题或回答内容...',
    'manage.filterQuality': '筛选质量等级',
    'manage.allQuality': '全部质量',
    'manage.noData': '暂无标注数据',
    'manage.noDataDesc': '开始创建第一个标注吧！',
    'manage.viewDetail': '查看标注详情',
    'manage.question': '问题',
    'manage.response': '费曼式回答',
    'manage.stylePattern': '思维模式',
    'manage.notes': '备注',
    'manage.deleted': '已删除',
    'manage.deletedDesc': '标注数据已成功删除',
    'manage.exported': '导出完成',
    'manage.exportedDesc': '标注数据已导出为JSON文件',
  },
  en: {
    // Navigation
    'nav.annotation': 'Annotation',
    'nav.management': 'Management',
    'nav.architecture': 'Architecture',
    'nav.settings': 'Settings',
    'nav.statistics': 'Statistics',
    
    // Architecture tabs
    'arch.localTraining': 'Local Training',
    'arch.overview': 'Architecture',
    'arch.knowledgeGraph': 'Knowledge Graph',
    'arch.rag': 'RAG Retrieval',
    'arch.fineTuning': 'Fine-tuning',
    
    // Annotation Form
    'annotation.title': 'Feynman Learning Annotation',
    'annotation.subtitle': '"If you want to learn about nature, to appreciate nature, it is necessary that you understand the language that she speaks in."',
    'annotation.author': '— Richard P. Feynman',
    'annotation.question': 'User Question',
    'annotation.response': 'Feynman-style Response',
    'annotation.styleFeatures': 'Thinking Pattern Tags',
    'annotation.quality': 'Response Quality',
    'annotation.notes': 'Notes',
    'annotation.save': 'Save Annotation',
    'annotation.saveAndNext': 'Save & Next',
    
    // Templates
    'template.analogy': 'This is like...',
    'template.simplify': 'Simply put...',
    'template.story': 'Imagine...',
    'template.firstPrinciple': 'Starting from the basics...',
    'template.example': 'For example...',
    'template.why': 'Why does this happen?',
    'template.conclusion': 'To summarize...',
    
    // Quality levels
    'quality.excellent': 'Excellent',
    'quality.good': 'Good',
    'quality.needsWork': 'Needs Work',
    
    // Style features
    'style.analogy': 'Use Analogies',
    'style.simplify': 'Simplify Complex',
    'style.story': 'Tell Stories',
    'style.firstprinciples': 'First Principles',
    
    // Shortcuts
    'shortcuts.save': 'Ctrl+Enter: Save & Next',
    'shortcuts.tab': 'Tab: Switch Fields',
    'shortcuts.template': '/: Insert Template',
    'shortcuts.clear': 'Escape: Clear',
    'shortcuts.keyboard': 'Shortcuts',
    
    // Workspace
    'workspace.dualMode': 'Dual Mode',
    'workspace.singleMode': 'Single Mode',
    
    // Data Management
    'manage.title': 'Data Management',
    'manage.subtitle': '{total} annotations total, {filtered} filtered',
    'manage.export': 'Export Data',
    'manage.search': 'Search questions or responses...',
    'manage.filterQuality': 'Filter by Quality',
    'manage.allQuality': 'All Quality',
    'manage.noData': 'No annotations yet',
    'manage.noDataDesc': 'Start creating your first annotation!',
    'manage.viewDetail': 'View Annotation Detail',
    'manage.question': 'Question',
    'manage.response': 'Feynman-style Response',
    'manage.stylePattern': 'Thinking Patterns',
    'manage.notes': 'Notes',
    'manage.deleted': 'Deleted',
    'manage.deletedDesc': 'Annotation successfully deleted',
    'manage.exported': 'Export Complete',
    'manage.exportedDesc': 'Annotations exported as JSON file',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string, variables?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    if (variables) {
      Object.entries(variables).forEach(([variableKey, value]) => {
        translation = translation.replace(`{${variableKey}}`, String(value));
      });
    }
    
    return translation;
  };

  // 动态切换字体族
  useEffect(() => {
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${language}`);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};