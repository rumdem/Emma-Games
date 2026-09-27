import React from 'react';
import { X, Sparkles, Wine, GlassWater } from 'lucide-react';
import { DRINKS_MENU } from '../data/loungeData';
import { DrinkItem } from '../types';

interface DrinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderDrink: (drink: DrinkItem) => void;
}

export const DrinkModal: React.FC<DrinkModalProps> = ({ isOpen, onClose, onOrderDrink }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#131724] to-[#0c0e14] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-900/30 flex items-center justify-between bg-[#171c2c]/60">
          <div className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-amber-200 tracking-wider">
                Salon d'Emma Carte des Vins
              </h2>
              <p className="text-xs text-amber-200/60 font-serif-jp">
                極上のお酒で、エマの心と銀座の夜を溶かしてくださいませ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-amber-200 hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drink List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 divide-y divide-amber-900/20">
          {DRINKS_MENU.map((drink) => (
            <div
              key={drink.id}
              className={`pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl transition-all ${
                drink.isSpecial
                  ? 'bg-gradient-to-r from-amber-950/30 to-amber-900/10 border border-amber-500/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl p-2 rounded-xl bg-amber-950/40 border border-amber-700/30 flex items-center justify-center">
                  {drink.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif-jp text-base font-semibold text-amber-100">
                      {drink.name}
                    </h3>
                    {drink.isSpecial && (
                      <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                        <Sparkles className="w-3 h-3" /> おすすめ
                      </span>
                    )}
                  </div>
                  <p className="font-cormorant text-xs text-amber-300/80 italic">{drink.frenchName}</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-serif-jp">
                    {drink.description}
                  </p>
                  <p className="text-[11px] text-amber-400/90 mt-1 font-serif-jp flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {drink.effect}
                  </p>
                </div>
              </div>

              {/* Price and Order Button */}
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-amber-900/20">
                <span className="font-cormorant text-xl font-bold text-amber-300">
                  {drink.price}
                </span>
                <button
                  onClick={() => {
                    onOrderDrink(drink);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-zinc-950 text-xs font-semibold font-serif-jp flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all transform active:scale-95 cursor-pointer"
                >
                  <GlassWater className="w-3.5 h-3.5" />
                  <span>エマに注ぐ</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-amber-900/30 bg-[#0c0e14] flex items-center justify-between text-xs text-amber-200/60 font-serif-jp">
          <span>※ 会計は銀座の夜に相応しくスマートに</span>
          <button
            onClick={onClose}
            className="text-amber-300 hover:underline"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
