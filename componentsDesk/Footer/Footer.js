// componentsDesk/Footer/Footer.js

import { motion } from 'framer-motion';
import Link from 'next/link';
// Importando os ícones de marcas da biblioteca react-icons
import { SiGithub, SiLinkedin, SiWhatsapp } from 'react-icons/si';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const socials = [
    { name: 'GitHub', icon: <SiGithub size={20} />, href: 'https://github.com/gsPatrick' },
    { name: 'LinkedIn', icon: <SiLinkedin size={20} />, href: 'https://www.linkedin.com/in/patrick-siqueira-2833a4264/' },
    { name: 'WhatsApp', icon: <SiWhatsapp size={20} />, href: 'https://wa.me/5571982862912' }, // Ex: https://wa.me/5511999998888
  ];

  return (
    <motion.footer
      className="w-full mt-24"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-8">
        {/* Linha separadora */}
        <div className="w-full h-px bg-dark-text/10 dark:bg-dark-subtle/20" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8">
          {/* Lado Esquerdo: Ícones Sociais */}
          <div className="flex items-center gap-x-6">
            {socials.map((social) => (
              <Link key={social.name} href={social.href} passHref legacyBehavior>
                <motion.a
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-light-subtle dark:text-dark-subtle transition-colors hover:text-light-text dark:hover:text-dark-text"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              </Link>
            ))}
          </div>

          {/* Lado Direito: Copyright e CNPJ */}
          <div className="text-center sm:text-right text-sm text-light-subtle dark:text-dark-subtle">
            <p>© {new Date().getFullYear()} Patrick.Developer. Todos os direitos reservados.</p>
            <p className="mt-1 opacity-70">CNPJ: 58.315.507/0001-14</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;