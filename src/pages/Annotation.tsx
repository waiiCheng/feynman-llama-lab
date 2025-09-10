import Header from '@/components/layout/Header';
import AnnotationForm from '@/components/annotation/AnnotationForm';

const Annotation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-feynman-text mb-4">费曼学习法标注</h1>
          <p className="text-xl text-feynman-muted max-w-2xl mx-auto">
            "If you want to learn about nature, to appreciate nature, it is necessary that you understand the language that she speaks in."
          </p>
          <p className="text-lg text-feynman-muted/70 mt-2 italic">— Richard P. Feynman</p>
        </div>
        <AnnotationForm />
      </main>
    </div>
  );
};

export default Annotation;