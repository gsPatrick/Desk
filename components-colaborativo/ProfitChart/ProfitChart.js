import { useState, useEffect } from 'react';
import styles from './ProfitChart.module.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProfitChart({ data }) {
    // Corrigido para um valor padrão que funciona no tema escuro
    const themeColors = { tick: '#888888', grid: '#2A2A2A' };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Lucro Mensal (Últimos 6 meses)</h3>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} vertical={false} />
                        {/* --- CORREÇÃO AQUI: Adicionado `tick` com a cor correta --- */}
                        <XAxis dataKey="name" stroke={themeColors.tick} fontSize={12} tickLine={false} axisLine={false} tick={{ fill: themeColors.tick }} />
                        <YAxis stroke={themeColors.tick} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} tick={{ fill: themeColors.tick }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            contentStyle={{ backgroundColor: 'var(--colab-surface)', borderColor: 'var(--colab-border)', color: 'var(--colab-text-primary)' }}
                        />
                        <Bar dataKey="lucro" fill="var(--colab-accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}