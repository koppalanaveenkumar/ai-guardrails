import { useState } from 'react';
import { Key, Mail, Lock, CheckCircle, Copy, X } from 'lucide-react';

export default function RegisterModal({ isOpen, onClose, onSuccess }) {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const endpoint = isLogin ? 'login' : 'register';
        const apiUrl = import.meta.env.VITE_API_URL;

        try {
            const res = await fetch(`${apiUrl}/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Authentication failed');

            setApiKey(data.api_key);
            localStorage.setItem('ai_guardrails_key', data.api_key);
            window.dispatchEvent(new Event('storage'));

            if (isLogin) {
                onClose();
                if (onSuccess) onSuccess(); // Notify parent of successful login
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Key className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {apiKey ? 'Access Granted' : (isLogin ? 'Welcome Back' : 'Get Your API Key')}
                        </h2>
                    </div>

                    {!apiKey && (
                        <div className="flex gap-4 mb-6 border-b border-gray-800">
                            <button
                                onClick={() => { setIsLogin(false); setError(null); }}
                                className={`pb-2 text-sm font-medium transition-colors ${!isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => { setIsLogin(true); setError(null); }}
                                className={`pb-2 text-sm font-medium transition-colors ${isLogin ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Log In
                            </button>
                        </div>
                    )}

                    {!apiKey ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center"
                            >
                                {loading ? 'Processing...' : (isLogin ? 'Log In & Retrieve Key' : 'Generate API Key')}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Account Created!</span>
                            </div>
                            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Your Secret Key</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 font-mono text-sm text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20 break-all">
                                        {apiKey}
                                    </code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(apiKey)}
                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                                        title="Copy to clipboard"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                This key will not be shown again. Save it securely.
                            </p>
                            <button
                                onClick={onSuccess}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                Go to Dashboard
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
