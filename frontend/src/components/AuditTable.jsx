import { useState, useEffect } from 'react';
import { Activity, Clock, ShieldAlert, CheckCircle, Search } from 'lucide-react';
import clsx from 'clsx';

export default function AuditTable() {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const apiKey = localStorage.getItem('ai_guardrails_key');
            if (!apiKey) return;

            const res = await fetch(`${apiUrl}/audit/logs`, {
                headers: {
                    'x-api-key': apiKey
                }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error("Failed to fetch logs", err);
        }
    };

    useEffect(() => {
        fetchLogs(); // Initial fetch

        // Listen for new logs triggered by the Playground
        const handleUpdate = () => {
            fetchLogs();
            fetchStats(); // Also update stats if we had access to that function, but StatsGrid handles itself.
        };

        window.addEventListener('audit-log-update', handleUpdate);

        // Optional: Very slow poll just in case (every 60s)
        const interval = setInterval(fetchLogs, 60000);

        return () => {
            window.removeEventListener('audit-log-update', handleUpdate);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto mt-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Live Audit Stream</h2>
                        <p className="text-sm text-gray-500">Incoming request logs</p>
                    </div>
                </div>
                <button
                    onClick={fetchLogs}
                    className="text-xs font-mono text-gray-400 hover:text-white bg-black/40 hover:bg-gray-800 px-3 py-1.5 rounded border border-gray-800 transition-colors"
                >
                    Refresh (Auto: 10s)
                </button>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-black/40 text-gray-500 uppercase tracking-wider font-mono text-[10px] border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Latency</th>
                                <th className="px-6 py-4 font-medium w-full">Reason</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Time (UTC)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm",
                                            log.is_safe
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                                                : "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5"
                                        )}>
                                            {log.is_safe ? <CheckCircle className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                            {log.is_safe ? "ALLOWED" : "BLOCKED"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                                            <span className={log.latency_ms > 200 ? "text-yellow-500" : "text-gray-300"}>
                                                {Math.round(log.latency_ms)}ms
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {log.reason ? (
                                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 text-xs font-mono">
                                                    {log.reason}
                                                </span>
                                            ) : (
                                                <span className="text-gray-700 italic flex items-center gap-1 text-xs">
                                                    <CheckCircle className="w-3 h-3" /> Safe Request
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                                        {new Date(log.timestamp + "Z").toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-0">
                                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
                                            <div className="p-4 bg-gray-800/30 rounded-full">
                                                <Search className="w-8 h-8 opacity-40" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-medium text-gray-400">No logs found yet</p>
                                                <p className="text-sm mt-1">Send a request from the Playground to see it appear here!</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
