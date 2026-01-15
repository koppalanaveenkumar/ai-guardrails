import clsx from 'clsx';

export default function StatsCard({ title, value, unit, icon: Icon, color = "emerald" }) {
    const colorStyles = {
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    };

    return (
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-5 shadow-xl hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            {value}
                        </span>
                        {unit && <span className="text-sm text-gray-500 font-mono">{unit}</span>}
                    </div>
                </div>
                <div className={clsx("p-2.5 rounded-lg", colorStyles[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
