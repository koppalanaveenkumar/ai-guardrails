import { useState } from 'react';
import Playground from './Playground';
import AuditTable from './AuditTable';
import StatsGrid from './StatsGrid';
import RegisterModal from './RegisterModal';
import Footer from './Footer';
import { Key, LogOut } from 'lucide-react';

export default function Dashboard({ onLogout, initialAuthOpen = false }) {
    const [isRegisterOpen, setRegisterOpen] = useState(initialAuthOpen);

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans antialiased animate-in fade-in duration-500">
            <RegisterModal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} />

            <main className="container mx-auto py-12 px-4 md:px-0">
                <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-800 pb-8">
                    <div className="text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            AI Guardrails
                        </h1>
                        <p className="text-gray-400">Real-time LLM Security Gateway</p>
                    </div>

                    <div className="flex gap-4 mt-4 md:mt-0">
                        <button
                            onClick={() => setRegisterOpen(true)}
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg border border-gray-700 hover:border-blue-500/30"
                        >
                            <Key className="w-4 h-4" />
                            API Key
                        </button>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-400 px-3 py-2.5 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <StatsGrid />
                <Playground onOpenAuth={() => setRegisterOpen(true)} />
                <AuditTable />
            </main>
            <Footer />
        </div>
    );
}
