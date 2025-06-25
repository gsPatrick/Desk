// componentsFinance/Dock/FinanceDock.js

import { motion } from 'framer-motion';
import DockItem from './DockItem'; // Componente para cada ícone animado da Dock
import {
  PlusCircleIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  BeakerIcon,
  Cog6ToothIcon, // Ícone para as configurações da própria Dock
  ArrowPathIcon,    // Ícone para 'Nova Recorrência'
  RectangleStackIcon, // Ícone para 'Ver Cartões' (exemplo, pode mudar)
  ClipboardDocumentIcon // Ícone para 'Nota Rápida' (exemplo, pode mudar)
} from '@heroicons/react/24/solid'; // Usando a variante 'solid' para um visual mais preenchido

// Mapeamento de nomes de string (vindos dos dados) para os componentes de ícone reais.
// Isso permite que a lista de itens da Dock seja configurável via dados.
const ICON_MAP = {
  PlusCircleIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  BeakerIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  RectangleStackIcon,
  ClipboardDocumentIcon
};

const FinanceDock = ({ 
  onIconClick, // Função chamada quando um ícone é clicado
  layoutStyle = 'default', // Estilo visual da Dock ('default', 'compact', 'expanded')
  items = [], // Array de objetos representando os atalhos a serem exibidos
  hasBackground = true // Booleano para controlar o fundo translúcido
}) => {
  
  // Define as classes CSS para cada estilo de layout da Dock
  const dockLayoutStyles = {
    default: "h-20 px-4 space-x-1 rounded-full",       // Estilo padrão, mais espaçado
    compact: "h-16 px-3 space-x-0 rounded-2xl",      // Mais compacto, menos espaço entre ícones
    expanded: "h-20 px-6 space-x-3 rounded-2xl w-[90%] max-w-lg", // Mais largo, para Docks com muitos itens
  };

  return (
    <motion.div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} // Animação de entrada da Dock
    >
      <div 
        className={`
          flex items-center justify-center 
          border shadow-2xl shadow-black/20 
          ${dockLayoutStyles[layoutStyle] || dockLayoutStyles['default']} 
          ${hasBackground 
            ? 'bg-black/50 backdrop-blur-xl border-white/10' // Estilo com fundo (glassmorphism)
            : 'border-transparent' // Estilo sem fundo (apenas ícones)
          }
        `}
      >
        {/* Mapeia os itens da Dock passados por prop */}
        {items.map((action) => {
          // Pega o componente de ícone correspondente ao nome do ícone no objeto 'action'
          const IconComponent = ICON_MAP[action.iconName];
          
          // Renderiza o DockItem apenas se o componente de ícone existir
          return IconComponent ? (
            <DockItem 
              key={action.id} 
              label={action.label} 
              onClick={() => onIconClick(action.id)}
            >
              <IconComponent className={`h-9 w-9 ${action.iconColor || 'text-white'}`} />
            </DockItem>
          ) : null; // Retorna null se o ícone não for encontrado no ICON_MAP
        })}

        {/* Adiciona um separador visual se houver itens e a dock não for compacta */}
        {items.length > 0 && layoutStyle !== 'compact' && (
            <div className="h-8 w-px bg-white/20 dark:bg-white/10 mx-1" />
        )}

        {/* Ícone de Configurações da Dock - sempre presente */}
        <DockItem 
          label="Configurar Dock" 
          onClick={() => onIconClick('dock-settings')}
        >
          <Cog6ToothIcon className="h-9 w-9 text-gray-300" />
        </DockItem>
      </div>
    </motion.div>
  );
};

export default FinanceDock;