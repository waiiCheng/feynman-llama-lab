import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Database } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-card shadow-soft border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-feynman-text">Feynman LLM</h1>
              <p className="text-sm text-feynman-muted">Learning by Teaching</p>
            </div>
          </div>
          
          <nav className="flex space-x-2">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/">
                <BookOpen className="w-4 h-4" />
                <span>标注</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/manage' ? 'default' : 'ghost'}
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/manage">
                <Database className="w-4 h-4" />
                <span>管理</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;