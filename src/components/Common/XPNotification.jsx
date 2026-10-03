// src/components/Common/XPNotification.jsx
// اعلان شناور نوتیفیکیشن برای دریافت امتیاز XP، تکمیل مراحل و پیام‌های وضعیت

import React from 'react';
import { Sparkles, CheckCircle2, Info, X } from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';

export function XPNotification() {
  const { recentNotification } = useLearning();

  if (!recentNotification) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-bounce transition-all text-right">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 text-white backdrop-blur-md">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shrink-0">
          {recentNotification.type === 'success' ? (
            <Sparkles className="w-4 h-4" />
          ) : (
            <Info className="w-4 h-4" />
          )}
        </div>
        <div>
          <div className="font-bold text-xs text-cyan-300">
            {recentNotification.title}
          </div>
          <div className="text-xs text-slate-200 mt-0.5">
            {recentNotification.message}
          </div>
        </div>
      </div>
    </div>
  );
}
