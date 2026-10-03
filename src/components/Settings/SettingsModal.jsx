// src/components/Settings/SettingsModal.jsx
// تنظیمات پلتفرم، مشخصات فنی شبکه و مدیریت پیشرفت محلی

import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { 
  Settings, 
  RotateCcw, 
  Server, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ARBITRUM_SEPOLIA_CHAIN_ID } from '../../config/chain.js';
import { CONTRACT_ADDRESSES, EXPLORER_BASE_URL } from '../../config/contracts.js';
import { APP_CONFIG } from '../../config/environment.js';

export function SettingsModal() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { resetProgress, setCurrentView } = useLearning();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-right">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>پیکربندی پلتفرم و تنظیمات شبکه</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            نقشه یادگیری وب۳ آربیتروم • نسخه {APP_CONFIG.version} ({APP_CONFIG.buildTarget})
          </p>
        </div>
      </div>

      {/* Network Specifications */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>زیرساخت فعال شبکه آزمایشی</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">شبکه اصلی برنامه</span>
            <div className="text-white font-bold font-mono">Arbitrum Sepolia</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">شناسه زنجیره (Chain ID)</span>
            <div className="text-cyan-300 font-bold font-mono">{ARBITRUM_SEPOLIA_CHAIN_ID} (0x66eee)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">نقطه پایانی RPC</span>
            <div className="text-slate-300 truncate font-mono force-ltr">https://sepolia-rollup.arbitrum.io/rpc</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">مرورگر بلاک‌چین</span>
            <div className="text-cyan-400 truncate flex items-center gap-1 font-mono force-ltr">
              <span>{EXPLORER_BASE_URL}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Deployed Contract Registry */}
        <div className="pt-2 space-y-2">
          <span className="text-[11px] text-slate-400 block font-semibold">
            رجیستری قراردادهای هوشمند مستقر در آربیتروم سپولیا:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
              <div key={name} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between items-center">
                <span className="text-slate-400">{name}:</span>
                <span className="text-cyan-300 force-ltr">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Progress Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-red-500/20 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>مدیریت پیشرفت محلی دوره</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          تمام مراحل گذرانده‌شده و امتیازهای شما در مرورگر فعلی‌تان ذخیره شده‌اند. چنانچه مایلید کل نقشه را از مرحله صفر شروع کنید، می‌توانید پیشرفت خود را ریست نمایید.
        </p>

        {confirmReset ? (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>آیا از پاک کردن کامل امتیازها و مراحل تکمیل‌شده مطمئن هستید؟</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                بله، همه را بازنشانی کن
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی پیشرفت محلی</span>
          </button>
        )}
      </div>

      {/* Disclaimers & Security Rules */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs text-slate-400 leading-relaxed">
        <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>سلب مسئولیت‌ها و اصول امنیتی</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-slate-400 text-[11px]">
          <li><strong>توکن‌های تستی هیچ ارزش مادی ندارند.</strong> به هیچ عنوان اقدام به خرید یا فروش آن‌ها نکنید.</li>
          <li><strong>این نرم‌افزار آموزشی است و هیچ‌گونه مشاوره سرمایه‌گذاری یا مالی نیست.</strong></li>
          <li><strong>هرگز دارایی‌های واقعی را به قراردادهای این پروژه واریز نکنید.</strong></li>
          <li><strong>هرگز عبارت بازیابی ۱۲ یا ۲۴ کلمه‌ای یا کلید خصوصی خود را در هیچ سایتی وارد نکنید.</strong></li>
          <li>همیشه پیش از امضای هر تراکنش، آدرس شبکه، گیرنده، توکن، سقف مجوز و کارمزد را با دقت بررسی کنید.</li>
        </ul>
      </div>

    </div>
  );
}
