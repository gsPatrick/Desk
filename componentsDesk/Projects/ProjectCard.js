// componentsDesk/Projects/ProjectCard.js (VERSÃO FINAL LIMPA)

import Image from 'next/image';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, setSelectedId }) => {
  return (
    <motion.div
      layoutId={project.id}
      onClick={() => setSelectedId(project.id)}
      className="group relative w-80 md:w-96 h-[450px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-lg shadow-black/30"
      whileHover={{ scale: 1.03, y: -8, transition: { duration: 0.3 } }}
    >
      <Image
        src={project.image}
        alt={project.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.h3 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            {project.title}
        </motion.h3>
        <motion.p 
            className="text-gray-300 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {project.shortDescription}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 