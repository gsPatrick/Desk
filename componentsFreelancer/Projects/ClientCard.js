// componentsFreelancer/Projects/ClientCard.js (NOVO)

import { motion } from 'framer-motion';
import { BuildingOfficeIcon, PencilIcon } from '@heroicons/react/24/solid';

const ClientCard = ({ client, onEdit }) => {
    if (!client) {
        // Renderiza um placeholder ou mensagem se não houver cliente
         return (
             <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex items-center justify-center text-light-subtle dark:text-dark-subtle">
                 <p>Nenhum cliente associado a este projeto.</p>
             </div>
         );
    }

    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <BuildingOfficeIcon className="h-7 w-7 text-blue-500" />
                    <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Cliente</h3>
                </div>
                {/* Botão para Editar Cliente */}
                <button onClick={() => onEdit(client)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-light-subtle dark:text-dark-subtle">
                    <PencilIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Detalhes do Cliente */}
            <div className="space-y-3 text-sm flex-1">
                 <div>
                     <p className="text-light-subtle dark:text-dark-subtle">Nome / Empresa</p>
                     <p className="font-semibold text-light-text dark:text-dark-text">{client.name}</p>
                 </div>
                 {client.contactName && (
                     <div>
                         <p className="text-light-subtle dark:text-dark-subtle">Contato</p>
                         <p className="font-semibold text-light-text dark:text-dark-text">{client.contactName}</p>
                     </div>
                 )}
                 {client.email && (
                     <div>
                         <p className="text-light-subtle dark:text-dark-subtle">Email</p>
                         <p className="font-semibold text-light-text dark:text-dark-text">{client.email}</p>
                     </div>
                 )}
                 {client.phone && (
                     <div>
                         <p className="text-light-subtle dark:text-dark-subtle">Telefone</p>
                         <p className="font-semibold text-light-text dark:text-dark-text">{client.phone}</p>
                     </div>
                 )}
            </div>

             {/* TODO: Adicionar botão "Ver mais detalhes do cliente" */}

        </div>
    );
};

export default ClientCard;