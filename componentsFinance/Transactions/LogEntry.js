// componentsFinance/Transactions/LogEntry.js (CORRIGIDO: Renderizando propriedade da categoria)

import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';

const StatusBadge = ({ status }) => {
    // Mapeamento dos status do backend para texto e classes de frontend
    const statusMap = {
        'cleared': 'Efetivado',
        'pending': 'Pendente',
        'scheduled': 'Agendado',
        // Adicione outros status se existirem
    };

    const statusClasses = {
      'Efetivado': 'bg-green-500/10 text-green-400',
      'Pendente': 'bg-yellow-500/10 text-yellow-400',
      'Agendado': 'bg-blue-500/10 text-blue-400',
      // Classes padrão para status desconhecido
      'default': 'bg-gray-500/10 text-gray-400',
    };

    // Obtém o texto e a classe com base no status do backend
    const statusText = statusMap[status] || status || 'Desconhecido'; // Usa status original se não mapeado
    const className = statusClasses[statusText] || statusClasses.default;

    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>{statusText}</span>;
};

const LogEntry = ({ transaction }) => {
  // Verifica o tipo da transação vindo do backend ('income' ou 'expense')
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      // Usa flexbox no mobile (flex-col) e grid no sm+ (grid sm:grid-cols-12)
      className={`flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center p-4 rounded-xl transition-colors gap-2 sm:gap-4 ${ // Adicionado gap para espaçamento no mobile/desktop
          // A flag forecast não existe mais no backend, o status determina se é futuro
          // transaction.forecast ? 'opacity-60 hover:opacity-100' : 'hover:bg-black/5 dark:hover:bg-white/5'
           transaction.status !== 'cleared' ? 'opacity-60 hover:opacity-100' : 'hover:bg-black/5 dark:hover:bg-white/5' // Usa status para opacidade
      }`}
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
    >
      {/* Ícone - Mantém a largura fixa, alinha à esquerda no flex (mobile) ou na col-span-1 (desktop) */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center sm:col-span-1 mr-2 sm:mr-0">
        {/* Usa status para determinar o ícone de futuro */}
        {transaction.status !== 'cleared'
          ? <ClockIcon className="h-6 w-6 text-blue-400" />
          : (isIncome
              ? <div className="w-6 h-6 rounded-full bg-finance-lime/10 flex items-center justify-center"><ArrowUpIcon className="h-4 w-4 text-finance-lime"/></div>
              : <div className="w-6 h-6 rounded-full bg-finance-pink/10 flex items-center justify-center"><ArrowDownIcon className="h-4 w-4 text-finance-pink"/></div>
            )
        }
      </div>

      {/* Descrição e Categoria - Ocupa espaço flexível no mobile, col-span-5 no desktop */}
      <div className="flex-1 sm:col-span-5 min-w-0"> {/* min-w-0 ajuda a evitar overflow de texto longo em flex/grid */}
        <p className="font-semibold text-light-text dark:text-dark-text truncate">{transaction.description}</p> {/* Adicionado truncate */}
        {/* CORRIGIDO: Renderiza APENAS o nome da categoria, e verifica se category existe */}
        <p className="text-sm text-light-subtle dark:text-dark-subtle">
            {transaction.category ? transaction.category.name : 'Sem Categoria'}
        </p>
      </div>

      {/* Grupo de Data, Status e Valor - Flexbox no mobile, Grid columns no desktop */}
      {/* Usa gap-2 no mobile e sm:gap-4 no desktop. Usa items-center justify-between no mobile para alinhar horizontalmente */}
      {/* sm:col-span-6 para ocupar as colunas restantes no grid desktop */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:col-span-6 gap-2 sm:gap-4 mt-2 sm:mt-0">

        {/* Data - Ocupa espaço flexível no mobile, col-span-4 (dentro do grupo) no desktop */}
        {/* whitespace-nowrap para evitar quebra da data, mas wrap no container pai se necessário */}
        <div className="text-sm text-light-subtle dark:text-dark-subtle sm:col-span-4 whitespace-nowrap">
            {/* Garante que transaction.date é tratado como string ou Date para formatar */}
             {transaction.date ? new Date(transaction.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}) : 'Data Inválida'}
        </div>

        {/* Status - Ocupa espaço flexível no mobile, col-span-4 (dentro do grupo) no desktop */}
        <div className="sm:col-span-4 flex-shrink-0"> {/* flex-shrink-0 evita que o badge encolha demais */}
            {/* Passa o status vindo do backend ('cleared', 'pending', 'scheduled') */}
            <StatusBadge status={transaction.status} />
        </div>

        {/* Valor - Ocupa espaço flexível no mobile (alinha à direita), col-span-4 no desktop */}
        <div className={`font-bold text-right flex-1 sm:flex-none whitespace-nowrap text-sm sm:text-base ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
            {/* Garante que transaction.amount é number ou string para formatar */}
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(transaction.amount) || 0)}
        </div>
      </div>

      {/* Botão de Opções - Pode ser adicionado aqui se necessário, ocupando uma coluna no desktop */}
      {/* <div className="sm:col-span-1 flex justify-end">
          <button className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
              <EllipsisHorizontalIcon className="h-5 w-5 text-light-subtle dark:text-dark-subtle" />
          </button>
      </div> */}

    </motion.div>
  );
};
export default LogEntry;