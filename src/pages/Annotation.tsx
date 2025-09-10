import Header from '@/components/layout/Header';
import AnnotationForm from '@/components/annotation/AnnotationForm';

const Annotation = () => {
  return (
    <div className="min-h-screen bg-background particle-bg">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-energy-wave">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-physics tracking-wide animate-quantum-pulse">
            费曼学习法标注
          </h1>
          <div className="max-w-3xl mx-auto space-y-3">
            <p className="text-xl text-feynman-muted leading-relaxed font-physics">
              "If you want to learn about nature, to appreciate nature, it is necessary that you understand the language that she speaks in."
            </p>
            <p className="text-lg text-feynman-subtle italic science-text tracking-wider">
              — Richard P. Feynman
            </p>
          </div>
        </div>
        <AnnotationForm />
      </main>
    </div>
  );
};

export default Annotation;