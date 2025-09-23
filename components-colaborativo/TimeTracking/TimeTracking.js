import { useState, useEffect } from 'react';
import api from '../../services/colaborativo-api';
import styles from './TimeTracking.module.css';
import { IoPlay, IoStop, IoTrash } from 'react-icons/io5';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatSimpleDate = (dateStr) => format(new Date(dateStr), 'dd/MM/yyyy HH:mm');

// Helper para formatar a duração em horas e minutos
const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return '0h 0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

export default function TimeTracking({ projectId }) {
    const [timeEntries, setTimeEntries] = useState([]);
    const [runningTimer, setRunningTimer] = useState(null);
    const [description, setDescription] = useState('');

    const fetchTimeEntries = async () => {
        try {
            const response = await api.get(`/projects/${projectId}/time-entries`);
            setTimeEntries(response.data);
            const running = response.data.find(entry => entry.endTime === null);
            setRunningTimer(running || null);
        } catch (error) {
            console.error("Erro ao buscar registros de tempo", error);
        }
    };

    useEffect(() => {
        fetchTimeEntries();
    }, [projectId]);

    const handleStartTimer = async () => {
        try {
            const response = await api.post(`/projects/${projectId}/time-entries/start`, { description });
            setRunningTimer(response.data);
            setDescription(''); // Limpa o campo
        } catch (error) {
            alert(error.response?.data?.message || "Não foi possível iniciar o timer.");
        }
    };

    const handleStopTimer = async () => {
        if (!runningTimer) return;
        try {
            await api.patch(`/time-entries/${runningTimer.id}/stop`);
            setRunningTimer(null);
            fetchTimeEntries(); // Atualiza a lista com o registro completo
        } catch (error) {
            alert(error.response?.data?.message || "Não foi possível parar o timer.");
        }
    };

    const totalMinutes = timeEntries.reduce((acc, entry) => acc + (entry.durationInMinutes || 0), 0);

    return (
        <div className={styles.section}>
            <h2>Controle de Horas</h2>
            <div className={styles.timerControl}>
                <input 
                    type="text" 
                    placeholder="O que você está fazendo?" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!!runningTimer}
                />
                {runningTimer ? (
                    <button className={styles.stopButton} onClick={handleStopTimer}>
                        <IoStop /> Parar
                    </button>
                ) : (
                    <button className={styles.startButton} onClick={handleStartTimer}>
                        <IoPlay /> Iniciar
                    </button>
                )}
            </div>

            {runningTimer && <RunningTimer startTime={runningTimer.startTime} description={runningTimer.description} />}

            <div className={styles.summary}>
                <span>Total Registrado</span>
                <span className={styles.totalTime}>{formatDuration(totalMinutes)}</span>
            </div>
            
            <div className={styles.entryList}>
                {timeEntries.map(entry => (
                    <div key={entry.id} className={styles.entryItem}>
                        <div className={styles.entryInfo}>
                            <p className={styles.entryDesc}>{entry.description || 'Sem descrição'}</p>
                            <p className={styles.entryDate}>{formatSimpleDate(entry.startTime)}</p>
                        </div>
                        <span className={styles.entryDuration}>{entry.endTime ? formatDuration(entry.durationInMinutes) : 'Rodando...'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Componente interno para exibir o contador do timer rodando
const RunningTimer = ({ startTime, description }) => {
    const [elapsed, setElapsed] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            const duration = formatDistanceToNowStrict(new Date(startTime), { unit: 'second', locale: ptBR });
            setElapsed(duration);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <div className={styles.runningTimerBar}>
            <div>
                <p><strong>{description || 'Timer em andamento...'}</strong></p>
                <p>{elapsed}</p>
            </div>
        </div>
    );
}