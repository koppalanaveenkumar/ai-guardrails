
export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-black/40 text-center mt-8">
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
    );
}
