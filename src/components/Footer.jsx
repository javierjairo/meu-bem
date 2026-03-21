import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-900/30 py-8 bg-dark/50 mt-12 mb-0">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-gray-500 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <span>Criado com</span>
          <Heart size={14} className="text-purple-500 fill-purple-500 animate-pulse" />
        </div>
        <p className="font-serif italic text-purple-400/50">Nosso site de Memorias eternas.</p>
      </div>
    </footer>
  );
}
