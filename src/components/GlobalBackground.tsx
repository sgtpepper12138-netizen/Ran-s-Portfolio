import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const GlobalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const scrollVelocity = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: opaque canvas
    if (!ctx) return;

    let animationFrame: number;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile.current = window.innerWidth < 1024;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity.current = (currentScrollY - lastScrollY) * 0.5;
      lastScrollY = currentScrollY;
    };

    const createParticle = (x: number, y: number, isAuto = false) => {
      const colors = ['#00f2ff', '#00ff8c', '#7000ff'];
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * (isAuto ? 0.3 : 1.5),
        vy: (Math.random() - 0.5) * (isAuto ? 0.3 : 1.5),
        life: isAuto ? Math.random() * 0.5 + 0.3 : 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: isAuto ? Math.random() * 30 + 15 : Math.random() * 10 + 3,
      };
    };

    const update = (time: number) => {
      const deltaTime = (time - lastTime) / 16.67; // Normalize to 60fps
      lastTime = time;

      // Fill background instead of clearRect for performance with alpha:false
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Limit particle creation on mobile
      const spawnRate = isMobile.current ? 0.03 : 0.05;
      const maxParticles = isMobile.current ? 40 : 100;

      if (!isMobile.current && mouse.current.active && particles.current.length < maxParticles) {
        particles.current.push(createParticle(mouse.current.x, mouse.current.y));
      }

      if (Math.random() < spawnRate && particles.current.length < maxParticles) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.current.push(createParticle(x, y, true));
      }

      ctx.globalCompositeOperation = 'screen';
      
      particles.current = particles.current.filter(p => {
        if (isMobile.current) {
          p.y -= scrollVelocity.current * 0.15;
        }

        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        p.life -= (isMobile.current ? 0.004 : 0.01) * deltaTime;
        p.size *= (isMobile.current ? 0.997 : 0.985);

        if (p.life <= 0 || p.size < 0.5) return false;

        // Optimization: Use simple circles on mobile if needed, but let's try simplified gradients first
        ctx.beginPath();
        const alpha = Math.floor(p.life * (isMobile.current ? 120 : 200));
        const brightnessBoost = isMobile.current ? Math.min(Math.abs(scrollVelocity.current) * 3, 80) : 0;
        const finalAlpha = Math.min(alpha + brightnessBoost, 255).toString(16).padStart(2, '0');
        
        // Simplified gradient: only 2 stops
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color + finalAlpha);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      scrollVelocity.current *= 0.92;
      animationFrame = requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile.current) return;
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    resize();
    animationFrame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ 
        filter: 'blur(8px) contrast(1.1)',
        backgroundColor: '#050505'
      }}
    />
  );
};

export default GlobalBackground;
