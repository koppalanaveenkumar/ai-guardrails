import { Shield, Zap, Lock, Activity, ChevronRight, Code, X } from 'lucide-react';
import { useState } from 'react';
import RegisterModal from './RegisterModal';

export default function LandingPage({ onGetStarted, onViewDocs, showAuthModal, onAuthSuccess, onAuthClose }) {
    const [showImage, setShowImage] = useState(false);
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-emerald-500/30">
            <RegisterModal
                isOpen={showAuthModal}
                onClose={onAuthClose}
                onSuccess={onAuthSuccess}
            />
            {/* Navbar */}
            <nav className="border-b border-white/5 backdrop-blur-md fixed top-0 w-full z-50">
                <div className="container mx-auto px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        <span>AI Guardrails</span>
                    </div>
                    <div className="flex gap-4 md:gap-6 text-sm font-medium text-gray-400 items-center">
                        <button onClick={onViewDocs} className="hover:text-white transition-colors text-xs md:text-sm">Documentation</button>
                        <button
                            onClick={onGetStarted}
                            className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-xs md:text-sm font-bold"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto text-center relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-6">
                        <Zap className="w-3 h-3" />
                        v1.0 Now Available
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Secure your LLMs <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                            in Real-Time.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Detect prompt injections, redness malicious inputs, and redact PII before they reach your model.
                        The open-source firewall for the AI era.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="group bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                        >
                            Start Protecting Now
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onViewDocs}
                            className="px-8 py-4 rounded-xl font-bold text-lg border border-gray-800 hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-gray-300"
                        >
                            <Code className="w-5 h-5" />
                            View Documentation
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 border-t border-white/5 bg-gray-950/50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Shield}
                            title="Injection Defense"
                            desc="Blocks 'Ignore previous instructions' and other jailbreak attempts using semantic analysis."
                            color="text-emerald-400"
                        />
                        <FeatureCard
                            icon={Lock}
                            title="PII Redaction"
                            desc="Automatically detects and removes emails, phone numbers, and secrets from prompts."
                            color="text-blue-400"
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Live Analytics"
                            desc="Monitor detailed audit logs, block rates, and latency in real-time."
                            color="text-purple-400"
                        />
                    </div>
                </div>
            </section>

            {/* About Creator */}
            <section className="py-16 border-t border-white/5 bg-gray-900/20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">Built by an Expert</h2>
                    <div className="max-w-2xl mx-auto bg-gray-900/40 border border-gray-800 rounded-2xl p-8">
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src="/naveen.jpg"
                                alt="Naveenkumar Koppala"
                                className="w-24 h-24 rounded-full object-cover object-top border-4 border-gray-800 shadow-2xl mb-2 cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => setShowImage(true)}
                            />

                            {/* Image Modal */}
                            {showImage && (
                                <div
                                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
                                    onClick={() => setShowImage(false)}
                                >
                                    <button className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                                        <X className="w-8 h-8" />
                                    </button>
                                    <img
                                        src="/naveen.jpg"
                                        alt="Naveenkumar Koppala"
                                        className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-white">Naveenkumar Koppala</h3>
                                <p className="text-sm text-blue-400 font-medium mb-3">Senior Backend & Product Engineer</p>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    With 4.7+ years of experience scaling secure fintech and enterprise systems.
                                    Specializing in Python, FastAPI, and Cloud-Native Security.
                                </p>
                            </div>
                            <div className="flex gap-3 mt-2">
                                <a
                                    href="https://www.linkedin.com/in/naveenkumarkoppala"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-600/20"
                                >
                                    Connect on LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-black/40 text-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; 2026 AI Guardrails. Open Source Security.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Built by</span>
                        <span className="text-white font-medium">Naveenkumar Koppala</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
    return (
        <div className="p-8 rounded-2xl bg-gray-900/40 border border-white/5 hover:border-white/10 transition-colors">
            <div className={`w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center mb-6 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </div>
    )
}
