import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Database, Network, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

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
          
          <nav className="flex items-center space-x-2">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/">
                <BookOpen className="w-4 h-4" />
                <span>{t('nav.annotation')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/manage' ? 'default' : 'ghost'}
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/manage">
                <Database className="w-4 h-4" />
                <span>{t('nav.management')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/architecture' ? 'default' : 'ghost'}
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/architecture">
                <Network className="w-4 h-4" />
                <span>{t('nav.architecture')}</span>
              </Link>
            </Button>
            
            {/* Language Switcher */}
            <div className="ml-4 pl-4 border-l border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-mono">{language.toUpperCase()}</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;