// componentsFinance/Shared/DockSettingsModal.js

import { motion, AnimatePresence } from 'framer-motion';
import { 
    XMarkIcon, 
    Square3Stack3DIcon, 
    RectangleGroupIcon, 
    ArrowsPointingOutIcon,
    EyeIcon, 
    EyeSlashIcon, 
    ArrowsUpDownIcon, 
    PlusIcon, 
    MinusIcon,
    Cog6ToothIcon, // Para o preview
    PlusCircleIcon, 
    CreditCardIcon, 
    CalendarDaysIcon, 
    BeakerIcon,
    ArrowPathIcon, 
    RectangleStackIcon, 
    ClipboardDocumentIcon
} from '@heroicons/react/24/solid';

// Mapeamento de nomes de ícones para componentes reais, usado no PREVIEW
const ICON_MAP_PREVIEW = {
  PlusCircleIcon, CreditCardIcon, CalendarDaysIcon, BeakerIcon, Cog6ToothIcon,
  ArrowPathIcon, RectangleStackIcon, ClipboardDocumentIcon
};

// --- COMPONENTE INTERNO: Miniatura da Dock para o Preview ---
const DockPreview = ({ items, layoutStyle, hasBackground }) => {
    const dockStyles = {
        default: "h-14 px-3 space-x-1 rounded-full text-xs", // Ajustado para ícones menores
        compact: "h-12 px-2 space-x-0 rounded-xl text-xs",
        expanded: "h-14 px-4 space-x-2 rounded-xl w-full text-xs",
    };

    return (
        <div className={`flex items-center justify-center mx-auto my-4 border border-white/10
            ${dockStyles[layoutStyle]} 
            ${hasBackground ? 'bg-black/50 backdrop-blur-md' : ''}`}
        >
            {items.map(item => {
                const Icon = ICON_MAP_PREVIEW[item.iconName];
                return Icon ? <Icon key={item.id} className={`h-5 w-5 ${item.iconColor} mx-0.5`} /> : null;
            })}
            {/* Ícone de configurações sempre no preview */}
            <Cog6ToothIcon className="h-5 w-5 text-gray-400 mx-0.5" />
        </div>
    );
};

// --- COMPONENTE PRINCIPAL: Modal de Configurações da Dock ---
const DockSettingsModal = ({ 
    isOpen, 
    onClose, 
    currentLayout, 
    onLayoutChange,
    currentItems = [], // Adicionado valor padrão para evitar erro se undefined
    availableItems = [], // Adicionado valor padrão
    onAddItem,
    onRemoveItem,
    onMoveItem,
    hasBackground,
    onToggleBackground
}) => {

    return (
    <AnimatePresence>
      {isOpen && (
         <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" 
            onClick={onClose}
          >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 35 } }} 
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
            className="w-full max-w-2xl bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl text-white flex flex-col max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <h2 className="text-xl font-bold">Personalizar Barra de Atalhos</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <XMarkIcon className="h-6 w-6"/>
              </button>
            </div>
            
            {/* Preview da Dock */}
            <div className="p-4 border-b border-white/10 flex-shrink-0">
                <DockPreview items={currentItems} layoutStyle={currentLayout} hasBackground={hasBackground} />
            </div>

            {/* Conteúdo principal com scroll */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 overflow-hidden">
                {/* Coluna 1: Gerenciar Atalhos */}
                <div className="bg-black/40 p-6 space-y-4 overflow-y-auto">
                    <h3 className="font-semibold text-white/90">Atalhos Ativos</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2"> {/* Scroll interno */}
                        {currentItems.length > 0 ? currentItems.map((item, index) => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                                <span className="text-sm">{item.label}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => onMoveItem(index, 'up')} disabled={index === 0} className="p-1 disabled:opacity-30 hover:text-blue-400"><ArrowsUpDownIcon className="h-4 w-4 rotate-180"/></button>
                                    <button onClick={() => onMoveItem(index, 'down')} disabled={index === currentItems.length - 1} className="p-1 disabled:opacity-30 hover:text-blue-400"><ArrowsUpDownIcon className="h-4 w-4"/></button>
                                    <button onClick={() => onRemoveItem(item.id)} className="p-1 text-red-400 hover:text-red-300"><MinusIcon className="h-4 w-4"/></button>
                                </div>
                            </div>
                        )) : <p className="text-sm text-white/50 text-center py-4">Nenhum atalho ativo.</p>}
                    </div>
                    
                    <h3 className="font-semibold pt-4 border-t border-white/10 text-white/90">Atalhos Disponíveis</h3>
                     <div className="space-y-2 max-h-40 overflow-y-auto pr-2"> {/* Scroll interno */}
                        {availableItems.length > 0 ? availableItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                                <span className="text-sm">{item.label}</span>
                                <button onClick={() => onAddItem(item.id)} className="p-1 text-green-400 hover:text-green-300"><PlusIcon className="h-4 w-4"/></button>
                            </div>
                        )) : <p className="text-sm text-white/50 text-center py-4">Nenhum atalho disponível.</p>}
                    </div>
                </div>

                {/* Coluna 2: Estilo da Dock */}
                <div className="bg-black/40 p-6 space-y-6 overflow-y-auto">
                    <div>
                        <h3 className="text-sm font-semibold text-white/70 mb-2">Estilo Visual</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Padrão', value: 'default', icon: <Square3Stack3DIcon className="h-5 w-5 mr-2"/> },
                                { label: 'Compacta', value: 'compact', icon: <RectangleGroupIcon className="h-5 w-5 mr-2"/> },
                                { label: 'Expandida', value: 'expanded', icon: <ArrowsPointingOutIcon className="h-5 w-5 mr-2"/> }
                            ].map(layout => (
                                <button 
                                  key={layout.value} 
                                  onClick={() => onLayoutChange(layout.value)} 
                                  className={`p-2 text-xs rounded-lg border-2 flex flex-col items-center justify-center h-20 transition-all
                                    ${currentLayout === layout.value ? 'border-blue-500 bg-blue-500/20 text-white' : 'border-white/10 hover:bg-white/5 text-white/70'}`}
                                >
                                    {layout.icon}
                                    {layout.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white/70 mb-2">Fundo da Barra</h3>
                         <button 
                            onClick={onToggleBackground} 
                            className="w-full p-3 flex items-center justify-between bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors"
                         >
                            <span>Fundo Translúcido</span>
                            {hasBackground ? <EyeIcon className="h-5 w-5 text-green-400"/> : <EyeSlashIcon className="h-5 w-5 text-red-400"/>}
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default DockSettingsModal;