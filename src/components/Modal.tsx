import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Project } from '../constants';

interface ModalProps {
  project: Project | null;
  onClose: () => void;
  lang: 'en' | 'zh';
}

const Modal: React.FC<ModalProps> = ({ project, onClose, lang }) => {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto liquid-glass rounded-3xl p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title[lang]}
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm uppercase tracking-widest text-white/50 mb-2">
                  {project.category[lang]}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif mb-6">
                  {project.title[lang]}
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  {project.description[lang]}
                </p>
                <div className="h-px w-full bg-white/10 mb-8" />
                <div className="flex gap-4">
                  <button className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
                    {lang === 'en' ? 'View Live' : '查看在线地址'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
