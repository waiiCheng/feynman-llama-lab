import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Play, 
  Code, 
  FileText, 
  Settings, 
  Cpu, 
  HardDrive,
  Monitor,
  Terminal,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LocalTrainingSetup = () => {
  const { toast } = useToast();
  const [modelConfig, setModelConfig] = useState({
    baseModel: 'mistral-7b',
    epochs: 3,
    batchSize: 4,
    learningRate: '2e-5',
    maxLength: 2048
  });
  
  // 获取本地标注数据
  const getLocalData = () => {
    return JSON.parse(localStorage.getItem('feynman-annotations') || '[]');
  };

  // 生成训练脚本
  const generateTrainingScript = () => {
    const annotations = getLocalData();
    
    const script = `#!/usr/bin/env python3
# 费曼学习法 LLM 微调脚本
# 自动生成于: ${new Date().toLocaleString()}

import json
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from datasets import Dataset
from peft import LoraConfig, get_peft_model

# 配置参数
MODEL_NAME = "mistralai/Mistral-7B-v0.1"
OUTPUT_DIR = "./feynman-model"
DATASET_SIZE = ${annotations.length}

# LoRA 配置
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.1,
    bias="none",
    task_type="CAUSAL_LM"
)

# 训练参数
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=${modelConfig.epochs},
    per_device_train_batch_size=${modelConfig.batchSize},
    gradient_accumulation_steps=4,
    learning_rate=${modelConfig.learningRate},
    max_steps=-1,
    warmup_steps=100,
    logging_steps=10,
    save_steps=500,
    evaluation_strategy="steps",
    eval_steps=500,
    remove_unused_columns=False,
    push_to_hub=False,
    report_to=None
)

def load_feynman_dataset():
    """加载费曼标注数据"""
    data = []
    
    # 从导出的 JSON 文件加载
    with open('feynman_annotations.json', 'r', encoding='utf-8') as f:
        annotations = json.load(f)
    
    for item in annotations:
        # 构建费曼风格的对话格式
        conversation = f"""<s>[INST] {item['question']} [/INST]
{item['response']}</s>"""
        
        data.append({
            'text': conversation,
            'quality': item['quality'],
            'features': item['styleFeatures']
        })
    
    return Dataset.from_list(data)

def tokenize_function(examples):
    """数据预处理"""
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token
    
    return tokenizer(
        examples["text"],
        truncation=True,
        max_length=${modelConfig.maxLength},
        padding=False
    )

def main():
    print("🚀 开始费曼学习法模型训练...")
    
    # 加载模型和分词器
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token
    
    # 应用 LoRA
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    # 准备数据
    dataset = load_feynman_dataset()
    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    
    # 分割训练和验证集
    train_size = int(0.8 * len(tokenized_dataset))
    train_dataset = tokenized_dataset.select(range(train_size))
    eval_dataset = tokenized_dataset.select(range(train_size, len(tokenized_dataset)))
    
    # 数据收集器
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False,
        pad_to_multiple_of=8
    )
    
    # 初始化训练器
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        data_collator=data_collator,
        tokenizer=tokenizer
    )
    
    # 开始训练
    print("📚 开始微调...")
    trainer.train()
    
    # 保存模型
    trainer.save_model()
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    print("✅ 训练完成！模型已保存到:", OUTPUT_DIR)

if __name__ == "__main__":
    main()
`;

    // 下载脚本
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'train_feynman_model.py';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "训练脚本已生成",
      description: "Python训练脚本已下载到本地"
    });
  };

  // 导出训练数据
  const exportTrainingData = () => {
    const annotations = getLocalData();
    const trainingData = annotations.map(item => ({
      question: item.question,
      response: item.response,
      styleFeatures: item.styleFeatures,
      quality: item.quality,
      metadata: {
        timestamp: item.timestamp,
        annotator: item.annotator
      }
    }));

    const blob = new Blob([JSON.stringify(trainingData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feynman_annotations.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "训练数据已导出",
      description: `${annotations.length} 条标注数据已导出为 JSON 格式`
    });
  };

  // 生成requirements.txt
  const generateRequirements = () => {
    const requirements = `# 费曼学习法 LLM 训练环境依赖
torch>=2.0.0
transformers>=4.30.0
datasets>=2.12.0
peft>=0.4.0
accelerate>=0.20.0
bitsandbytes>=0.39.0
wandb>=0.15.0
tensorboard>=2.13.0
numpy>=1.24.0
pandas>=2.0.0
tqdm>=4.65.0
scikit-learn>=1.3.0
matplotlib>=3.7.0
seaborn>=0.12.0
`;

    const blob = new Blob([requirements], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requirements.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "依赖文件已生成",
      description: "requirements.txt 已下载"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-feynman-text">本地训练配置</h2>
        <p className="text-feynman-muted max-w-2xl mx-auto">
          在您的本地环境中训练费曼风格的 LLM 模型
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">训练配置</TabsTrigger>
          <TabsTrigger value="data">数据准备</TabsTrigger>
          <TabsTrigger value="scripts">脚本生成</TabsTrigger>
          <TabsTrigger value="deploy">部署指南</TabsTrigger>
        </TabsList>

        {/* 训练配置 */}
        <TabsContent value="setup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-feynman-blue" />
                  <span>模型参数</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-feynman-text">基础模型</label>
                  <Select 
                    value={modelConfig.baseModel} 
                    onValueChange={(value) => setModelConfig(prev => ({...prev, baseModel: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mistral-7b">Mistral-7B</SelectItem>
                      <SelectItem value="llama2-7b">Llama2-7B</SelectItem>
                      <SelectItem value="codellama-7b">CodeLlama-7B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-feynman-text">训练轮数</label>
                  <Input 
                    type="number" 
                    value={modelConfig.epochs}
                    onChange={(e) => setModelConfig(prev => ({...prev, epochs: parseInt(e.target.value)}))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-feynman-text">批次大小</label>
                  <Input 
                    type="number" 
                    value={modelConfig.batchSize}
                    onChange={(e) => setModelConfig(prev => ({...prev, batchSize: parseInt(e.target.value)}))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-feynman-text">学习率</label>
                  <Input 
                    value={modelConfig.learningRate}
                    onChange={(e) => setModelConfig(prev => ({...prev, learningRate: e.target.value}))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-feynman-orange" />
                  <span>系统要求</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">GPU 内存</span>
                    <Badge variant="outline">≥ 16GB VRAM</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">系统内存</span>
                    <Badge variant="outline">≥ 32GB RAM</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">存储空间</span>
                    <Badge variant="outline">≥ 50GB</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium">Python 版本</span>
                    <Badge variant="outline">≥ 3.8</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-feynman-text mb-2">推荐配置</h4>
                  <ul className="text-sm text-feynman-muted space-y-1">
                    <li>• RTX 4090 / A100 GPU</li>
                    <li>• CUDA 11.8+</li>
                    <li>• Ubuntu 20.04+</li>
                    <li>• Docker (可选)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 数据准备 */}
        <TabsContent value="data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-feynman-blue" />
                  <span>数据统计</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-feynman-blue">{getLocalData().length}</div>
                      <div className="text-sm text-feynman-muted">总标注数</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-feynman-orange">
                        {Math.round(getLocalData().length * 0.8)}
                      </div>
                      <div className="text-sm text-feynman-muted">训练集</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-feynman-text">质量分布</h4>
                    {['excellent', 'good', 'needs-work'].map(quality => {
                      const count = getLocalData().filter(item => item.quality === quality).length;
                      const percentage = getLocalData().length > 0 ? (count / getLocalData().length) * 100 : 0;
                      return (
                        <div key={quality} className="flex items-center space-x-3">
                          <span className="text-sm w-16">
                            {quality === 'excellent' ? '优秀' : quality === 'good' ? '良好' : '需改进'}
                          </span>
                          <Progress value={percentage} className="flex-1 h-2" />
                          <span className="text-sm text-feynman-muted w-12">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-feynman-orange" />
                  <span>数据导出</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={exportTrainingData}
                  className="w-full bg-feynman-blue hover:bg-feynman-blue/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出训练数据 (JSON)
                </Button>

                <div className="text-sm text-feynman-muted space-y-2">
                  <h4 className="font-medium text-feynman-text">数据格式说明</h4>
                  <pre className="bg-card p-3 rounded text-xs overflow-x-auto">
{`{
  "question": "什么是能量？",
  "response": "想象你推箱子...",
  "styleFeatures": ["analogy"],
  "quality": "excellent"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 脚本生成 */}
        <TabsContent value="scripts">
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-feynman-blue" />
                  <span>自动生成训练脚本</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={generateTrainingScript}
                    className="bg-feynman-blue hover:bg-feynman-blue/90"
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    生成训练脚本
                  </Button>
                  
                  <Button 
                    onClick={generateRequirements}
                    variant="outline"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    生成依赖文件
                  </Button>
                  
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    生成配置文件
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle>训练流程</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 1, title: '环境准备', desc: '安装 Python 依赖和 CUDA' },
                    { step: 2, title: '数据导出', desc: '从标注界面导出 JSON 数据' },
                    { step: 3, title: '脚本下载', desc: '下载自动生成的训练脚本' },
                    { step: 4, title: '开始训练', desc: '运行 python train_feynman_model.py' },
                    { step: 5, title: '模型部署', desc: '部署训练好的模型' }
                  ].map(item => (
                    <div key={item.step} className="flex items-start space-x-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-feynman-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium text-feynman-text">{item.title}</h4>
                        <p className="text-sm text-feynman-muted">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 部署指南 */}
        <TabsContent value="deploy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-feynman-blue" />
                  <span>本地部署</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card p-4 rounded-lg">
                  <h4 className="font-medium mb-2">快速启动</h4>
                  <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`# 加载模型
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("./feynman-model")
tokenizer = AutoTokenizer.from_pretrained("./feynman-model")

# 费曼式问答
def feynman_answer(question):
    prompt = f"<s>[INST] {question} [/INST]"
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=512)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)`}
                  </pre>
                </div>

                <Button className="w-full bg-feynman-blue hover:bg-feynman-blue/90">
                  <Play className="w-4 h-4 mr-2" />
                  启动本地服务
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-feynman-orange" />
                  <span>性能优化</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-feynman-text">量化部署</h4>
                    <p className="text-sm text-feynman-muted">使用 4-bit 量化减少内存占用</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-feynman-text">批处理推理</h4>
                    <p className="text-sm text-feynman-muted">支持多个问题同时处理</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-feynman-text">缓存优化</h4>
                    <p className="text-sm text-feynman-muted">缓存常见问题的答案</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalTrainingSetup;