import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Globe, ArrowRight, Github, Instagram, Mail } from 'lucide-react';
import { CONTENT, Project } from './constants';
import CustomCursor from './components/CustomCursor';
import Modal from './components/Modal';
import InteractiveTitle, { FluidCanvas } from './components/InteractiveTitle';

interface ProjectCardProps {
  project: any;
  index: number;
  lang: 'en' | 'zh';
  isMobile: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, lang, isMobile, onClick }) => {
  const cardRef = useRef(null);
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // More responsive spring settings for mobile to make color pop faster
  const springConfig = isMobile 
    ? { stiffness: 90, damping: 30, restDelta: 0.01 } 
    : { stiffness: 100, damping: 30, restDelta: 0.001 };

  const smoothCardProgress = useSpring(cardProgress, springConfig);
  
  // Stronger, more varied parallax - Disabled on mobile for stability
  const parallaxValues = isMobile ? [0, 0] : [
    [-120, 120],
    [80, -80],
    [-60, 180],
    [150, -50]
  ][index % 4];
  
  const y = useTransform(smoothCardProgress, [0, 1], parallaxValues);
  const rotate = useTransform(smoothCardProgress, [0, 1], isMobile ? [0, 0] : [index % 2 === 0 ? -2 : 2, index % 2 === 0 ? 2 : -2]);
  const opacity = useTransform(smoothCardProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  // Inner image parallax - Reduced range on mobile for stability
  const imgY = useTransform(smoothCardProgress, [0, 1], isMobile ? ["-4%", "4%"] : ["-10%", "10%"]);

  // More "broken" grid spans - Simplified for mobile
  const gridClasses = [
    "md:col-span-8 aspect-[16/10]",
    "md:col-span-4 aspect-[3/4] md:mt-40",
    "md:col-span-5 aspect-square md:-mt-20",
    "md:col-span-7 aspect-[16/9] md:mt-10"
  ][index % 4];

  // Tighter scroll range for mobile highlighting to make it "pop" faster
  const grayscale = useTransform(smoothCardProgress, [0, 0.42, 0.5, 0.58, 1], [100, 100, 0, 100, 100]);
  const brightness = useTransform(smoothCardProgress, [0, 0.42, 0.5, 0.58, 1], [75, 75, 100, 75, 75]);
  const scrollFilter = useTransform([grayscale, brightness], ([g, b]) => `grayscale(${g}%) brightness(${b}%)`);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, rotate, opacity }}
      className={`${gridClasses} group cursor-pointer relative mb-12 md:mb-0`}
      onClick={onClick}
    >
      <div className="w-full h-full relative overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <motion.img 
          style={{ 
            y: imgY, 
            scale: 1.2,
            filter: isMobile ? scrollFilter : undefined
          }} // Scale up slightly to allow room for inner parallax
          whileHover={{ scale: 1.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          src={project.image} 
          alt={project.title[lang]}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 will-change-transform ${!isMobile ? 'grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Editorial Style Label - Visible by default */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <div className="overflow-hidden">
            <motion.span 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              className="block text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/50 font-medium"
            >
              0{index + 1} / {project.category[lang]}
            </motion.span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-10">
          <motion.h3 
            className="text-lg md:text-2xl font-serif text-white/90 leading-none"
          >
            {project.title[lang]}
          </motion.h3>
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const aboutImgY = useTransform(smoothProgress, [0.5, 0.8], isMobile ? [20, -20] : [50, -50]);

  return (
    <div ref={containerRef} className="relative min-h-screen font-sans selection:bg-white selection:text-black">
      <div className="noise-overlay" />
      <FluidCanvas />
      <CustomCursor />
      
      {/* Background Elements */}
      <motion.div 
        style={{ scale: bgScale }}
        className="fixed inset-0 z-[-1] overflow-hidden"
      >
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], [0, -200]) }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" 
        />
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], [0, 200]) }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" 
        />
        <motion.div 
          style={{ 
            x: useTransform(smoothProgress, [0, 1], [-100, 100]),
            y: useTransform(smoothProgress, [0, 1], [100, -100])
          }}
          className="absolute top-1/2 left-1/4 w-[30%] h-[30%] rounded-full bg-teal-500/5 blur-[100px]" 
        />
      </motion.div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-serif italic tracking-tighter"
          >
            Aura.
          </motion.div>
          
          <div className="flex items-center gap-8 md:gap-12">
            <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-white/60">
              <a href="#work" className="hover:text-white transition-colors">{CONTENT.nav.work[lang]}</a>
              <a href="#about" className="hover:text-white transition-colors">{CONTENT.nav.about[lang]}</a>
              <a href="#contact" className="hover:text-white transition-colors">{CONTENT.nav.contact[lang]}</a>
            </div>
            
            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-full liquid-glass hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'ZH' : 'EN'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl text-center z-10"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-sm uppercase tracking-[0.3em] text-white/40 mb-6"
          >
            Portfolio 2026
          </motion.span>
          <InteractiveTitle 
            text={CONTENT.hero.title[lang]}
            className="text-5xl md:text-8xl font-serif leading-[1.1] mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {CONTENT.hero.subtitle[lang]}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a 
              href="#work"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform group"
            >
              {CONTENT.hero.cta[lang]}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* Liquid Glass Decorative Element */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full liquid-glass z-0 opacity-20 pointer-events-none"
        />
      </section>

      {/* Work Section */}
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-24">
            <h2 className="text-4xl md:text-6xl font-serif">{CONTENT.nav.work[lang]}</h2>
            <div className="text-white/40 text-sm uppercase tracking-widest">Selected Projects</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
            {CONTENT.projects.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project}
                index={index}
                lang={lang}
                isMobile={isMobile}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif mb-8">{CONTENT.about.title[lang]}</h2>
            <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12 italic">
              "{CONTENT.about.text[lang]}"
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm uppercase tracking-widest text-white/30 mb-4">Services</h4>
                <ul className="space-y-2 text-white/60">
                  <li>UI/UX Design</li>
                  <li>Art Direction</li>
                  <li>Motion Graphics</li>
                  <li>Web Development</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest text-white/30 mb-4">Experience</h4>
                <ul className="space-y-2 text-white/60">
                  <li>Senior Designer @ Flux</li>
                  <li>Visual Lead @ Echo</li>
                  <li>Freelance @ Various</li>
                </ul>
              </div>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-full overflow-hidden liquid-glass p-4"
          >
            <motion.img 
              style={{ y: aboutImgY }}
              src="https://picsum.photos/seed/designer/800/800" 
              alt="Designer" 
              className="w-full h-full object-cover rounded-full grayscale scale-110 will-change-transform"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-serif mb-12">{CONTENT.contact.title[lang]}</h2>
          <a 
            href={`mailto:${CONTENT.contact.email}`}
            className="text-2xl md:text-4xl font-light hover:text-white/50 transition-colors underline underline-offset-8 mb-16 inline-block"
          >
            {CONTENT.contact.email}
          </a>
          
          <div className="flex justify-center gap-8 mt-16">
            {CONTENT.contact.socials.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                className="text-sm uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/20 text-xs uppercase tracking-[0.2em]">
        &copy; 2026 Aura Design Studio. All Rights Reserved.
      </footer>

      {/* Project Modal */}
      <Modal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        lang={lang} 
      />
    </div>
  );
}
