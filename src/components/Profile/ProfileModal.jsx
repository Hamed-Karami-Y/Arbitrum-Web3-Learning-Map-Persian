// src/components/Profile/ProfileModal.jsx
// نمای پروفایل کاربر: میزان پیشرفت، امتیاز XP، دستاوردهای آن‌چین و تاریخچه تراکنش‌ها

import React from 'react';
import { useAccount } from 'wagmi';
import { 
  User, 
  Award, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function ProfileModal() {
  const { address, isConnected, chain } = useAccount();
  const { 
    xp, 
    journeyLevel, 
    levelTitle, 
    progressPercent, 
    completedStages, 
    coreCompletedCount, 
    totalCoreStages,
    txHistory,
    setCurrentView 
  } = useLearning();

  const achievements = [
    {
      id: "ach-1",
      title: "نخستین گام در رمزنگاری",
      desc: "تکمیل مرحله ۰ محیط آزمایشی و تسلط بر جفت‌کلیدهای شبیه‌سازی‌شده",
      unlocked: completedStages.includes("stage-0"),
      icon: Sparkles,
      color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
    },
    {
      id: "ach-2",
      title: "پیشگام آن‌چین آربیتروم",
      desc: "ارسال اولین تراکنش واقعی تاییدشده روی شبکه تستی آربیتروم سپولیا",
      unlocked: completedStages.includes("stage-4"),
      icon: Flame,
      color: "text-blue-400 bg-blue-500/20 border-blue-500/30"
    },
    {
      id: "ach-3",
      title: "تامین‌کننده نقدینگی دیفای",
      desc: "تعامل با صرافی غیرمتمرکز خودکار (AMM) و تامین نقدینگی در استخر",
      unlocked: completedStages.includes("stage-9"),
      icon: Compass,
      color: "text-purple-400 bg-purple-500/20 border-purple-500/30"
    },
    {
      id: "ach-4",
      title: "دیده‌بان تاییدشده امنیت",
      desc: "پاسخ صحیح به تمام سناریوهای فیشینگ و مجوزها در آزمایشگاه تهدیدات",
      unlocked: completedStages.includes("stage-13"),
      icon: ShieldCheck,
      color: "text-amber-400 bg-amber-500/20 border-amber-500/30"
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-bold font-mono text-xl shrink-0">
            {address ? address.slice(2, 4).toUpperCase() : "XP"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : "کاوشگر مهمان"}
              </h2>
              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-blue-500/20 text-cyan-400 border border-blue-500/40">
                {chain?.name || "Arbitrum Sepolia"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              سطح {journeyLevel} • {levelTitle}
            </p>
          </div>
        </div>

        {/* Stats Counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-400 text-[10px] block">کل امتیاز XP</span>
            <span className="text-amber-400 font-bold text-base">{xp}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-400 text-[10px] block">تکمیل‌شده</span>
            <span className="text-emerald-400 font-bold text-base">{coreCompletedCount} / {totalCoreStages}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[90px]">
            <span className="text-slate-400 text-[10px] block">میزان تسلط</span>
            <span className="text-cyan-400 font-bold text-base">{progressPercent}٪</span>
          </div>
        </div>
      </div>

      {/* Earned Achievements Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>مدال‌ها و دستاوردهای کسب‌شده</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {achievements.filter(a => a.unlocked).length} از {achievements.length} باز شده
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {achievements.map(ach => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border text-right transition-all ${
                  ach.unlocked 
                    ? 'bg-slate-950 border-slate-700 shadow-md' 
                    : 'bg-slate-950/40 border-slate-900 opacity-40'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${ach.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-white mb-1">{ach.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Onchain Transactions Log */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>دفترکل تراکنش‌های ثبت‌شده آموزشی شما</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {txHistory.length} تراکنش ثبت‌شده
          </span>
        </div>

        {txHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 space-y-2">
            <p>هنوز تراکنشی در این مرورگر ثبت نشده است.</p>
            <button
              onClick={() => setCurrentView('map')}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              شروع مرحله ۴ جهت اجرای اولین تراکنش آن‌چین ←
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {txHistory.map(tx => (
              <div 
                key={tx.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{tx.type}</span>
                    {tx.amount && <span className="text-cyan-300 font-mono">({tx.amount})</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {tx.timestamp} {tx.blockNumber && `• بلاک #${tx.blockNumber}`}
                  </div>
                </div>

                {tx.hash && (
                  <ExplorerLink type="tx" value={tx.hash} label="مشاهده در آربیسکن ↗" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
