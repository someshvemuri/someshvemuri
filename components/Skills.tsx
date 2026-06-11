'use client';

import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Java 8+', 'JavaScript', 'Node.js', 'TypeScript'],
  },
  {
    title: 'Frameworks',
    skills: ['Spring Boot', 'REST APIs', 'Microservices', 'React'],
  },
  {
    title: 'Messaging & Data',
    skills: ['Apache Kafka', 'Google Pub/Sub', 'AWS SQS', 'MongoDB', 'PostgreSQL'],
  },
  {
    title: 'Cloud',
    skills: ['AWS EC2/S3/RDS/SQS', 'GCP Cloud Run', 'Pub/Sub', 'Firestore'],
  },
  {
    title: 'DevOps & Infrastructure',
    skills: ['Kubernetes', 'Docker', 'Tekton CI/CD', 'Monitoring & Alerting'],
  },
  {
    title: 'Java Internals & Performance',
    skills: ['JVM Tuning', 'GC Optimization', 'Concurrency', 'Profiling'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-slate-900 to-sky-500 rounded-full mb-12" />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              className="surface p-6 hover:border-sky-100 hover:shadow-xl transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm font-medium bg-slate-100/80 text-slate-700 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
