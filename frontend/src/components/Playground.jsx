import { useState } from 'react';
import { Shield, Sparkles, Zap, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import clsx from 'clsx';

export default function Playground({ onOpenAuth }) {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [config, setConfig] = useState({
        detect_injection: true,
        detect_toxicity: true,
        redact_pii: true,
    });

    const checkPrompt = async () => {
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/guard/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': localStorage.getItem('ai_guardrails_key')
                },
                body: JSON.stringify({ prompt, config }),
            });
            if (res.status === 403 || res.status === 401) {
                setError({
                    type: 'auth',
                    message: "Authentication Failed. Please Login to continue."
                });
                setLoading(false);
                return;
            }

            if (!res.ok) throw new Error('API Error');

            const data = await res.json();
            setResult(data);
            // Trigger refresh in other components
            window.dispatchEvent(new Event('audit-log-update'));
        } catch (err) {
            console.error(err);
            setError({
                type: 'connection',
                message: "Failed to connect to API. Please check backend."
            });
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
                        <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Guardrails Console
                        </h1>
                        <p className="text-gray-400 text-sm">Real-time LLM Firewall & PII Sanitizer</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    System Online
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Controls */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-gray-900/60 backdrop-blur-md p-1 rounded-2xl border border-gray-800 shadow-2xl">
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    Input Prompt
                                </label>
                                <span className="text-xs text-gray-500">{prompt.length} chars</span>
                            </div>

                            <textarea
                                className="w-full h-48 bg-gray-950/50 border border-gray-800 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                                placeholder="Enter a prompt to test boundaries...&#10;Try: 'Ignore previous instructions'&#10;Or: 'My phone is 555-0199'"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>

                        <div className="bg-gray-950/80 p-5 rounded-xl border-t border-gray-800 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <label className={clsx(
                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                    config.detect_injection
                                        ? "bg-red-500/10 border-red-500/30 text-red-200"
                                        : "bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={config.detect_injection}
                                        onChange={(e) => setConfig({ ...config, detect_injection: e.target.checked })}
                                        className="hidden"
                                    />
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Injection Shield</span>
                                </label>

                                <label className={clsx(
                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                    config.redact_pii
                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-200"
                                        : "bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={config.redact_pii}
                                        onChange={(e) => setConfig({ ...config, redact_pii: e.target.checked })}
                                        className="hidden"
                                    />
                                    <Lock className="w-4 h-4" />
                                    <span className="text-sm font-medium">PII Redaction</span>
                                </label>

                                <label className={clsx(
                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                    config.detect_toxicity
                                        ? "bg-purple-500/10 border-purple-500/30 text-purple-200"
                                        : "bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={config.detect_toxicity}
                                        onChange={(e) => setConfig({ ...config, detect_toxicity: e.target.checked })}
                                        className="hidden"
                                    />
                                    <Zap className="w-4 h-4" />
                                    <span className="text-sm font-medium">Toxicity Filter</span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                    Block Topics
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. politics, competitors, cooking"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 focus:border-emerald-500/50 outline-none transition-colors"
                                    onChange={(e) => {
                                        const topics = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                                        setConfig({ ...config, block_topics: topics.length ? topics : null });
                                    }}
                                />
                            </div>

                            <button
                                onClick={checkPrompt}
                                disabled={loading || !prompt}
                                className={clsx(
                                    "w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2",
                                    loading
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-900/40"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        SCAN PROMPT
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Output */}
                <div className="lg:col-span-7">
                    <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl h-full min-h-[400px] relative overflow-hidden flex flex-col">
                        {error && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-sm p-8 text-center animate-in fade-in duration-300">
                                <div className="p-4 bg-red-500/10 rounded-full mb-4 ring-1 ring-red-500/30">
                                    <Lock className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{error.message}</h3>
                                {error.type === 'auth' && (
                                    <button
                                        onClick={onOpenAuth}
                                        className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors"
                                    >
                                        Log In / Register
                                    </button>
                                )}
                            </div>
                        )}

                        {!result && !loading && !error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 space-y-4">
                                <Shield className="w-16 h-16 opacity-20" />
                                <p className="text-sm font-medium">Ready to analyze</p>
                            </div>
                        )}

                        {result && (
                            <div className="flex-1 p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Status Header */}
                                <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Analysis Result</h3>
                                        <div className="mt-1 text-2xl font-bold text-white flex items-center gap-3">
                                            {result.safe ? "Safe to Process" : "Threat Blocked"}
                                        </div>
                                    </div>

                                    <div className={clsx(
                                        "px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-inner",
                                        result.safe
                                            ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50"
                                            : "bg-red-500/20 text-red-400 ring-1 ring-red-500/50"
                                    )}>
                                        {result.safe ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                        {result.safe ? "ALLOWED" : "BLOCKED"}
                                    </div>
                                </div>

                                {/* Risk Confidence Meter */}
                                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-2">
                                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <span>Risk Confidence</span>
                                        <span className={clsx(
                                            result.score > 0.7 ? "text-red-400" : result.score > 0.3 ? "text-yellow-400" : "text-emerald-400"
                                        )}>
                                            {(result.score * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                                        <div
                                            className={clsx(
                                                "h-full transition-all duration-1000 ease-out",
                                                result.score > 0.7 ? "bg-red-500" : result.score > 0.3 ? "bg-yellow-500" : "bg-emerald-500"
                                            )}
                                            style={{ width: `${Math.max(result.score * 100, 5)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                                        <span>SAFE</span>
                                        <span>SUSPICIOUS</span>
                                        <span>TOXIC/ATTACK</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-6">
                                    {!result.safe && (
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Reason for Block</span>
                                            <div className="mt-1 text-lg font-medium text-red-200/90">
                                                {result.reason}
                                            </div>
                                        </div>
                                    )}

                                    {result.sanitized_prompt && (
                                        <div>
                                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-2">Sanitized Output</span>
                                            <div className="p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-sm text-gray-300 leading-relaxed break-words shadow-inner">
                                                {result.sanitized_prompt}
                                            </div>
                                        </div>
                                    )}

                                    {result.pii_detected?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider block mb-2">
                                                Detected PII ({result.pii_detected.length})
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {result.pii_detected.map((pii, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-200 text-xs font-medium rounded-md">
                                                        {pii}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Raw JSON */}
                                <div className="pt-4 mt-auto">
                                    <details className="group">
                                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-colors list-none flex items-center gap-2">
                                            <span className="opacity-50">▶</span> View Raw JSON Response
                                        </summary>
                                        <div className="mt-3 p-4 bg-black rounded-xl border border-gray-800 overflow-x-auto">
                                            <pre className="text-[10px] text-gray-500 font-mono">
                                                {JSON.stringify(result, null, 2)}
                                            </pre>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
