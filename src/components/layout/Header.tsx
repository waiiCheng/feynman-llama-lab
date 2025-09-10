import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Database, Network, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">F</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-foreground">
                Feynman LLM
              </h1>
              <p className="text-xs text-muted-foreground">Learning by Teaching</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              asChild
              className="h-9"
            >
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">{t('nav.annotation')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/manage' ? 'default' : 'ghost'}
              asChild
              className="h-9"
            >
              <Link to="/manage" className="flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span className="text-sm">{t('nav.management')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/architecture' ? 'default' : 'ghost'}
              asChild
              className="h-9"
            >
              <Link to="/architecture" className="flex items-center space-x-2">
                <Network className="w-4 h-4" />
                <span className="text-sm">{t('nav.architecture')}</span>
              </Link>
            </Button>
            
            <div className="ml-2 pl-2 border-l border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="h-8 px-2"
              >
                <Languages className="w-4 h-4 mr-1" />
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