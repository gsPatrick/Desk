'use client';

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import clsx from 'clsx';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsub();
  }, [scrollY]);

  const navItems = [
    { label: 'Projetos', href: '#work' },
    { label: 'Contato', href: '#contact' },
  ];

  const handleScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);

    if (elem) {
      // Trigger global blur event (will be handled by a global listener or simple CSS transition)
      document.body.classList.add('is-blurring');

      const targetPos = elem.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });

      // Remove blur after scroll (heuristic time)
      setTimeout(() => {
        document.body.classList.remove('is-blurring');
      }, 800);
    }
  };

  const whatsappUrl = "https://wa.me/5571982862912?text=Olá Patrick, gostaria de conversar sobre um projeto!";

  return (
    <motion.header
      className={clsx(styles.header, isScrolled && styles.scrolled)}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.logoContainer}>
        <motion.div
          className={styles.logo}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Patrick.Developer
        </motion.div>
      </div>

      <div className={styles.navActions}>
        <nav className={styles.nav}>
          {navItems.map((item, index) => (
            <div key={item.label} className={styles.linkContainer}>
              <motion.a
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className={styles.link}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {item.label}
              </motion.a>
              <div className={styles.activeIndicator} />
            </div>
          ))}
        </nav>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappCta}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Falar no WhatsApp
        </motion.a>
      </div>
    </motion.header>
  );
}
