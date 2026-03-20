import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Stock } from '../types';

export function AddStockModal({ onClose, onAdd }: { onClose: () => void, onAdd: (stock: Omit<Stock, 'id' | 'currentPrice' | 'basePrice'>) => Promise<boolean> }) {
  const [symbol, setSymbol] = useState('');
  const [company, setCompany] = useState('');
  const [minLimit, setMinLimit] = useState('');
  const [maxLimit, setMaxLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !company || !minLimit || !maxLimit) return;
    
    setIsLoading(true);
    await onAdd({
      symbol: symbol.toUpperCase(),
      company: company,
      minLimit: parseFloat(minLimit),
      maxLimit: parseFloat(maxLimit),
      notificationsEnabled: true,
    });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-xl border-4 border-kawaii-bg1 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-kawaii-bg2 rounded-full text-gray-500 hover:text-kawaii-dark transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-3xl font-sniglet text-kawaii-dark mb-6 text-center">Nueva Empresa 🌸</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-kawaii-detail2 mb-1">Símbolo (ej. NASDAQ: AAPL)</label>
            <input 
              type="text" 
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              placeholder="AAPL"
              className="w-full bg-kawaii-bg2 border-2 border-kawaii-detail1 rounded-2xl px-4 py-3 focus:outline-none focus:border-kawaii-accent2 font-sniglet text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-kawaii-detail2 mb-1">Empresa (ej. Apple)</label>
            <input 
              type="text" 
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Apple"
              className="w-full bg-kawaii-bg2 border-2 border-kawaii-detail1 rounded-2xl px-4 py-3 focus:outline-none focus:border-kawaii-accent2 font-sniglet text-lg"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-kawaii-detail2 mb-1">Límite Mínimo ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={minLimit}
                onChange={e => setMinLimit(e.target.value)}
                placeholder="100.00"
                className="w-full bg-kawaii-bg2 border-2 border-kawaii-detail1 rounded-2xl px-4 py-3 focus:outline-none focus:border-kawaii-accent2 font-sniglet text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-kawaii-detail2 mb-1">Límite Máximo ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={maxLimit}
                onChange={e => setMaxLimit(e.target.value)}
                placeholder="200.00"
                className="w-full bg-kawaii-bg2 border-2 border-kawaii-detail1 rounded-2xl px-4 py-3 focus:outline-none focus:border-kawaii-accent2 font-sniglet text-lg"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-kawaii-accent2 hover:bg-kawaii-accent1 disabled:opacity-50 disabled:cursor-not-allowed text-kawaii-dark font-sniglet text-xl py-4 rounded-2xl shadow-sm transition-transform active:scale-95 border-2 border-kawaii-detail1 flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Agregar a mi tablero ✨'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
