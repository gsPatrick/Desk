// componentsDesk/Hero/AuroraBackground.js

import { motion } from 'framer-motion';

const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Container com o blur que mescla os blobs */}
      <div className="absolute inset-0 backdrop-blur-3xl">
        
        {/* Blob 1 */}
        <motion.div
          className="absolute w-96 h-96 bg-dark-accent/20 dark:bg-dark-accent/30 rounded-full"
          initial={{ x: '-50%', y: '-50%' }}
          animate={{
            x: ['-50%', '50%', '-50%'],
            y: ['-50%', '50%', '-50%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        
        {/* Blob 2 */}
        <motion.div
          className="absolute w-96 h-96 bg-blue-400/20 dark:bg-blue-500/30 rounded-full"
          initial={{ x: '150%', y: '150%' }}
          animate={{
            x: ['50%', '-50%', '50%'],
            y: ['50%', '-50%', '50%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 5,
          }}
        />
      </div>
    </div>
  );
};

export default AuroraBackground;