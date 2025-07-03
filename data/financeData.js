// data/financeData.js (ADICIONANDO CATEGORIAS)

import { SiVisa, SiMastercard } from 'react-icons/si';
import { ChartPieIcon, CreditCardIcon, CalendarDaysIcon, DocumentChartBarIcon, PlusIcon, SunIcon, MoonIcon, BeakerIcon, ClipboardDocumentListIcon, Cog8ToothIcon, ArrowsRightLeftIcon, TagIcon, ShoppingCartIcon, FireIcon, CodeBracketIcon, CurrencyDollarIcon as CurrencyDollarIconSolid } from '@heroicons/react/24/solid';


export const creditCards = [
  {
    id: 'card1',
    name: 'Cartão Principal',
    final: '4242',
    brand: 'Visa',
    icon: SiVisa,
    color: 'from-blue-900 to-gray-900', // Cor do gradiente do cartão
    limit: 5000,
    closingDay: 28, // Dia do fechamento da fatura
    dueDay: 10, // Dia do vencimento
  },
  {
    id: 'card2',
    name: 'Cartão da Empresa',
    final: '8018',
    brand: 'Mastercard',
    icon: SiMastercard,
    color: 'from-gray-700 to-gray-800',
    limit: 8000,
    closingDay: 5,
    dueDay: 15,
  },
    {
    id: 'card3',
    name: 'Cartão da Empresa',
    final: '8018',
    brand: 'Mastercard',
    icon: SiMastercard,
    color: 'from-gray-700 to-gray-800',
    limit: 8000,
    closingDay: 5,
    dueDay: 15,
  },
    {
    id: 'card4',
    name: 'Cartão da Empresa',
    final: '8018',
    brand: 'Mastercard',
    icon: SiMastercard,
    color: 'from-gray-700 to-gray-800',
    limit: 8000,
    closingDay: 5,
    dueDay: 15,
  },
];

export const invoices = [
  {
    id: 'inv1', cardId: 'card1', month: 'Junho', year: 2024, total: 1874.50,
    transactions: [
      { id: 't1', date: '20/06', description: 'Assinatura Adobe', category: 'Software', amount: 129.90 },
      { id: 't2', date: '18/06', description: 'Almoço com cliente', category: 'Alimentação', amount: 85.50 },
      { id: 't3', date: '15/06', description: 'Uber Viagens', category: 'Transporte', amount: 45.30 },
      { id: 't4', date: '12/06', description: 'Compra Online - Amazon', category: 'Compras', amount: 350.00 },
        { id: 't5', date: '15/06', description: 'Uber Viagens', category: 'Transporte', amount: 45.30 },
      { id: 't6', date: '12/06', description: 'Compra Online - Amazon', category: 'Compras', amount: 350.00 },
        { id: 't7', date: '15/06', description: 'Uber Viagens', category: 'Transporte', amount: 45.30 },
      { id: 't8', date: '12/06', description: 'Compra Online - Amazon', category: 'Compras', amount: 350.00 },
    ]
  },
  {
    id: 'inv2', cardId: 'card1', month: 'Maio', year: 2024, total: 2450.00,
    transactions: [/* ... */]
  },
  {
    id: 'inv3', cardId: 'card2', month: 'Junho', year: 2024, total: 950.00,
    transactions: [
      { id: 't6', date: '19/06', description: 'Hospedagem Vercel', category: 'Software', amount: 105.00 },
    ]
  }
];

export const transactionsLog = [
  // Transações Realizadas (Não recorrentes)
  { id: 'txlog1', date: '2024-06-25', description: 'Pagamento Projeto Y', type: 'receita', status: 'Efetivado', amount: 8500.00, category: 'Projeto', forecast: false, recurring: false },
  { id: 'txlog4', date: '2024-06-20', description: 'Compra de Equipamento', type: 'despesa', status: 'Efetivado', amount: 1250.00, category: 'Equipamento', forecast: false, recurring: false },
  { id: 'txlog5', date: '2024-06-18', description: 'Consultoria Avulsa', type: 'receita', status: 'Efetivado', amount: 950.00, category: 'Consultoria', forecast: false, recurring: false },
   { id: 'txlog11', date: '2024-06-22', description: 'Marketing Campanha X', type: 'despesa', status: 'Efetivado', amount: 400.00, category: 'Marketing', forecast: false, recurring: false }, // Nova transação

  // Transações Futuras (Podem ser recorrentes ou não)
  { id: 'txlog3', date: '2024-07-05', description: 'Pagamento Esperado Cliente Z', type: 'receita', status: 'Pendente', amount: 3000.00, category: 'Adiantamento', forecast: true, recurring: false },

  // Transações RECORRENTES (Marcadas com recurring: true e campos de recorrência)
  { id: 'txlog6', date: '2024-07-10', description: 'Renovação Domínio e Hospedagem', type: 'despesa', status: 'Agendado', amount: 250.00, category: 'Serviços', forecast: true, recurring: true, frequency: 'Anual', startDate: '2024-07-10' },
  { id: 'txlog7', date: '2024-07-01', description: 'Mensalidade Cliente A', type: 'receita', status: 'Agendado', amount: 2000.00, category: 'Mensalidade Cliente', forecast: true, recurring: true, frequency: 'Mensal', startDate: '2024-07-01' },
  { id: 'txlog8', date: '2024-07-24', description: 'Assinatura Figma', type: 'despesa', status: 'Agendado', amount: 80.00, category: 'Software', forecast: true, recurring: true, frequency: 'Mensal', startDate: '2024-06-24' },
  { id: 'txlog9', date: '2024-07-01', description: 'Aluguel Escritório', type: 'despesa', status: 'Agendado', amount: 1500.00, category: 'Despesa Fixa', forecast: true, recurring: true, frequency: 'Mensal', startDate: '2024-07-01' },
  { id: 'txlog10', date: '2024-08-15', description: 'Licença Anual Ferramenta XYZ', type: 'despesa', status: 'Agendado', amount: 500.00, category: 'Software', forecast: true, recurring: true, frequency: 'Anual', startDate: '2024-08-15' },
];

export const eventTypes = {
  RECEITA: 'Receita',
  DESPESA: 'Despesa',
  RECEITA_FUTURA: 'Receita Futura',
  DESPESA_FUTURA: 'Despesa Futura',
  RECORRENCIA: 'Recorrência',
  PROJETO: 'Projeto',
  REUNIAO: 'Reunião',
  SPRINT: 'Sprint',
};

export const calendarEvents = [
  { id: 'event1', title: 'Pagamento Proj. Y', start: '2024-06-25', extendedProps: { type: eventTypes.RECEITA } },
  { id: 'event2', title: 'Reunião Cliente Z', start: '2024-06-28T10:30:00', extendedProps: { type: eventTypes.REUNIAO } },
  { id: 'event3', title: 'Venc. Fatura', start: '2024-07-10', extendedProps: { type: eventTypes.DESPESA_FUTURA } },
  { id: 'event4', title: 'Início Sprint #3', start: '2024-07-01', end: '2024-07-15', extendedProps: { type: eventTypes.SPRINT } },
  // Adicionar eventos para as novas recorrencias se desejar que apareçam no calendário
   { id: 'event5', title: 'Mens. Cliente A', start: '2024-07-01', extendedProps: { type: eventTypes.RECORRENCIA, amount: 2000 } },
   { id: 'event6', title: 'Aluguel Escritório', start: '2024-07-01', extendedProps: { type: eventTypes.RECORRENCIA, amount: 1500 } },
    { id: 'event7', title: 'Renovação Domínio', start: '2024-07-10', extendedProps: { type: eventTypes.RECORRENCIA, amount: 250 } },
     { id: 'event8', title: 'Ass. Figma', start: '2024-07-24', extendedProps: { type: eventTypes.RECORRENCIA, amount: 80 } },
];


export const investments = [
  // Ações
  { id: 'inv1', asset: 'ITSA4', name: 'Itaúsa', type: 'Ações', quantity: 300, avgPrice: 9.80, currentPrice: 10.15, dailyChange: 1.2, history: [10.05, 10.10, 10.00, 10.12, 10.18, 10.14, 10.15] },
  { id: 'inv2', asset: 'MGLU3', name: 'Magazine Luiza', type: 'Ações', quantity: 500, avgPrice: 13.50, currentPrice: 12.80, dailyChange: -2.5, history: [13.10, 13.00, 12.90, 12.95, 12.85, 12.75, 12.80] },

  // Criptomoedas
  { id: 'inv3', asset: 'BTC', name: 'Bitcoin', type: 'Cripto', quantity: 0.05, avgPrice: 300000, currentPrice: 350000, dailyChange: 5.8, history: [340000, 345000, 342000, 348000, 352000, 349000, 350000] },
  { id: 'inv4', asset: 'ETH', name: 'Ethereum', type: 'Cripto', quantity: 1.2, avgPrice: 15000, currentPrice: 18500, dailyChange: 8.1, history: [17500, 17800, 18000, 18200, 18600, 18400, 18500] },

  // Renda Fixa
  { id: 'inv5', asset: 'Tesouro Selic 2029', name: 'Tesouro Direto', type: 'Renda Fixa', quantity: 1, avgPrice: 14000, currentPrice: 14250.30, dailyChange: 0.04, history: [14240, 14242, 14245, 14248, 14249, 14250, 14250.30] },

  // Ativo Customizado pelo Usuário
  { id: 'inv6', asset: 'Imóvel SP', name: 'Apartamento Av. Paulista', type: 'Custom', quantity: 1, avgPrice: 800000, currentPrice: 850000, dailyChange: 0, history: [850000, 850000, 850000, 850000, 850000, 850000, 850000] },
];

// NOVO: Lista de categorias
export const categories = [
    { id: 'cat1', name: 'Projeto', color: '#3b82f6', icon: CodeBracketIcon }, // blue-500
    { id: 'cat2', name: 'Software', color: '#8b5cf6', icon: Cog8ToothIcon }, // violet-500
    { id: 'cat3', name: 'Serviços', color: '#06b6d4', icon: CurrencyDollarIconSolid }, // cyan-500
    { id: 'cat4', name: 'Equipamento', color: '#f97316', icon: ShoppingCartIcon }, // orange-500
    { id: 'cat5', name: 'Consultoria', color: '#a7cc1a', icon: ClipboardDocumentListIcon }, // finance-lime
    { id: 'cat6', name: 'Mensalidade Cliente', color: '#f6339a', icon: ChartPieIcon }, // finance-pink
    { id: 'cat7', name: 'Despesa Fixa', color: '#ef4444', icon: FireIcon }, // red-500
    { id: 'cat8', name: 'Marketing', color: '#eab308', icon: TagIcon }, // yellow-500
     { id: 'cat9', name: 'Adiantamento', color: '#14b8a6', icon: CurrencyDollarIconSolid }, // teal-500
    // Adicione outras categorias
];