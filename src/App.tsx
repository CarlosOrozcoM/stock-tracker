import React, { useState, useEffect, useRef } from 'react';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Stock, Notification } from './types';
import { StockCard } from './components/StockCard';
import { AddStockModal } from './components/AddStockModal';

/* If you clone this repo, don't forget to hide your API Key                                      */
/* You can request your own API Key in https://finnhub.io - this key is just for personal testing */
const FINNHUB_API_KEY = 'd6sppl9r01qoqoir174gd6sppl9r01qoqoir1750';

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>(() => {
    const saved = localStorage.getItem('kawaii-stocks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const stocksRef = useRef(stocks);

  useEffect(() => {
    stocksRef.current = stocks;
  }, [stocks]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('kawaii-stocks', JSON.stringify(stocks));
  }, [stocks]);

  const fetchStockPrice = async (symbol: string) => {
    try {
      // Limpiamos el símbolo por si el usuario escribe "NASDAQ: AAPL"
      const cleanSymbol = symbol.replace(/^(NASDAQ|NYSE|AMEX):\s*/i, '').trim().toUpperCase();
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${cleanSymbol}&token=${FINNHUB_API_KEY}`);
      const data = await res.json();
      
      // Finnhub devuelve c: 0 si el símbolo no existe o es inválido
      if (data && data.c !== 0) {
        return { currentPrice: data.c, previousClose: data.pc };
      }
      return null;
    } catch (error) {
      console.error("Error fetching stock:", error);
      return null;
    }
  };

  // Real API updates
  useEffect(() => {
    const updatePrices = async () => {
      const currentStocks = stocksRef.current;
      if (currentStocks.length === 0) return;

      const newStocks = [...currentStocks];
      let hasChanges = false;

      for (let i = 0; i < newStocks.length; i++) {
        const stock = newStocks[i];
        const priceData = await fetchStockPrice(stock.symbol);
        
        if (priceData && priceData.currentPrice !== stock.currentPrice) {
          const newPrice = priceData.currentPrice;
          
          if (stock.notificationsEnabled) {
            if (newPrice < stock.minLimit && stock.currentPrice >= stock.minLimit) {
              addNotification(`¡${stock.symbol} bajó de $${stock.minLimit}! 📉`, 'min');
            }
            if (newPrice > stock.maxLimit && stock.currentPrice <= stock.maxLimit) {
              addNotification(`¡${stock.symbol} superó $${stock.maxLimit}! 📈`, 'max');
            }
          }
          
          newStocks[i] = { ...stock, currentPrice: newPrice, basePrice: priceData.previousClose };
          hasChanges = true;
        }
      }

      if (hasChanges) {
        setStocks(newStocks);
      }
    };

    // Update every 10 minutes (600000 ms)
    const interval = setInterval(updatePrices, 600000);
    
    // Fetch immediately on mount to ensure prices are up to date
    updatePrices();

    return () => clearInterval(interval);
  }, []);

  const addNotification = (message: string, type: 'min' | 'max') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const addStock = async (newStock: Omit<Stock, 'id' | 'currentPrice' | 'basePrice'>) => {
    const priceData = await fetchStockPrice(newStock.symbol);
    
    if (!priceData) {
      alert(`No se pudo encontrar el símbolo ${newStock.symbol}. Verifica que sea correcto (ej. AAPL o NASDAQ: AAPL).`);
      return false;
    }

    const stock: Stock = {
      ...newStock,
      id: Date.now().toString(),
      basePrice: priceData.previousClose,
      currentPrice: priceData.currentPrice,
    };
    setStocks(prev => [...prev, stock]);
    setIsAddModalOpen(false);
    return true;
  };

  const deleteStock = (id: string) => {
    setStocks(stocks.filter(s => s.id !== id));
  };

  const toggleNotifications = (id: string) => {
    setStocks(stocks.map(s => s.id === id ? { ...s, notificationsEnabled: !s.notificationsEnabled } : s));
  };

  const updateStockLimits = (id: string, minLimit: number, maxLimit: number) => {
    setStocks(stocks.map(s => s.id === id ? { ...s, minLimit, maxLimit } : s));
  };

  return (
    <div className="min-h-screen bg-kawaii-bg2 p-4 md:p-8 font-quicksand">
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-kawaii-bg1 p-3 rounded-full shadow-sm border-2 border-kawaii-detail1">
            <img src="/icon-sakura-branch.png" alt="" />
          </div>
          <h1 className="text-4xl font-sniglet text-kawaii-dark tracking-wide">Kawaii Stocks</h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-kawaii-accent1 hover:bg-kawaii-accent2 text-kawaii-dark font-sniglet text-lg py-3 px-6 rounded-full shadow-sm transition-transform active:scale-95 flex items-center gap-2 border-2 border-kawaii-detail1"
        >
          <Plus className="w-5 h-5" />
          Track Empresa
        </button>
      </header>

      <main className="max-w-5xl mx-auto">
        {stocks.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-kawaii-detail1">
            <p className="text-xl text-kawaii-detail2 font-sniglet mb-4">No estás trackeando ninguna empresa aún (´･ᴗ･ ` )</p>
            <p className="text-gray-500">Agrega una para comenzar a ver su precio en tiempo real.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {stocks.map(stock => (
                <StockCard 
                  key={stock.id} 
                  stock={stock} 
                  onDelete={() => deleteStock(stock.id)}
                  onToggleNotifications={() => toggleNotifications(stock.id)}
                  onUpdateLimits={(min, max) => updateStockLimits(stock.id, min, max)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddStockModal 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={addStock} 
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div 
              key={notif.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`p-4 rounded-2xl shadow-lg border-2 flex items-center gap-3 ${notif.type === 'min' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}
            >
              <AlertCircle className="w-5 h-5" />
              <p className="font-bold font-sniglet">{notif.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
