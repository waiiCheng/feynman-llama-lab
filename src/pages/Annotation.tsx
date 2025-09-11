import Header from '@/components/layout/Header';
import AnnotationForm from '@/components/annotation/AnnotationForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Annotation = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background particle-bg">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-energy-wave">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-physics tracking-wide animate-quantum-pulse">
            {t('main.title')}
          </h1>
          <div className="max-w-3xl mx-auto space-y-3">
            <p className="text-xl text-feynman-muted leading-relaxed font-physics">
              {t('annotation.subtitle')}
            </p>
            <p className="text-lg text-feynman-subtle italic science-text tracking-wider">
              {t('annotation.author')}
            </p>
          </div>
        </div>
        <AnnotationForm />
      </main>
    </div>
  );
};

export default Annotation;