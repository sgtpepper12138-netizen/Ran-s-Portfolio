import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Project } from '../constants';

interface ModalProps {
  project: Project | null;
  onClose: () => void;
  lang: 'en' | 'zh';
}

const Modal: React.FC<ModalProps> = ({ project, onClose, lang }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/95 backdrop-blur-2xl py-8 px-4 md:py-20 md:px-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-6xl w-full liquid-glass rounded-[2rem] p-6 md:p-12 mb-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="fixed top-6 right-6 md:top-10 md:right-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all z-[10001] border border-white/10 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="flex flex-col gap-12">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                <img
                  src={project.image}
                  alt={project.title[lang]}
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/30 mb-6"
                >
                  {project.category[lang]}
                </motion.span>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-7xl font-serif mb-10 leading-tight"
                >
                  {project.title[lang]}
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-20 h-px bg-white/20 mb-10"
                />
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-2xl text-white/60 leading-relaxed font-light"
                >
                  {project.description[lang]}
                </motion.p>

                {/* Placeholder for more content as requested */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-20 w-full space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-sm uppercase tracking-widest text-white/30 mb-4">Challenge</h4>
                      <p className="text-white/70">Exploring the boundaries between physical and digital experiences through innovative design patterns.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-sm uppercase tracking-widest text-white/30 mb-4">Solution</h4>
                      <p className="text-white/70">A fluid, responsive interface that adapts to user behavior and environmental context.</p>
                    </div>
                  </div>
                  
                  <img 
                    src={`https://picsum.photos/seed/${project.id}-detail/1200/800`} 
                    alt="Detail" 
                    className="w-full rounded-2xl grayscale opacity-50 hover:opacity-100 transition-opacity duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
