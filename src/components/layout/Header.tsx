import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Database, Network, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-lg">∂</span>
            </div>
            <div>
              <h1 className="text-heading text-foreground font-display">
                FeynmanOS
              </h1>
              <p className="text-caption">Deconstructing Reality from First Principles</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              asChild
              className="h-10 px-4 rounded-lg transition-colors"
            >
              <Link to="/" className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span className="text-label">{t('nav.annotation')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/manage' ? 'default' : 'ghost'}
              asChild
              className="h-10 px-4 rounded-lg transition-colors"
            >
              <Link to="/manage" className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <span className="text-label">{t('nav.management')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/architecture' ? 'default' : 'ghost'}
              asChild
              className="h-10 px-4 rounded-lg transition-colors"
            >
              <Link to="/architecture" className="flex items-center gap-3">
                <Network className="w-4 h-4" />
                <span className="text-label">{t('nav.architecture')}</span>
              </Link>
            </Button>
            
            <div className="ml-4 pl-4 border-l border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="h-9 px-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Languages className="w-4 h-4 mr-2" />
                <span className="text-label font-mono">{language.toUpperCase()}</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;