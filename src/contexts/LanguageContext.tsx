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
    'annotation.question.placeholder': '例如：什么是量子力学？',
    'annotation.response.placeholder': '费曼会怎么解释这个问题？用简单、直观的方式...',
    'annotation.quality.placeholder': '选择质量等级',
    'annotation.notes.placeholder': '其他备注信息...',
    'annotation.validation.title': '请填写必要字段',
    'annotation.validation.desc': '问题和回答都是必填项',
    'annotation.saved.title': '标注已保存',
    'annotation.saved.desc': '数据已成功保存到本地存储',
    
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
    'style.analogy.desc': '用简单例子解释复杂概念',
    'style.simplify.desc': '化繁为简的表达方式',
    'style.story.desc': '用故事情节增强理解',
    'style.firstprinciples.desc': '从基本原理出发思考',
    
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
    
    // Local Training Setup
    'training.title': '本地训练配置',
    'training.subtitle': '在您的本地环境中训练费曼风格的 LLM 模型',
    'training.setup': '训练配置',
    'training.data': '数据准备',
    'training.scripts': '脚本生成',
    'training.deploy': '部署指南',
    'training.modelParams': '模型参数',
    'training.systemReqs': '系统要求',
    'training.baseModel': '基础模型',
    'training.epochs': '训练轮数',
    'training.batchSize': '批次大小',
    'training.learningRate': '学习率',
    'training.gpuMemory': 'GPU 内存',
    'training.systemMemory': '系统内存',
    'training.storage': '存储空间',
    'training.pythonVersion': 'Python 版本',
    'training.dataStats': '数据统计',
    'training.annotationCount': '标注数量',
    'training.qualityDistribution': '质量分布',
    'training.avgLength': '平均长度',
    'training.exportTrainingData': '导出训练数据',
    'training.generateScript': '生成训练脚本',
    'training.configFile': '配置文件',
    'training.requirementsFile': '依赖文件',
    'training.trainingScript': '训练脚本',
    'training.localDeploy': '本地部署',
    'training.cloudDeploy': '云端部署',
    'training.downloadGenerated': '下载已生成',
    'training.configGenerated': '配置文件已生成',
    'training.configDesc': 'training_config.json 已下载',
    'training.reqGenerated': '依赖文件已生成',
    'training.reqDesc': 'requirements.txt 已下载',
    
    // Preview Panel
    'preview.realTime': '实时预览',
    'preview.quality': '质量评级',
    'preview.analysis': '质量分析',
    'preview.wordCount': '字数统计',
    'preview.complexity': '复杂度',
    'preview.complexity.复杂': '复杂',
    'preview.complexity.中等': '中等',
    'preview.complexity.简单': '简单',
    'preview.hasAnalogy': '包含类比',
    'preview.hasExample': '有具体例子',
    'preview.isSimple': '长度适中',
    
    // Template Selector
    'template.title': '费曼模板',
    'template.category.explanation': '解释说明',
    'template.category.reasoning': '推理思考',
    'template.category.storytelling': '故事叙述',
    'template.tip': '提示：在文本框中按 "/" 快速调用模板',
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
    'annotation.question.placeholder': 'e.g., What is quantum mechanics?',
    'annotation.response.placeholder': 'How would Feynman explain this? Use simple, intuitive ways...',
    'annotation.quality.placeholder': 'Select quality level',
    'annotation.notes.placeholder': 'Additional notes...',
    'annotation.validation.title': 'Please fill required fields',
    'annotation.validation.desc': 'Question and response are required',
    'annotation.saved.title': 'Annotation Saved',
    'annotation.saved.desc': 'Data successfully saved to local storage',
    
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
    'style.analogy.desc': 'Explain complex concepts with simple examples',
    'style.simplify.desc': 'Simplify complex expressions',
    'style.story.desc': 'Use storytelling to enhance understanding',
    'style.firstprinciples.desc': 'Think from basic principles',
    
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
    
    // Local Training Setup
    'training.title': 'Local Training Setup',
    'training.subtitle': 'Train Feynman-style LLM models in your local environment',
    'training.setup': 'Training Setup',
    'training.data': 'Data Preparation',
    'training.scripts': 'Script Generation',
    'training.deploy': 'Deployment Guide',
    'training.modelParams': 'Model Parameters',
    'training.systemReqs': 'System Requirements',
    'training.baseModel': 'Base Model',
    'training.epochs': 'Training Epochs',
    'training.batchSize': 'Batch Size',
    'training.learningRate': 'Learning Rate',
    'training.gpuMemory': 'GPU Memory',
    'training.systemMemory': 'System Memory',
    'training.storage': 'Storage Space',
    'training.pythonVersion': 'Python Version',
    'training.dataStats': 'Data Statistics',
    'training.annotationCount': 'Annotation Count',
    'training.qualityDistribution': 'Quality Distribution',
    'training.avgLength': 'Average Length',
    'training.exportTrainingData': 'Export Training Data',
    'training.generateScript': 'Generate Training Script',
    'training.configFile': 'Config File',
    'training.requirementsFile': 'Requirements File',
    'training.trainingScript': 'Training Script',
    'training.localDeploy': 'Local Deployment',
    'training.cloudDeploy': 'Cloud Deployment',
    'training.downloadGenerated': 'Download Generated',
    'training.configGenerated': 'Config file generated',
    'training.configDesc': 'training_config.json downloaded',
    'training.reqGenerated': 'Requirements file generated',
    'training.reqDesc': 'requirements.txt downloaded',
    
    // Preview Panel
    'preview.realTime': 'Real-time Preview',
    'preview.quality': 'Quality Rating',
    'preview.analysis': 'Quality Analysis',
    'preview.wordCount': 'Word Count',
    'preview.complexity': 'Complexity',
    'preview.complexity.复杂': 'Complex',
    'preview.complexity.中等': 'Medium',
    'preview.complexity.简单': 'Simple',
    'preview.hasAnalogy': 'Contains Analogy',
    'preview.hasExample': 'Has Examples',
    'preview.isSimple': 'Appropriate Length',
    
    // Template Selector
    'template.title': 'Feynman Templates',
    'template.category.explanation': 'Explanation',
    'template.category.reasoning': 'Reasoning',
    'template.category.storytelling': 'Storytelling',
    'template.tip': 'Tip: Press "/" in text box to quickly invoke templates',
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