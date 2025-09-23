// data/myagencyData.js

export const mockUser = {
  id: 1,
  name: 'Patrick Siqueira',
  email: 'patrick.developer@email.com',
  label: 'agency', // 'dev' ou 'agency'
};

export const mockClients = [
  { id: 101, name: 'Empresa Alpha', contactName: 'Carlos Silva', ownerId: 1 },
  { id: 102, name: 'Startup Beta', contactName: 'Ana Souza', ownerId: 1 },
  { id: 103, name: 'Projeto Gama', contactName: 'Mariana Costa', ownerId: 2 }, // Cliente compartilhado
];

export const mockProjects = [
  { 
    id: 201, 
    name: 'Website Corporativo Alpha',
    description: 'Desenvolvimento do novo site institucional da Empresa Alpha com foco em SEO e performance.',
    status: 'Em Andamento', 
    clientId: 101, 
    ownerId: 1,
    deadline: '2025-10-15',
    budget: 5000.00,
    platform: 'Venda Direta',
    platformCommission: 0,
    partnerCommission: 0,
  },
  { 
    id: 202, 
    name: 'App Mobile Beta',
    description: 'Criação do aplicativo para iOS e Android para a Startup Beta.',
    status: 'Concluído', 
    clientId: 102, 
    ownerId: 1,
    deadline: '2025-08-20',
    budget: 8500.00,
    platform: '99Freelas',
    platformCommission: 1700.00, // 20%
    partnerCommission: 0,
  },
  { 
    id: 203, 
    name: 'Dashboard Interno Gama',
    description: 'Projeto colaborativo para desenvolvimento de um painel de BI.',
    status: 'Em Andamento', 
    clientId: 103, 
    ownerId: 2,
    deadline: '2025-12-01',
    budget: 12000.00,
    platform: 'Workana',
    platformCommission: 2400.00, // 20%
    partnerCommission: 3600.00, // 30% para o parceiro
    sharedWith: [{ userId: 1, commission: 30, type: 'percentage' }]
  },
  { 
    id: 204, 
    name: 'Landing Page Evento', 
    description: 'Página de captura para o evento anual da Empresa Alpha.',
    status: 'Pausado', 
    clientId: 101, 
    ownerId: 1,
    deadline: '2025-09-05',
    budget: 1500.00,
    platform: 'Venda Direta',
    platformCommission: 0,
    partnerCommission: 0,
  },
];

export const mockCollaborators = [
  {
    id: 301,
    name: 'Freelancer Dev Jr.',
    email: 'dev.jr@example.com',
    status: 'pending', // -> Alguém te enviou um convite, você precisa aceitar/recusar
    direction: 'received', // -> 'received' ou 'sent'
  },
  {
    id: 302,
    name: 'Agência Criativa XYZ',
    email: 'contato@agencia.xyz',
    status: 'accepted',
    direction: 'sent',
  },
  {
    id: 303,
    name: 'Designer UI/UX',
    email: 'designer@example.com',
    status: 'pending',
    direction: 'sent', // -> Você enviou um convite, está aguardando
  },
  {
    id: 304,
    name: 'Redator Pro',
    email: 'redator@example.com',
    status: 'accepted',
    direction: 'received',
  }
];