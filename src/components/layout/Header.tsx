import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Database, Network, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gradient-classical shadow-royal border-b border-classical-gold/30 backdrop-blur-xl relative overflow-hidden">
      {/* Classical ornamental background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-pattern-renaissance" />
      </div>
      
      <div className="relative container mx-auto px-4 py-6">
        <div className="flex items-center justify-between animate-royal-entrance">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow relative animate-quantum-pulse">
              <span className="text-marble-white font-bold text-lg font-physics">F</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-hero animate-energy-wave opacity-30" />
            </div>
            <div className="space-y-1">
              <h1 className="font-bold text-2xl text-feynman-text font-physics tracking-wide">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Feynman LLM
                </span>
              </h1>
              <p className="text-sm text-classical-gold science-text">Learning by Teaching</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              asChild
              className="glow-border hover:shadow-terminal transition-all duration-300 hover:scale-105"
            >
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-classical-gold" />
                <span className="font-physics">{t('nav.annotation')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/manage' ? 'default' : 'ghost'}
              asChild
              className="glow-border hover:shadow-terminal transition-all duration-300 hover:scale-105"
            >
              <Link to="/manage" className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-feynman-terminal" />
                <span className="font-physics">{t('nav.management')}</span>
              </Link>
            </Button>
            <Button
              variant={location.pathname === '/architecture' ? 'default' : 'ghost'}
              asChild
              className="glow-border hover:shadow-terminal transition-all duration-300 hover:scale-105"
            >
              <Link to="/architecture" className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-royal-purple" />
                <span className="font-physics">{t('nav.architecture')}</span>
              </Link>
            </Button>
            
            {/* Enhanced Language Switcher */}
            <div className="ml-4 pl-4 border-l border-classical-gold/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="glow-border hover:shadow-glow transition-all duration-300 hover:scale-105 bg-gradient-subtle"
              >
                <Globe className="w-4 h-4 text-feynman-terminal animate-quantum-pulse" />
                <span className="ml-2 text-xs font-mono text-classical-gold">{language.toUpperCase()}</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;