// src/components/Stages/StageGraduation.jsx
// فارغ‌التحصیلی و ورود به مین‌نت: از صفر مطلق تا فعال حرفه‌ای و آگاه وب۳

import React, { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  Fuel,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { arbitrumOne } from '../../config/chain.js';

export function StageGraduation({ stage }) {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { 
    completedStages, 
    completeStage, 
    isStageCompleted,
    xp,
    journeyLevel,
    levelTitle 
  } = useLearning();

  const completed = isStageCompleted(stage.id);

  const [checklist, setChecklist] = useState({
    wallet: true,
    gas: true,
    realTx: true,
    approvals: true,
    defi: true,
    security: true,
  });

  const handleClaimGraduation = () => {
    completeStage(stage.id);
  };

  const isArbitrumOne = isConnected && chain?.id === arbitrumOne.id;

  return (
    <div className="space-y-6 text-right">
      
      {/* Hero Graduation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-2 border-cyan-400/40 relative overflow-hidden shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
          <GraduationCap className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs uppercase text-cyan-400 font-bold tracking-widest px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40">
            نقطه عطف برنامه آموزشی
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
            آمادگی کامل برای ورود به مین‌نت حاصل شد
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
            شما با موفقیت مسیر صفر تا صد وب۳ را پیمودید؛ از شبیه‌سازی کلیدها تا تراکنش‌های واقعی، تبادل AMM، استیکینگ و شناسایی تهدیدات امنیتی.
          </p>
        </div>

        {/* User Stats Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <span className="text-amber-400 font-bold font-mono">{xp} کل امتیاز XP</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-bold">سطح {journeyLevel} ({levelTitle})</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-bold">{completedStages.length} ماژول تاییدشده</span>
        </div>
      </div>

      {/* Graduation Checklist */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>راستی‌آزمایی آمادگی برای فارغ‌التحصیلی</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { key: 'wallet', label: '✓ من مفاهیم کیف‌پول، کلیدها و کلمات بازیابی را درک می‌کنم' },
            { key: 'gas', label: '✓ من نحوه محاسبه کارمزد گس و بازدهی نیترو را می‌دانم' },
            { key: 'realTx', label: '✓ من تراکنش واقعی و تاییدشده روی زنجیره ثبت کردم' },
            { key: 'approvals', label: '✓ من سازوکار تایید مجوزهای ERC-20 و ریسک‌های آن را می‌دانم' },
            { key: 'defi', label: '✓ من نحوه کارکرد صرافی‌های AMM، استخرها و استیکینگ را درک می‌کنم' },
            { key: 'security', label: '✓ من روش‌های تشخیص فیشینگ و دفاع در برابر تهدیدات را آموختم' },
          ].map(item => (
            <div 
              key={item.key}
              className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-emerald-300 flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Arbitrum One Mainnet Transition Guidelines */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>مرور اصول کار در شبکه اصلی آربیتروم وان (Arbitrum One)</span>
          </h4>
          <span className="font-mono text-xs text-slate-400">Chain ID 42161</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          آربیتروم وان شبکه اصلی لایه ۲ است که دارایی‌های واقعی در آن مبادله می‌شوند. هنگام کاوش در برنامه‌های اصلی دیفای (Uniswap، Camelot، GMX، Aave)، همیشه این ۳ اصل طلایی را به خاطر بسپارید:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">۱. دارایی و کارمزد واقعی</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              اتریوم هزینه مالی واقعی دارد. همیشه آدرس مقصد، مبلغ و اعشار را دوبار بررسی کنید.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400">۲. شبیه‌سازی پیش از امضا</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              از کیف‌پول‌هایی مثل Rabby استفاده کنید که تغییرات موجودی را پیش از امضا شبیه‌سازی می‌کنند.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400">۳. لغو دوره‌ای مجوزها</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              مجوزهای قدیمی را به طور منظم در ابزارهایی مانند Revoke.cash بررسی و باطل نمایید.
            </p>
          </div>
        </div>

        {/* Optional Network Switch (Educational only) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="font-bold text-white">مشاهده شبکه آربیتروم وان</span>
            <p className="text-[11px] text-slate-400">تغییر شبکه کیف‌پول برای مشاهده وضعیت اصلی (بدون نیاز به واریز هیچ وجهی).</p>
          </div>
          <button
            onClick={() => switchChain({ chainId: arbitrumOne.id })}
            disabled={!isConnected || isArbitrumOne}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            {isArbitrumOne ? "متصل به آربیتروم وان" : "تغییر به آربیتروم وان"}
          </button>
        </div>
      </div>

      {/* Graduation Claim Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          امتیاز فارغ‌التحصیلی: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleClaimGraduation}
          className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xl active:scale-95 cursor-pointer ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{completed ? "تبریک! شما فارغ‌التحصیل شدید (با درجه عالی)" : "دریافت نشان افتخار فارغ‌التحصیل وب۳ آربیتروم"}</span>
        </button>
      </div>

    </div>
  );
}
