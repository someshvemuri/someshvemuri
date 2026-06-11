'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const experiences = [
  {
    company: 'Ford Motor Company',
    location: 'Chennai, IN',
    role: 'Software Engineer',
    period: 'June 2025 – Present',
    highlights: [
      'End-to-End Delivery: Designed and deployed high-performance Java microservices using Spring Boot on Kubernetes',
      'Data Pipeline: Built event-driven pipeline using Apache Kafka & CDC, streaming 100,000+ events with zero data loss',
      'Performance Excellence: Profiled and optimized services using CPU/heap profiling and JVM tuning',
      'AI Adoption: Spearheaded LLM-powered workflows for code reviews and incident triage',
      'Tech Stack: Java, Spring Boot, Kafka, Redis, AWS, GCP, Kubernetes, Tekton CI/CD',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Experience</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-slate-900 to-emerald-500 rounded-full mb-12" />
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              className="relative pl-8 border-l-2 border-slate-300/80 hover:border-emerald-600 transition-colors duration-300"
              variants={itemVariants}
            >
              {/* Timeline dot */}
              <div className="absolute -left-3.5 top-2 w-5 h-5 bg-white border-2 border-emerald-700 rounded-full" />

              {/* Content */}
              <div className="surface p-6 hover:border-emerald-100 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">{exp.role}</h3>
                  <span className="text-sm font-medium text-slate-500 mt-2 sm:mt-0">{exp.period}</span>
                </div>

                <p className="text-slate-600 font-medium mb-1">
                  {exp.company} • {exp.location}
                </p>

                <ul className="mt-4 space-y-3">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                      <ChevronRight size={20} className="text-slate-900 flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Education */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Education</h3>
          <div className="surface p-6 hover:border-emerald-100 transition-all duration-300">
            <h4 className="text-lg font-semibold text-slate-900">
              Bachelor of Technology in Information Technology
            </h4>
            <p className="text-slate-600 font-medium">
              Sri Sivasubramaniya Nadar College of Engineering, Chennai
            </p>
            <p className="text-slate-500 text-sm mt-2">CGPA: 7.2 | 2017 – 2025</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
