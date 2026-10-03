// src/pages/LandingPage.jsx
// صفحه فرود و معرفی: از صفر تا آن‌چین

import React from 'react';
import { 
  Compass, 
  Wallet, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Layers, 
  Coins, 
  Lock 
} from 'lucide-react';
import { useLearning } from '../context/LearningContext.jsx';
import { ZONES } from '../data/stages.js';

export function LandingPage() {
  const { setCurrentView, openStage } = useLearning();

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-right">
      
      {/* Background ambient cartography glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 via-cyan-500/15 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto pt-6 sm:pt-12 space-y-6">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>نسخه اختصاصی آربیتروم بویلداتون ۲۰۲۶</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          از صفر تا <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">آن‌چین</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          وب۳ را با تجربه مستقیم و عملی بیاموزید. از محیط آزمایشی امن آغاز کنید، به آربیتروم سپولیا متصل شوید و مسیر تسلط کامل برای ورود به مین‌نت را طی کنید.
        </p>

        {/* Core Product Loop */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm font-medium text-slate-300">
          <span className="text-cyan-400 font-bold">یادگیری</span>
          <span className="text-slate-600 rotate-180">→</span>
          <span className="text-blue-400 font-bold">تمرین</span>
          <span className="text-slate-600 rotate-180">→</span>
          <span className="text-purple-400 font-bold">اجرا</span>
          <span className="text-slate-600 rotate-180">→</span>
          <span className="text-emerald-400 font-bold">راستی‌آزمایی</span>
          <span className="text-slate-600 rotate-180">→</span>
          <span className="text-amber-400 font-bold">کسب امتیاز XP</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => {
              setCurrentView('map');
              openStage('stage-0');
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:via-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>شروع ماجراجویی</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('map')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>مشاهده نقشه یادگیری</span>
          </button>
        </div>

      </div>

      {/* Learning Path Preview Grid */}
      <div className="relative z-10 pt-16 pb-8">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
            مسیر آموزشی گام‌به‌گام
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            محیط آزمایشی ⬅ آربیتروم سپولیا ⬅ آماده برای مین‌نت
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
              ۰۱
            </div>
            <h4 className="text-lg font-bold text-white">منطقه ۰: محیط آزمایشی</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              شبیه‌سازی محلی کاملاً بدون ریسک مالی. تسلط بر کلیدهای عمومی و خصوصی، کلمات بازیابی و امضاهای رمزنگاری با حساب‌های آزمایشی.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-500/30 space-y-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
              ۰۲
            </div>
            <h4 className="text-lg font-bold text-white">شبکه تستی آربیتروم سپولیا</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              اتصال کیف‌پول‌های مرورگر، دریافت اتریوم تستی رایگان، اجرای اولین تراکنش واقعی، معامله در صرافی‌های غیرمتمرکز AMM و استیکینگ توکن‌های LEARN.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">
              ۰۳
            </div>
            <h4 className="text-lg font-bold text-white">امنیت و آمادگی کامل برای مین‌نت</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تکمیل شبیه‌ساز تعاملی آزمایشگاه تهدیدات: کشف امضاهای فیشینگ، تحلیل تخلیه‌کننده‌های مجوز نامحدود و تایید چک‌لیست فارغ‌التحصیلی.
            </p>
          </div>
        </div>
      </div>

      {/* Community Disclaimer Footer */}
      <footer className="relative z-10 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 space-y-2">
        <p>
          این یک پروژه آموزشی و مستقل است که برای هکاتون آربیتروم ساخته شده و محصول رسمی بنیاد آربیتروم نیست.
        </p>
        <p className="text-[11px] text-slate-600">
          توکن‌های تستی هیچ ارزش مادی ندارند • هرگز عبارت بازیابی یا کلید خصوصی خود را با هیچ شخص یا سایتی به اشتراک نگذارید
        </p>
      </footer>

    </div>
  );
}
