// src/components/Stages/StageGas.jsx
// مرحله ۳: کارمزد گس و بهره‌وری نیترو - درک معیارهای گس و دریافت اتریوم تستی

import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { 
  Fuel, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Coins,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { FAUCET_RESOURCES } from '../../config/demoAddresses.js';
import { APP_CONFIG } from '../../config/environment.js';

export function StageGas({ stage }) {
  const { address, isConnected } = useAccount();
  const { data: balanceData, isLoading: isBalanceLoading, refetch } = useBalance({
    address,
    chainId: arbitrumSepolia.id,
  });

  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const ethBalance = parseFloat(balanceData?.formatted || "0");
  const hasGas = ethBalance > 0.0001;

  const handleVerify = () => {
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Educational Gas Mechanics */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Fuel className="w-4 h-4" />
          <span>آشنایی با مفهوم گس در آربیتروم</span>
        </h4>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          هر اقدام روی بلاک‌چین به قدرت پردازشی گره‌ها نیاز دارد. گس کارمزدی است که با ارز بومی <strong>ETH</strong> برای پردازش تراکنش شما پرداخت می‌شود. در معماری آربیتروم نیترو، هزینه گس به دو بخش تقسیم می‌گردد:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-right">
            <span className="font-bold text-white">۱. گس پردازشی لایه ۲</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              هزینه اجرای دستورات قرارداد هوشمند در لایه ۲ آربیتروم؛ بسیار ناچیز و معمولاً کمتر از ۰.۱ Gwei.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-right">
            <span className="font-bold text-white">۲. هزینه ثبت داده‌ها در لایه ۱</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              هزینه ارسال داده‌های فشرده‌شده تراکنش به اتریوم لایه ۱ جهت تضمین دسترسی دائمی و امنیت مطلق.
            </p>
          </div>
        </div>
      </div>

      {/* User Balance Check */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400">
            موجودی اتریوم شما در آربیتروم سپولیا
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-0.5 flex items-center gap-2 force-ltr">
            <span>{isBalanceLoading ? "در حال دریافت..." : `${ethBalance.toFixed(5)} ETH`}</span>
            <button
              onClick={() => refetch()}
              className="text-slate-500 hover:text-cyan-400 text-xs p-1 cursor-pointer"
              title="به‌روزرسانی موجودی"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {hasGas ? "شما موجودی کافی برای پرداخت کارمزد تراکنش‌های تستی را دارید!" : "برای ثبت تراکنش واقعی در مرحله بعدی، نیاز به دریافت مقداری اتریوم تستی دارید."}
          </p>
        </div>

        {/* Primary Faucet Button */}
        <a
          href={APP_CONFIG.faucetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <Coins className="w-4 h-4" />
          <span>دریافت اتریوم تستی رایگان</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Recommended Faucets List */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h5 className="text-xs uppercase text-slate-400 font-semibold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>شیرهای آب (فاست‌های) معتبر آربیتروم سپولیا</span>
        </h5>

        <div className="space-y-2">
          {FAUCET_RESOURCES.map((faucet, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">{faucet.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{faucet.description}</div>
              </div>
              <a
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800/40"
              >
                <span>باز کردن</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Completion & XP Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          پاداش تکمیل مرحله ۳: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleVerify}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-cyan-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{completed ? "تکمیل شده (دریافت +۵۰ XP)" : "تایید شناخت کارمزد گس و باز کردن مرحله ۴"}</span>
        </button>
      </div>

    </div>
  );
}
