import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

export const ClassicalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 200, // Blue to gold range
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Classical gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.2, 0,
        canvas.width * 0.7, canvas.height * 0.8, canvas.width
      );
      gradient.addColorStop(0, 'hsla(220, 30%, 8%, 0.95)');
      gradient.addColorStop(0.3, 'hsla(43, 20%, 12%, 0.9)');
      gradient.addColorStop(0.7, 'hsla(200, 25%, 15%, 0.85)');
      gradient.addColorStop(1, 'hsla(280, 15%, 10%, 0.9)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulsating opacity
        particle.opacity = 0.3 + Math.sin(Date.now() * 0.001 + index * 0.5) * 0.2;

        // Draw particle with classical glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 8
        );
        glowGradient.addColorStop(0, `hsla(${particle.hue}, 70%, 65%, ${particle.opacity})`);
        glowGradient.addColorStop(0.3, `hsla(${particle.hue}, 50%, 45%, ${particle.opacity * 0.6})`);
        glowGradient.addColorStop(1, `hsla(${particle.hue}, 30%, 25%, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.fillRect(
          particle.x - particle.size * 8,
          particle.y - particle.size * 8,
          particle.size * 16,
          particle.size * 16
        );

        // Draw core particle
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Classical ornament overlay
      const time = Date.now() * 0.0005;
      const ornamentOpacity = 0.1 + Math.sin(time) * 0.05;
      
      ctx.strokeStyle = `hsla(43, 74%, 66%, ${ornamentOpacity})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 15]);
      ctx.lineDashOffset = time * 20;
      
      // Draw decorative frame
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(135deg, hsl(220, 30%, 8%), hsl(43, 20%, 12%), hsl(200, 25%, 15%))'
      }}
    />
  );
};