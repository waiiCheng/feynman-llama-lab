import Header from '@/components/layout/Header';
import DataManagement from '@/components/management/DataManagement';

const Management = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DataManagement />
      </main>
    </div>
  );
};

export default Management;