'use client';

import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, FileText, Folder } from 'lucide-react';
import Link from 'next/link';

export default function VaultCard() {
  return (
    <section id="vault" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-slate-900">My Vault</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-slate-900 to-sky-500 rounded-full mb-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/vault/my-vault" className="group block">
            <div className="border border-slate-200 rounded-2xl p-8 hover:border-slate-400 hover:shadow-xl transition-all duration-300 bg-white hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Digital Second Brain</h3>
                    <p className="text-slate-500 text-sm">Personal knowledge management system</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-200 mt-1" />
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                An Obsidian-based vault of notes, articles, diagrams, and learnings — spanning engineering, systems design, distributed systems, and more.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Folder, label: 'Notes & Articles' },
                  { icon: FileText, label: 'Excalidraw Diagrams' },
                  { icon: BookOpen, label: 'Learning Journal' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-sky-600 font-medium text-sm group-hover:text-sky-700">
                <span>Open Vault</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
