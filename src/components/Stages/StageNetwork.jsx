// src/components/Stages/StageNetwork.jsx
// مرحله ۲: شبکه و معماری نیترو - بررسی دقیق رول‌آپ‌های لایه ۲، RPC و اکسپلوررها

import React from 'react';
import { useAccount, useBlockNumber } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { 
  Layers, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ARBITRUM_SEPOLIA_CHAIN_ID } from '../../config/chain.js';
import { EXPLORER_BASE_URL } from '../../config/contracts.js';

export function StageNetwork({ stage }) {
  const { isConnected, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ chainId: arbitrumSepolia.id, watch: true });
  const { completeStage, isStageCompleted } = useLearning();

  const completed = isStageCompleted(stage.id);
  const isCorrectNetwork = isConnected && chain?.id === ARBITRUM_SEPOLIA_CHAIN_ID;

  const handleVerify = () => {
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Visual Nitro Architecture Diagram */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 space-y-4">
        <h4 className="font-bold text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>معماری رول‌آپ آربیتروم نیترو (Arbitrum Nitro)</span>
        </h4>
        
        {/* Interactive Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-right">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-mono">۱</span>
              <span>ترتیب‌دهنده لایه ۲ (Sequencer)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              تراکنش‌ها را در کسری از ثانیه دریافت، ترتیب‌گذاری و تایید اولیه می‌نماید.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-right">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-mono">۲</span>
              <span>موتور محاسباتی نیترو و WASM</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              بایت‌کدهای EVM را با هسته پرسرعت وب‌اسمبلی (WebAssembly) با بازدهی خارق‌العاده اجرا می‌کند.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-right">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-mono">۳</span>
              <span>ارسال بسته‌ای به لایه ۱ (L1 Post)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              داده‌های تراکنش‌ها را فشرده کرده و روی لایه ۱ اتریوم ثبت می‌کند تا امنیت اتریوم حفظ شود.
            </p>
          </div>
        </div>
      </div>

      {/* Network Parameters Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>مشخصات فنی شبکه آزمایشی فعال</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">نام شبکه</span>
            <div className="text-white font-bold font-mono">Arbitrum Sepolia</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">شناسه زنجیره (Chain ID)</span>
            <div className="text-cyan-300 font-bold font-mono">421614 (0x66eee)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">نقطه پایانی RPC</span>
            <div className="text-slate-300 truncate font-mono force-ltr">https://sepolia-rollup.arbitrum.io/rpc</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block">ارتفاع لحظه‌ای بلاک نیترو</span>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>#{blockNumber ? blockNumber.toString() : "در حال همگام‌سازی..."}</span>
            </div>
          </div>
        </div>

        {/* Explorer Reference */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">مرورگر بلاک‌چین (Arbiscan)</div>
            <p className="text-[11px] text-slate-400">بررسی مستقل بلاک‌ها، تراکنش‌ها و کارمزدها در آربیسکن.</p>
          </div>
          <a
            href={EXPLORER_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/50"
          >
            <span>مشاهده آربیسکن</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Completion & XP Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          پاداش تکمیل مرحله ۲: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
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
          <span>{completed ? "تکمیل شده (دریافت +۷۵ XP)" : "تایید تسلط بر شبکه و باز کردن مرحله ۳"}</span>
        </button>
      </div>

    </div>
  );
}
