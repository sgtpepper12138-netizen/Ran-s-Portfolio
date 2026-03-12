import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Globe, ArrowRight, Github, Instagram, Mail } from 'lucide-react';
import { CONTENT, Project } from './constants';
import CustomCursor from './components/CustomCursor';
import Modal from './components/Modal';

export default function App() {
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative min-h-screen font-sans selection:bg-white selection:text-black">
      <CustomCursor />
      
      {/* Background Elements */}
      <motion.div 
        style={{ scale: bgScale }}
        className="fixed inset-0 z-[-1] overflow-hidden"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
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
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-8xl font-serif leading-[1.1] mb-8"
          >
            {CONTENT.hero.title[lang]}
          </motion.h1>
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
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-serif">{CONTENT.nav.work[lang]}</h2>
            <div className="text-white/40 text-sm uppercase tracking-widest">Selected Projects</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {CONTENT.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index % 2 * 0.2 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 liquid-glass">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    src={project.image} 
                    alt={project.title[lang]}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-medium mb-1">{project.title[lang]}</h3>
                    <p className="text-white/40 text-sm uppercase tracking-wider">{project.category[lang]}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 bg-white/5 backdrop-blur-sm">
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
          <div className="relative aspect-square rounded-full overflow-hidden liquid-glass p-4">
            <img 
              src="https://picsum.photos/seed/designer/800/800" 
              alt="Designer" 
              className="w-full h-full object-cover rounded-full grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
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
