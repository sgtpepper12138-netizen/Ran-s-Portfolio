import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const FluidCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const scrollPos = useRef(0);
  const scrollVelocity = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let lastScrollY = window.scrollY;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile.current = window.innerWidth < 1024;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity.current = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollPos.current = currentScrollY;
    };

    const createParticle = (x: number, y: number, isAuto = false) => {
      const colors = ['#00f2ff', '#00ff8c', '#7000ff'];
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * (isAuto ? 0.5 : 2),
        vy: (Math.random() - 0.5) * (isAuto ? 0.5 : 2),
        life: isAuto ? Math.random() * 0.5 + 0.5 : 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: isAuto ? Math.random() * 40 + 20 : Math.random() * 15 + 5,
      };
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isMobile.current && mouse.current.active) {
        for (let i = 0; i < 3; i++) {
          particles.current.push(createParticle(mouse.current.x, mouse.current.y));
        }
      }

      if (isMobile.current && Math.random() < 0.05) {
        const x = Math.random() * canvas.width;
        const y = (Math.random() * 0.4 + 0.3) * canvas.height;
        particles.current.push(createParticle(x, y, true));
      }

      ctx.globalCompositeOperation = 'screen';
      
      particles.current = particles.current.filter(p => {
        // Apply parallax/drag on mobile scroll
        if (isMobile.current) {
          p.y -= scrollVelocity.current * 0.2; // Parallax drag
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= isMobile.current ? 0.005 : 0.015;
        p.size *= isMobile.current ? 0.995 : 0.98;

        if (p.life <= 0) return false;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        
        // Brighter on scroll
        const brightnessBoost = isMobile.current ? Math.min(Math.abs(scrollVelocity.current) * 2, 100) : 0;
        const baseAlpha = isMobile.current ? 100 : 255;
        const alpha = Math.floor(Math.min(p.life * baseAlpha + brightnessBoost, 255)).toString(16).padStart(2, '0');
        
        gradient.addColorStop(0, p.color + alpha);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Decay scroll velocity
      scrollVelocity.current *= 0.9;

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
    update();

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
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ filter: 'blur(12px) contrast(1.1)' }}
    />
  );
};

interface InteractiveCharacterProps {
  char: string;
  index: number;
}

const InteractiveCharacter: React.FC<InteractiveCharacterProps> = ({ char, index }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
  const glow = useSpring(0, springConfig);
  const blur = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const textShadow = useTransform(glow, [0, 1], [
    '0 0 0px rgba(0, 242, 255, 0)',
    '0 0 25px rgba(0, 242, 255, 0.8)'
  ]);

  const filter = useTransform(blur, b => `blur(${b}px)`);
  const color = useTransform(glow, [0, 1], ['#ffffff', '#00f2ff']);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setScrollY(window.scrollY);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024 || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - charCenterX;
      const distanceY = e.clientY - charCenterY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      const radius = 120;

      if (distance < radius) {
        const force = (radius - distance) / radius;
        glow.set(force);
        blur.set(force * 4);
        y.set(force * -8);
        scale.set(1 + force * 0.1);
      } else {
        glow.set(0);
        blur.set(0);
        y.set(0);
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [glow, blur, y, scale]);

  if (char === ' ') return <span className="inline-block w-[0.3em]">&nbsp;</span>;

  // Calculate scroll-based offset for mobile
  const scrollOffset = isMobile ? Math.sin(scrollY * 0.05 + index) * 2 : 0;

  return (
    <motion.span
      ref={ref}
      style={{ 
        y: useTransform(y, val => val + scrollOffset), 
        scale, 
        textShadow, 
        filter,
        color,
        display: 'inline-block',
      }}
      animate={isMobile ? {
        y: [0, -4, 0],
        opacity: [0.8, 1, 0.8],
      } : {}}
// ...
      transition={isMobile ? {
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.1,
      } : {}}
      className="select-none will-change-transform relative z-10"
    >
      {char}
    </motion.span>
  );
};

interface InteractiveTitleProps {
  text: string;
  className?: string;
}

const InteractiveTitle: React.FC<InteractiveTitleProps> = ({ text, className }) => {
  return (
    <div className="relative" key={text}>
      <FluidCanvas />
      <h1 className={`${className} relative z-10`}>
        {text.split('').map((char, i) => (
          <InteractiveCharacter key={`${text}-${i}`} char={char} index={i} />
        ))}
      </h1>
    </div>
  );
};

export default InteractiveTitle;
