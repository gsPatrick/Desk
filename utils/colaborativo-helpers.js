// Este objeto mapeia os valores do backend para informações amigáveis do front-end
export const STATUS_MAP = {
  in_progress: { label: 'Em Andamento', className: 'statusInProgress' },
  completed: { label: 'Concluído', className: 'statusCompleted' },
  paused: { label: 'Pausado', className: 'statusPaused' },
  draft: { label: 'Rascunho', className: 'statusDraft' }, // Adicionando Rascunho se houver
  archived: { label: 'Arquivado', className: 'statusArchived' },
};

// Uma função para obter os dados do status de forma segura
export const getStatusInfo = (statusValue) => {
  return STATUS_MAP[statusValue] || { label: statusValue, className: '' };
};

// Uma função para obter os dados da prioridade de forma segura
// Ela busca na lista de prioridades que virá da API
export const getPriorityInfo = (priorityId, priorities = []) => {
    const priority = priorities.find(p => p.id === priorityId);
    if (!priority) return { name: 'Não definida', color: '#6b7280' };

    // Mapeia o nome da prioridade para as classes de estilo
    switch (priority.name.toLowerCase()) {
        case 'alta': return { ...priority, className: 'priorityHigh', textClass: 'priorityHighText' };
        case 'média': return { ...priority, className: 'priorityMedium', textClass: 'priorityMediumText' };
        case 'baixa': return { ...priority, className: 'priorityLow', textClass: 'priorityLowText' };
        default: return { ...priority, className: 'priorityLow', textClass: 'priorityLowText' };
    }
};