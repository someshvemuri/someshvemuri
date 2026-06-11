'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Experience />
      <Skills />
      <Contact />

      {/* Footer */}
      <motion.footer
        className="mt-6 border-t border-white/70 py-12 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm">© 2026 Vemuri Somesh</p>
        </div>
      </motion.footer>
    </main>
  );
}
