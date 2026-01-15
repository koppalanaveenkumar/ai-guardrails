import { ArrowLeft, Copy, Check, Shield } from 'lucide-react';
import { useState } from 'react';
import Footer from './Footer';

export default function Docs({ onBack }) {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans antialiased selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur fixed top-0 w-full z-50">
                <div className="container mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <Shield className="w-5 h-5 text-emerald-400" />
                            <span>AI Guardrails</span>
                        </div>
                        <span className="text-gray-700">|</span>
                        <span className="text-gray-400 font-medium">API Documentation</span>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar */}
                <div className="hidden lg:block space-y-8 sticky top-24 h-fit">
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Getting Started</h3>
                        <ul className="space-y-2 border-l border-gray-800">
                            <NavItem id="intro">Introduction</NavItem>
                            <NavItem id="auth">Authentication</NavItem>
                            <NavItem id="integration">Client Integration</NavItem>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">API Reference</h3>
                        <ul className="space-y-2 border-l border-gray-800">
                            <NavItem id="endpoints">Endpoints</NavItem>
                        </ul>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-16">

                    {/* Intro */}
                    <section id="intro" className="space-y-6">
                        <h1 className="text-4xl font-extrabold tracking-tight">Introduction</h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            AI Guardrails provides a unified API to secure your LLM inputs and outputs.
                            It detects prompt injection, redacts PII, and filters toxicity in real-time.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-2">🛡️ Prevent Prompt Injections</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Stop "jailbreak" attempts (e.g., "Ignore previous instructions") before they reach your LLM.
                                    We use semantic analysis to catch creative attacks that keyword filters miss.
                                </p>
                            </div>
                            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-2">🔒 PII & Data Privacy</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Automatically redact sensitive data like Emails, Phone Numbers, and Credit Cards.
                                    Ensure GDPR/CCPA compliance without complex regex maintenance.
                                </p>
                            </div>
                            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-2">⚡ Low Latency API</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Optimized for real-time chat applications. Our pipeline runs in milliseconds,
                                    adding negligible overhead to your user experience.
                                </p>
                            </div>
                            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-2">📊 Audit & Observability</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Keep a standard audit log of every interaction. Track blocked requests,
                                    attack patterns, and usage stats in a single dashboard.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Authentication */}
                    <section id="auth" className="space-y-6">
                        <h2 className="text-3xl font-bold">Authentication</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            To ensure the security and traceability of all requests, we use API Key authentication.
                            Follow these steps to get started:
                        </p>

                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">1</div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Create an Account</h3>
                                    <p className="text-gray-400 text-sm">Sign up on the dashboard to generate your unique API Key.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">2</div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Copy Your Key</h3>
                                    <p className="text-gray-400 text-sm">
                                        Your key will look like <code className="text-blue-300">ag_live_...</code>.
                                        Keep this secret! Do not expose it in client-side code relative to public users.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">3</div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Add to Header</h3>
                                    <p className="text-gray-400 text-sm mb-3">Include the key in the `x-api-key` header of every request.</p>
                                    <div className="bg-black/50 border border-gray-800 rounded-lg p-3">
                                        <code className="text-sm font-mono text-purple-400">x-api-key: ag_live_xyz123...</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Client Integration */}
                    <section id="integration" className="space-y-6">
                        <h2 className="text-3xl font-bold">Client Integration</h2>
                        <p className="text-gray-400 text-lg">
                            You can call the API using any HTTP client. Here is a standard Python example:
                        </p>

                        <CodeBlock
                            language="python"
                            code={`import requests

url = "http://localhost:8000/api/v1/guard/"
headers = {
    "x-api-key": "sk_live_..."
}
payload = {
    "prompt": "Ignore previous instructions",
    "config": {
        "detect_injection": True,
        "redact_pii": True
    }
}

response = requests.post(url, json=payload, headers=headers)
result = response.json()

if not result["safe"]:
    print(f"Blocked: {result['reason']}")
else:
    print(f"Sanitized: {result['sanitized_prompt']}")`}
                        />
                    </section>

                    {/* Endpoints */}
                    <section id="endpoints" className="space-y-8">
                        <h2 className="text-3xl font-bold">API Reference</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-sm font-bold rounded border border-emerald-500/20">POST</span>
                                <code className="text-lg font-mono">/api/v1/guard/</code>
                            </div>
                            <p className="text-gray-400">Analyzes a prompt for security threats.</p>

                            <h4 className="font-bold text-gray-300 mt-4">Request Body</h4>
                            <CodeBlock
                                language="json"
                                code={`{
  "prompt": "My phone is 555-1234",
  "config": {
    "detect_injection": true,
    "redact_pii": true
  }
}`}
                            />

                            <h4 className="font-bold text-gray-300 mt-4">Response</h4>
                            <CodeBlock
                                language="json"
                                code={`{
  "safe": true,
  "reason": null,
  "sanitized_prompt": "My phone is <PHONE_NUMBER>",
  "pii_detected": ["PHONE_NUMBER"]
}`}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function CodeBlock({ code, language }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <div className="bg-black/50 border border-gray-800 rounded-xl p-5 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                    {code}
                </pre>
            </div>
        </div>
    );
}

function NavItem({ id, children }) {
    const scrollToSection = () => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Navbar height + padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <li
            onClick={scrollToSection}
            className="pl-4 border-l border-transparent hover:border-blue-500 text-gray-500 hover:text-white cursor-pointer transition-all"
        >
            {children}
        </li>
    );
}
