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

const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: disable alpha if possible, but we need it for trails
    if (!ctx) return;

    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile.current = window.innerWidth < 1024;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity.current = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;
    };

    const createParticle = (x: number, y: number, isAuto = false) => {
      const colors = ['#00f2ff', '#00ff8c', '#7000ff'];
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * (isAuto ? 0.3 : 1.5),
        vy: (Math.random() - 0.5) * (isAuto ? 0.3 : 1.5),
        life: isAuto ? Math.random() * 0.4 + 0.4 : 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: isAuto ? Math.random() * 60 + 30 : Math.random() * 20 + 10,
      };
    };

    const update = () => {
      // Use a semi-transparent fill for trails instead of clearRect for smoother visuals
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (!isMobile.current && mouse.current.active) {
        // Limit particle creation on desktop too
        if (particles.current.length < 200) {
          for (let i = 0; i < 2; i++) {
            particles.current.push(createParticle(mouse.current.x, mouse.current.y));
          }
        }
      }

      if (isMobile.current && Math.random() < 0.03) {
        if (particles.current.length < 40) { // Strict limit for mobile
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          particles.current.push(createParticle(x, y, true));
        }
      }

      ctx.globalCompositeOperation = 'screen';
      
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        
        if (isMobile.current) {
          p.y -= scrollVelocity.current * 0.15;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= isMobile.current ? 0.004 : 0.01;
        p.size *= 0.99;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        // Optimization: Use simpler circles instead of complex radial gradients on mobile if needed
        // But let's try a single color with alpha first
        const alpha = p.life * (isMobile.current ? 0.4 : 0.7);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1.0;
      scrollVelocity.current *= 0.92;
      animationFrame = requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile.current) return;
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobile.current) return;
      const touch = e.touches[0];
      mouse.current = { x: touch.clientX, y: touch.clientY, active: true };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', () => mouse.current.active = true);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', () => mouse.current.active = false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    resize();
    update();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', () => {});
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', () => {});
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[-1] bg-[#050505]"
      style={{ 
        filter: 'blur(40px)', // Heavier blur but on a single canvas is usually okay
        transform: 'translateZ(0)', // Force GPU
      }}
    />
  );
};

export default FluidBackground;
