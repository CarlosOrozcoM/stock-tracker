import React, { useState } from 'react';
import { Trash2, Bell, BellOff, Edit3, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Stock } from '../types';
import { isMarketOpen } from '../utils/market';
import { div } from 'motion/react-client';

export function StockCard({ stock, onDelete, onToggleNotifications, onUpdateLimits, exchangeRate, key }: { 
  stock: Stock, 
  onDelete: () => void, 
  onToggleNotifications: () => void,
  onUpdateLimits: (min: number, max: number, myStocks: number) => void,
  exchangeRate: number,
  key?: React.Key
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMin, setEditMin] = useState((stock.minLimit ?? 0).toString());
  const [editMax, setEditMax] = useState((stock.maxLimit ?? 0).toString());
  const [editMyStocks, setEditMyStocks] = useState((stock.myStocks ?? 0).toString());

  const isBelowExpected = stock.currentPrice < (stock.minLimit ?? 0);
  const isAboveExpected = stock.currentPrice > (stock.maxLimit ?? 0);
  const market = isMarketOpen();

  const getStatusClass = () => {
    if (!market.isOpen) return 'stock-status-wait';
    if (isBelowExpected) return 'stock-status-bad';
    return 'stock-status-good';
  };

  const handleSave = () => {
    const min = parseFloat(editMin);
    const max = parseFloat(editMax);
    const qty = parseFloat(editMyStocks);
    if (!isNaN(min) && !isNaN(max) && !isNaN(qty)) {
      onUpdateLimits(min, max, qty);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditMin(stock.minLimit.toString());
    setEditMax(stock.maxLimit.toString());
    setEditMyStocks(stock.myStocks.toString());
    setIsEditing(false);
  };
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-white rounded-3xl p-6 shadow-sm border-2 border-kawaii-bg1 relative overflow-hidden group"
    >
      {/* Decorative blob */}
      <div className="absolute -top-4 -right-10 w-32 h-32 bg-kawaii-bg1 rounded-full opacity-50 z-0"></div>
      <div className="absolute top-16 -left-10 w-24 h-24 bg-kawaii-bg1 rounded-full opacity-50 z-0"></div>
      <div className="absolute top-24  -right-10 w-24 h-24 bg-kawaii-bg1 rounded-full opacity-50 z-0"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-end">
            <h2 className="text-3xl font-sniglet text-kawaii-dark">{stock.company}</h2>
            <p className="text-xs font-sniglet text-kawaii-dark">({stock.symbol})</p>
            
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onToggleNotifications}
              className={`p-2 rounded-full transition-colors shake ${stock.notificationsEnabled ? 'bg-kawaii-accent1 text-kawaii-dark' : 'bg-gray-100 text-gray-400'}`}
              title={stock.notificationsEnabled ? "Notificaciones activadas" : "Notificaciones desactivadas"}
            >
              {stock.notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>
            <button 
              onClick={onDelete}
              className="p-2 rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-colors shake"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="my-3 flex flex-col items-center">
              <div className= {`mx-auto stock-status-icon ${getStatusClass()}`}></div>
              {!market.isOpen && (
                <p className="text-xs font-bold text-kawaii-detail2 mt-1">Market cerrado</p>
              )}
        </div>

        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider ">Precio Actual</p>
          <motion.p 
            key={stock.currentPrice}
            initial={{ color: stock.currentPrice > stock.basePrice ? '#22c55e' : '#ef4444' }}
            animate={{ color: isBelowExpected ? '#ef4444' : isAboveExpected ? '#22c55e' : '#000000' }}
            className={`text-3xl font-sniglet`}
          >
            ${stock.currentPrice.toFixed(2)}
          </motion.p>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3 bg-kawaii-bg1/30 p-3 rounded-2xl border border-kawaii-accent2 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-600">Mínimo ($):</label>
              <input 
                type="number" 
                step="0.01" 
                value={editMin} 
                onChange={e => setEditMin(e.target.value)} 
                className="w-24 text-right rounded-xl border-2 border-kawaii-detail1 p-1 text-sm bg-white focus:outline-none focus:border-kawaii-accent2 font-sniglet" 
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-600">Máximo ($):</label>
              <input 
                type="number" 
                step="0.01" 
                value={editMax} 
                onChange={e => setEditMax(e.target.value)} 
                className="w-24 text-right rounded-xl border-2 border-kawaii-detail1 p-1 text-sm bg-white focus:outline-none focus:border-kawaii-accent2 font-sniglet" 
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-600">Mis Stocks:</label>
              <input 
                type="number" 
                step="1" 
                value={editMyStocks} 
                onChange={e => setEditMyStocks(e.target.value)} 
                className="w-24 text-right rounded-xl border-2 border-kawaii-detail1 p-1 text-sm bg-white focus:outline-none focus:border-kawaii-accent2 font-sniglet" 
              />
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <button onClick={handleCancel} className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors" title="Cancelar">
                <X className="w-4 h-4" />
              </button>
              <button onClick={handleSave} className="p-2 rounded-xl bg-kawaii-accent1 hover:bg-kawaii-accent2 text-kawaii-dark transition-colors" title="Guardar">
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div  className=" text-sm bg-kawaii-bg2 px-3 pt-3 rounded-2xl border border-kawaii-detail1 mb-4 relative group/limits">
            <div className= "flex items-center justify-between">
              <div>
                <p className="  text-kawaii-detail2">Mis Acciones:</p>
                <p className="font-bold">{stock.myStocks ?? 0}</p>
              </div>

              <div className="text-right">
                <p className="text-kawaii-detail2">Valor Total (MXN)</p>
                <p className="font-bold text-kawaii-dark">
                  ${((stock.myStocks ?? 0) * stock.currentPrice * exchangeRate).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-sm border border-kawaii-detail1 text-kawaii-detail2 hover:text-kawaii-dark opacity-0 group-hover/limits:opacity-100 transition-all"
                title="Editar límites"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center mt-3">
              <p className="text-[12px] text-kawaii-detail2">1USD : {exchangeRate?.toFixed(2)}MNX</p>    
            </div>
                
          </div>
        )}
      </div>
    </motion.div>
  );
}
