// componentsFinance/Dock/DockItem.js
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DockItem = ({ children, label, onClick }) => {
  const mouseX = useMotionValue(Infinity);

  const scale = useTransform(mouseX, [-150, 0, 150], [1, 1.5, 1]);
  const scaleSpring = useSpring(scale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={(e) => mouseX.set(e.nativeEvent.offsetX - 28)} // 28 é metade da largura do ícone (56px)
      onMouseLeave={() => mouseX.set(Infinity)}
      style={{ scale: scaleSpring }}
      className="relative group w-14 h-14 flex items-center justify-center cursor-pointer"
    >
      {children}
      <span className="absolute -top-8 whitespace-nowrap text-xs text-white bg-black/70 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </span>
    </motion.div>
  );
};
export default DockItem;