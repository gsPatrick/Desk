// data/freelancerData.js (AJUSTADO PARA PASTAS E TAREFAS)

import { SiVisa, SiMastercard, SiGithub } from 'react-icons/si'; // Mantendo SiGithub aqui por organização

// Dados placeholder para Clientes
export const clients = [
    { id: 'client-1', name: 'Empresa Alpha', contactName: 'Carlos Silva', email: 'carlos.s@alpha.com', phone: '11 98765-4321' },
    { id: 'client-2', name: 'Beta Software', contactName: 'Ana Costa', email: 'ana.c@beta.net', phone: '21 99887-6655' },
    { id: 'client-3', name: 'Consultoria Gama', contactName: 'Fernando Lima', email: 'fernando.l@gama.org', phone: '31 97654-3210' },
];

// Dados placeholder para Pastas de Projetos
export const folders = [
    { id: 'folder-all', name: 'Todos os Projetos' }, // Pasta virtual para mostrar todos
    { id: 'folder-1', name: 'Empresa Alpha' },
    { id: 'folder-2', name: 'Beta Software' },
    { id: 'folder-3', name: 'Projetos Internos' },
];


// Dados placeholder para Projetos (agora com folderId e array de tasks)
export const projects = [
    {
        id: 'project-1',
        name: 'Website Institucional Alpha',
        description: 'Desenvolvimento completo de um novo site para a Empresa Alpha.',
        githubUrl: 'https://github.com/seuusuario/website-alpha',
        githubBranch: 'main',
        clientId: 'client-1', // Link para Empresa Alpha
        status: 'Em Andamento',
        startDate: '2024-06-01',
        folderId: 'folder-1', // Associado à pasta Empresa Alpha
        tasks: [ // Tarefas para este projeto
            { id: 'task-1a', description: 'Implementar página inicial', status: 'completed', dueDate: '2024-06-15' },
            { id: 'task-1b', description: 'Desenvolver formulário de contato', status: 'pending', dueDate: '2024-07-30' },
            { id: 'task-1c', description: 'Revisar SEO da página Sobre Nós', status: 'pending', dueDate: '2024-08-10' },
        ],
        // Simulação de dados do WhatsApp
        whatsappHistory: [
            { id: 'msg1', text: 'Olá, como está o andamento do site?', time: '10:30', isClient: true },
            { id: 'msg2', text: 'Tudo bem! Acabamos de implementar a página inicial. Em breve enviarei um relatório.', time: '10:35', isClient: false },
            { id: 'msg3', text: 'Ótimo! Ficamos ansiosos para ver.', time: '10:40', isClient: true },
        ],
        whatsappAISuggestion: 'Sugerir envio do último relatório gerado sobre a página inicial.',
    },
    {
        id: 'project-2',
        name: 'App Mobile Beta - Feature Pedidos',
        description: 'Desenvolvimento da feature de gerenciamento de pedidos no app.',
        githubUrl: 'https://github.com/seuusuario/app-mobile-beta',
        githubBranch: 'dev',
        clientId: 'client-2', // Link para Beta Software
        status: 'Pausado',
        startDate: '2023-11-15',
        folderId: 'folder-2', // Associado à pasta Beta Software
        tasks: [
            { id: 'task-2a', description: 'Definir escopo da feature', status: 'completed', dueDate: '2023-11-20' },
             { id: 'task-2b', description: 'Implementar login (back-end)', status: 'pending', dueDate: '2024-08-05' },
        ],
         whatsappHistory: [
            { id: 'msg4', text: 'Podemos retomar o projeto? Precisamos da feature de pedidos.', time: '15:00', isClient: true },
            { id: 'msg5', text: 'Claro! Podemos agendar uma call para revisar o escopo e prazos?', time: '15:05', isClient: false },
        ],
        whatsappAISuggestion: 'Sugerir agendamento de reunião para discutir o cronograma da feature de pedidos.',
    },
     {
        id: 'project-3',
        name: 'Sistema Interno Gama - Dashboard',
        description: 'Criação do dashboard administrativo do sistema.',
        githubUrl: 'https://github.com/seuusuario/sistema-interno-gama',
        githubBranch: 'staging',
        clientId: 'client-3', // Link para Consultoria Gama
        status: 'Em Andamento',
        startDate: '2024-04-20',
        folderId: 'folder-1', // Associado à pasta Empresa Alpha (Exemplo: Um cliente pode ter projetos em várias pastas)
        tasks: [
            { id: 'task-3a', description: 'Prototipar dashboard', status: 'completed', dueDate: '2024-04-30' },
            { id: 'task-3b', description: 'Desenvolver integração com API', status: 'pending', dueDate: '2024-07-28' },
            { id: 'task-3c', description: 'Testes de usabilidade', status: 'pending', dueDate: '2024-08-20' },
             { id: 'task-3d', description: 'Deploy para staging', status: 'pending', dueDate: '2024-09-01' },
        ],
         whatsappHistory: [
            { id: 'msg6', text: 'Conseguimos testar o dashboard na staging?', time: '09:00', isClient: true },
            { id: 'msg7', text: 'Ainda não, estamos finalizando a integração da API. Acredito que até o fim da semana estará pronto!', time: '09:05', isClient: false },
        ],
        whatsappAISuggestion: 'Informar que a API foi integrada e a versão de staging está disponível para testes.',
    },
     {
        id: 'project-4',
        name: 'Otimização de Performance Site Interno',
        description: 'Projeto interno para melhorar a performance do site pessoal.',
        githubUrl: 'https://github.com/seuusuario/meu-site-pessoal',
        githubBranch: 'main',
        clientId: null, // Nenhum cliente associado (projeto interno)
        status: 'Em Andamento',
        startDate: '2024-07-01',
        folderId: 'folder-3', // Associado à pasta Projetos Internos
        tasks: [
            { id: 'task-4a', description: 'Análise de performance atual', status: 'completed', dueDate: '2024-07-05' },
            { id: 'task-4b', description: 'Implementar lazy loading de imagens', status: 'pending', dueDate: '2024-07-31' },
        ],
        whatsappHistory: [], // Sem histórico de WhatsApp
        whatsappAISuggestion: null,
    },
];