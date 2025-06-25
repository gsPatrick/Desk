// componentsFinance/Hero/FinanceHero.js

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const FinanceHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6 sm:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Coluna de Texto */}
          <div className="text-center md:text-left">
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none"
            >
              <span className="text-finance-cream">Organização</span>
              <br />
              <span className="text-finance-pink">financeira.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-md mx-auto md:mx-0 text-lg text-finance-cream/70 leading-relaxed"
            >
              Assuma o controle total das suas finanças de freelancer com uma ferramenta que combina poder e design. Rastreie ganhos, despesas e projete seu futuro.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10">
              <Link href="#" passHref legacyBehavior>
                <motion.a
                  className="inline-flex items-center gap-x-3 px-8 py-4 text-base font-semibold bg-finance-pink text-finance-cream rounded-full shadow-lg shadow-finance-pink/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(246, 51, 154, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Novidades em breve
                  <ArrowRightIcon className="h-5 w-5" />
                </motion.a>
              </Link>
            </motion.div>
          </div>

          {/* Coluna da Imagem */}
          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-sm mx-auto md:max-w-none h-80 md:h-96"
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 8,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror'
              }}
            >
              <Image
                src="/images/finance-illustration.png" // Use sua imagem aqui
                alt="Ilustração de organização financeira"
                layout="fill"
                objectFit="contain"
                priority
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
};

export default FinanceHero;