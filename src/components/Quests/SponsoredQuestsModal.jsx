// src/components/Quests/SponsoredQuestsModal.jsx
// ماموریت‌های دارای حامی: معماری آینده‌نگر برای ماژول‌های آموزشی شرکای اکوسیستم

import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  ChevronLeft,
  BookOpen,
  Info
} from 'lucide-react';
import { SPONSORED_QUESTS } from '../../data/sponsoredQuests.js';
import { useLearning } from '../../context/LearningContext.jsx';

export function SponsoredQuestsModal() {
  const { setCurrentView } = useLearning();
  const [selectedQuest, setSelectedQuest] = useState(null);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest text-purple-300 font-bold px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/40">
              ماژول‌های شرکای اکوسیستم
            </span>
            <span className="text-xs text-slate-500">آکادمی به عنوان سرویس (AaaS)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ماموریت‌های تحت حمایت پروتکل‌ها
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            پروتکل‌های مطرح اکوسیستم آربیتروم ماژول‌های یادگیری تعاملی و عملی را حمایت می‌کنند. وظایف را کامل کنید، قراردادها را بررسی کنید و امتیاز XP اضافی به دست آورید.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="text-white font-bold">معماری سازمانی آینده‌نگر</div>
          <p className="text-[11px] text-slate-500">
            API باز برای گرنت‌های توسعه‌دهندگان و آنبوردینگ پروژه‌های جدید.
          </p>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SPONSORED_QUESTS.map(quest => (
          <div 
            key={quest.id}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] shadow-xl text-right"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  {quest.badgeText}
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  +{quest.rewardXP} XP
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">
                  {quest.sponsorName}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">
                  {quest.title}
                </h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {quest.description}
              </p>

              {/* Curriculum Bullet Points */}
              <div className="pt-2 space-y-1.5 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-semibold">سرفصل‌های آموزشی:</span>
                {quest.curriculum.map((topic, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                وضعیت: <strong className="text-purple-300">{quest.status}</strong>
              </span>
              <button
                onClick={() => setSelectedQuest(quest)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>مشاهده جزئیات</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quest Preview Modal */}
      {selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090f1d] border border-purple-500/40 p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] text-purple-400">{selectedQuest.sponsorName}</span>
                <h3 className="font-bold text-base text-white">{selectedQuest.title}</h3>
              </div>
              <button onClick={() => setSelectedQuest(null)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedQuest.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-cyan-300 block text-[11px]">آنچه در این ماموریت خواهید آموخت:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {selectedQuest.curriculum.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-purple-400" />
              <span>این پوسته ماژول‌های حمایتی برای دوره‌های توسعه‌دهندگان آتی فعال خواهد شد.</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedQuest(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
