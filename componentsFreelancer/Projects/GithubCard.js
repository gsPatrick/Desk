// componentsFreelancer/Projects/GithubCard.js (NOVO - DETALHES GITHUB E COMMITS)

import { motion, AnimatePresence } from 'framer-motion';
import { SiGithub } from 'react-icons/si';
import { CodeBracketIcon, ArrowDownIcon, BoltIcon } from '@heroicons/react/24/solid'; // BoltIcon para pendências
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Função auxiliar para simular a busca de commits (reutilizada e ligeiramente ajustada)
const simulateFetchCommits = async (githubUrl, githubBranch) => {
    if (!githubUrl || !githubBranch) return [];

    // Simula um atraso de rede
    // await new Promise(resolve => setTimeout(resolve, 800)); // Comentado para testes mais rápidos

    // Simula dados de commits (usando dados do data/freelancerData.js)
    // Extrair owner e repo da URL (simplificado)
    const parts = githubUrl.split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

     // Dados de commits baseados nos dados placeholder
    const commitData = {
         'website-alpha': [
            { sha: 'a1b2c3d4e5f6', message: 'feat: Implementar modal de adição de projeto', author: 'Patrick Siqueira', date: '2024-07-25T10:00:00Z', url: `https://github.com/${owner}/${repo}/commit/a1b2c3d4e5f6` },
            { sha: 'f6e5d4c3b2a1', message: 'fix: Ajustar layout da lista de cards', author: 'Patrick Siqueira', date: '2024-07-24T18:30:00Z', url: `https://github.com/${owner}/${repo}/commit/f6e5d4c3b2a1` },
            { sha: '1a2b3c4d5e6f', message: 'docs: Adicionar README inicial', author: 'Patrick Siqueira', date: '2024-07-24T10:00:00Z', url: `https://github.com/${owner}/${repo}/commit/1a2b3c4d5e6f` },
            { sha: '9z8y7x6w5v4u', message: 'chore: Configurar integração inicial', author: 'Patrick Siqueira', date: '2024-07-23T14:00:00Z', url: `https://github.com/${owner}/${repo}/commit/9z8y7x6w5v4u` },
         ],
         'app-mobile-beta': [
             { sha: 'xyz123abc456', message: 'feat: Setup inicial do projeto mobile', author: 'Patrick Siqueira', date: '2023-11-10T09:00:00Z', url: `https://github.com/${owner}/${repo}/commit/xyz123abc456` },
         ],
         'sistema-interno-gama': [
            { sha: 'def789ghi012', message: 'feat: Criar estrutura inicial do dashboard', author: 'Patrick Siqueira', date: '2024-04-18T14:00:00Z', url: `https://github.com/${owner}/${repo}/commit/def789ghi012` },
            { sha: 'jkl345mno678', message: 'refactor: Otimizar queries da API', author: 'Patrick Siqueira', date: '2024-07-20T11:00:00Z', url: `https://github.com/${owner}/${repo}/commit/jkl345mno678` },
         ],
         'meu-site-pessoal': [
             { sha: 'pqr901stu234', message: 'chore: Adicionar script de otimização', author: 'Patrick Siqueira', date: '2024-07-10T16:00:00Z', url: `https://github.com/${owner}/${repo}/commit/pqr901stu234` },
         ]
    };

    return commitData[repo] || []; // Retorna commits para o repo conhecido, ou array vazio
};


const GithubCard = ({ project }) => {
    const [projectCommits, setProjectCommits] = useState([]);
    const [loadingCommits, setLoadingCommits] = useState(false);

     // Simula a busca de commits quando o projeto muda
    useEffect(() => {
        if (project?.githubUrl && project?.githubBranch) {
            setLoadingCommits(true);
            setProjectCommits([]); // Limpa commits anteriores
            simulateFetchCommits(project.githubUrl, project.githubBranch)
                .then(commits => {
                    setProjectCommits(commits);
                })
                .catch(error => {
                    console.error("Erro ao simular fetch de commits:", error);
                    setProjectCommits([]); // Limpa em caso de erro
                })
                .finally(() => {
                    setLoadingCommits(false);
                });
        } else {
             // Limpa commits se não houver integração GitHub no projeto
            setProjectCommits([]);
            setLoadingCommits(false);
        }
    }, [project]); // Depende do objeto project

    // Formata a data do commit
    const formatCommitDate = (dateString) => {
        try {
             return new Date(dateString).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } catch (e) {
            return dateString || 'Data Inválida';
        }
    };

    return (
        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-2xl border border-black/5 dark:border-white/10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <SiGithub className="h-7 w-7 text-black dark:text-white" /> {/* Ícone oficial do GitHub */}
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text">Integração GitHub</h3>
            </div>

            {project?.githubUrl && project?.githubBranch ? (
                 <div className="flex-1 flex flex-col space-y-4"> {/* flex-1 para ocupar o espaço */}
                     {/* Detalhes do Repositório */}
                     <div className="flex justify-between items-center text-sm border-b border-black/5 dark:border-white/5 pb-3">
                         <div>
                             <p className="text-light-subtle dark:text-dark-subtle">Repositório</p>
                             <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-500 hover:underline break-all">{project.githubUrl.split('/').pop()}</Link>
                         </div>
                          {/* Mostra a Branch */}
                          {project.githubBranch && (
                             <div className="flex-shrink-0 text-right">
                                <p className="text-light-subtle dark:text-dark-subtle">Branch</p>
                                <p className="font-mono font-semibold text-light-text dark:text-dark-text">{project.githubBranch}</p>
                             </div>
                         )}
                     </div>

                     {/* Resumo e Pendências (Simulado) */}
                     <div className="flex items-center gap-4 text-sm border-b border-black/5 dark:border-white/5 pb-3">
                         {/* Exemplo: Ícone de check ou cruz para status */}
                         {project.status === 'Em Andamento' ? (
                             <CodeBracketIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
                         ) : (
                            <BoltIcon className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                         )}
                         <div>
                            <p className="text-light-subtle dark:text-dark-subtle">Resumo da Integração</p>
                             {/* Mensagem baseada no status do projeto, commits, etc. */}
                            <p className="font-semibold text-light-text dark:text-dark-text">
                                {project.status === 'Em Andamento' ? 'Monitorando a branch. Último commit recente.' : 'Projeto pausado. Verifique a branch.'}
                                {/* Poderia adicionar contagem de commits pendentes, etc. */}
                            </p>
                         </div>
                     </div>


                     {/* Lista de Commits (com scroll) */}
                      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 text-sm"> {/* Scroll interno */}
                           <h4 className="text-md font-semibold text-light-text dark:text-dark-text">Últimos Commits ({project.githubBranch})</h4>
                           {loadingCommits ? (
                               <p className="text-sm text-light-subtle dark:text-dark-subtle text-center py-4">Carregando commits...</p>
                           ) : projectCommits.length > 0 ? (
                               <div className="space-y-3 text-xs">
                                   {projectCommits.map(commit => (
                                       <div key={commit.sha} className="pb-2 border-b border-black/5 dark:border-white/5 last:border-b-0">
                                           <p className="font-semibold text-light-text dark:text-dark-text leading-tight">{commit.message}</p>
                                           <p className="text-light-subtle dark:text-dark-subtle mt-0.5">
                                              {commit.author} em {formatCommitDate(commit.date)}
                                           </p>
                                            {/* Link para o commit */}
                                            <Link href={commit.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs font-mono mt-1 inline-block break-all">{commit.sha.substring(0, 7)}...</Link>
                                       </div>
                                   ))}
                               </div>
                           ) : (
                               <p className="text-sm text-light-subtle dark:text-dark-subtle text-center py-4">Nenhum commit encontrado para esta branch ou repositório na simulação.</p>
                           )}
                       </div>

                 </div>
            ) : (
                 <div className="flex-1 flex items-center justify-center text-center text-light-subtle dark:text-dark-subtle">
                     <p>Integração GitHub não configurada para este projeto.</p>
                 </div>
             )}

        </div>
    );
};
export default GithubCard;