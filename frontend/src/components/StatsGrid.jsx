import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Zap } from 'lucide-react';
import StatsCard from './StatsCard';

export default function StatsGrid() {
    const [stats, setStats] = useState({
        total_requests: 0,
        blocked_requests: 0,
        block_rate: 0,
        avg_latency: 0
    });

    const fetchStats = async () => {
        try {
            const apiKey = localStorage.getItem('ai_guardrails_key');
            if (!apiKey) return;

            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/audit/stats`, {
                headers: { 'x-api-key': apiKey }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8 px-8 lg:px-0">
            <StatsCard
                title="Total Requests"
                value={stats.total_requests}
                icon={Activity}
                color="blue"
            />
            <StatsCard
                title="Block Rate"
                value={stats.block_rate.toFixed(1)}
                unit="%"
                icon={ShieldAlert}
                color={stats.block_rate > 10 ? "red" : "emerald"}
            />
            <StatsCard
                title="Avg Latency"
                value={stats.avg_latency}
                unit="ms"
                icon={Zap}
                color="purple"
            />
        </div>
    );
}
