import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/formatters';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-end gap-3">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300 max-w-xs">
          <span>¿Dudas con un vehículo o financiamiento? ¡Hablemos por WhatsApp!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={buildWhatsAppLink('5698253776', 'Hola Autoval! Me gustaría recibir información de los autos disponibles.')}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-950 animate-ping" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-950" />
      </a>
    </div>
  );
};
