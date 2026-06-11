'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
      <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
      <motion.div
        className="max-w-4xl w-full text-center surface p-8 sm:p-12"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Name */}
        <motion.h1
          className="text-5xl sm:text-7xl font-bold mb-4"
          variants={item}
        >
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-700 bg-clip-text text-transparent">
            Vemuri Somesh
          </span>
        </motion.h1>

        {/* Title */}
        <motion.p className="text-xl sm:text-2xl text-slate-600 mb-6 font-light" variants={item}>
          Software Engineer | Java | Microservices | Cloud
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed"
          variants={item}
        >
          Building scalable distributed systems and event-driven architectures at{' '}
          <span className="font-semibold text-slate-900">Ford Motor Company</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          variants={item}
        >
          <a
            href="#experience"
            className="px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            View Experience
            <ExternalLink size={18} />
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-slate-300 bg-white/70 text-slate-900 rounded-full font-semibold hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div className="flex gap-6 justify-center mb-12" variants={item}>
          <a
            href="mailto:someshvemuri29@gmail.com"
            className="p-3 hover:bg-white rounded-full transition-all duration-300 text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200"
            aria-label="Email"
          >
            <Mail size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/somesh-vemuri-81a5a0218/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 hover:bg-white rounded-full transition-all duration-300 text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://github.com/someshvemuri"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 hover:bg-white rounded-full transition-all duration-300 text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          variants={item}
        >
          <svg
            className="w-6 h-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
