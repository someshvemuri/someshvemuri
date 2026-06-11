'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-slate-900">{"Let's connect"}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-slate-900 to-emerald-500 rounded-full mb-12" />
        </motion.div>

        <motion.p
          className="text-lg text-slate-600 max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {"I'm always interested in discussing software engineering, system design, and new opportunities. Feel free to reach out!"}
        </motion.p>

        <motion.div
          className="grid sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: Mail,
              label: 'Email',
              href: 'mailto:someshvemuri29@gmail.com',
              display: 'someshvemuri29@gmail.com',
            },
            {
              icon: Linkedin,
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/somesh-vemuri-81a5a0218/',
              display: 'Connect on LinkedIn',
            },
            {
              icon: Github,
              label: 'GitHub',
              href: 'https://github.com/someshvemuri',
              display: 'Follow on GitHub',
            },
          ].map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={idx}
                href={contact.href}
                target={contact.href.startsWith('mailto') ? undefined : '_blank'}
                rel={contact.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="surface p-6 hover:border-emerald-100 hover:bg-white transition-all duration-300 group flex flex-col items-center text-center"
                whileHover={{ y: -4 }}
              >
                <Icon size={32} className="text-slate-900 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900 mb-2">{contact.label}</h3>
                <p className="text-sm text-slate-600 hover:text-slate-900 transition-colors break-all">
                  {contact.display}
                </p>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
