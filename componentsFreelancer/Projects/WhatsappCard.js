// componentsFreelancer/Projects/WhatsappCard.js (NOVO - CHAT SIMULADO)

import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const WhatsappCard = ({ history = [], aiSuggestion, onSendMessage }) => {
    const [messageInput, setMessageInput] = useState('');

    const handleSend = () => {
        if (messageInput.trim() && onSendMessage) {
            onSendMessage(messageInput);
            setMessageInput('');
        }
    };

     // Formatar a hora (exemplo simples)
     const formatTime = (timeString) => {
        try {
            // Assumimos que timeString está em um formato que Date pode parsear ou é apenas a hora
             if (timeString.includes('T')) { // Parece um timestamp completo
                 return new Date(timeString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
             }
            return timeString; // Assume que já é apenas a hora formatada
        } catch (e) {
            return timeString || 'N/A';
        }
     };


    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-7 w-7 text-green-500" />
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Chat WhatsApp</h3>
            </div>

            {/* Área de Histórico de Mensagens (com scroll) */}
             <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 text-sm mb-4"> {/* Scroll interno */}
                {history.length > 0 ? history.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isClient ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg ${msg.isClient ? 'bg-black/5 dark:bg-white/5 text-light-text dark:text-dark-text' : 'bg-blue-600 text-white'}`}>
                             <p>{msg.text}</p>
                             <p className={`mt-1 text-right text-xs ${msg.isClient ? 'text-light-subtle dark:text-dark-subtle' : 'text-white/80'}`}>
                                {formatTime(msg.time)}
                             </p>
                         </div>
                    </div>
                )) : (
                     <p className="text-center text-light-subtle dark:text-dark-subtle">Nenhuma mensagem no histórico.</p>
                 )}
            </div>

            {/* Sugestão de IA */}
             {aiSuggestion && (
                 <div className="p-3 bg-blue-600/10 dark:bg-blue-500/10 rounded-lg mb-4 flex items-start gap-3 flex-shrink-0">
                     <SparklesIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                     <div>
                         <p className="text-sm font-semibold text-blue-500">Sugestão da IA:</p>
                         <p className="text-sm text-light-text dark:text-dark-text mt-1">{aiSuggestion}</p>
                     </div>
                 </div>
             )}


            {/* Input e Botão de Enviar */}
            <div className="flex gap-3 flex-shrink-0">
                 <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                 />
                 <button
                     onClick={handleSend}
                     disabled={!messageInput.trim()}
                     className="p-2 rounded-md bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     <PaperAirplaneIcon className="h-5 w-5" />
                 </button>
            </div>

        </div>
    );
};
export default WhatsappCard;