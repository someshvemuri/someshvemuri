'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Sample CDC Pipeline',
    subtitle: 'Change Data Capture with Event Streaming',
    link: 'https://github.com/someshvemuri/sample-cdc',
    points: [
      'Built an end-to-end CDC flow to capture source DB changes and publish events for downstream consumers.',
      'Implemented reliable event processing patterns for idempotency, ordering awareness, and failure recovery.',
      'Structured the project for easy local setup and extensibility to additional tables/topics and environments.',
    ],
    stack: 'Java, Kafka, CDC concepts, Event-Driven Architecture',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-slate-900 to-sky-500 rounded-full mb-12" />
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, idx) => (
            <motion.article
              key={idx}
              className="surface p-6 sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <h3 className="text-2xl font-bold text-slate-900">{project.title}</h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  <Github size={16} />
                  View Repository
                  <ExternalLink size={16} />
                </a>
              </div>

              <p className="text-slate-600 mb-4">{project.subtitle}</p>

              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {project.points.map((point, pointIdx) => (
                  <li key={pointIdx}>{point}</li>
                ))}
              </ul>

              <p className="mt-5 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Tech:</span> {project.stack}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
