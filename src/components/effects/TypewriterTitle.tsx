import { useState, useEffect } from 'react';

interface TypewriterTitleProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export const TypewriterTitle: React.FC<TypewriterTitleProps> = ({ 
  text, 
  className = '', 
  speed = 150,
  delay = 500
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? delay : speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, delay]);

  return (
    <div className={`inline-block ${className}`}>
      <span className="font-physics tracking-wide bg-gradient-hero bg-clip-text text-transparent">
        {displayText}
      </span>
      {!isComplete && (
        <span 
          className="ml-1 animate-pulse text-classical-gold font-bold"
          style={{ 
            animation: 'cursor-blink 1s infinite',
            textShadow: '0 0 10px hsl(var(--classical-gold))'
          }}
        >
          |
        </span>
      )}
    </div>
  );
};