// src/components/Common/TransactionModal.jsx
// دیالوگ وضعیت چرخه تراکنش: بررسی ← امضا در کیف‌پول ← در انتظار تایید ← تایید نهایی ← اکسپلورر

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  X,
  Send,
  Fuel,
  ShieldCheck
} from 'lucide-react';
import { ExplorerLink } from './ExplorerLink.jsx';

export function TransactionModal({
  isOpen,
  onClose,
  title = "تایید تراکنش",
  actionName = "اجرای تراکنش",
  amount,
  token = "ETH",
  recipient,
  status = "idle", // 'idle' | 'awaiting_signature' | 'pending' | 'confirmed' | 'error'
  txHash,
  blockNumber,
  gasUsed,
  errorMessage,
  technicalDetails,
  onConfirm,
}) {
  const [showTechDetails, setShowTechDetails] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0b1222] border border-blue-500/30 p-6 shadow-2xl shadow-blue-500/10 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
              TX
            </div>
            <h3 className="font-bold text-base text-white">{title}</h3>
          </div>
          {status !== 'pending' && status !== 'awaiting_signature' && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body Based on Lifecycle State */}
        <div className="py-5 space-y-4">
          
          {/* 1. Review State */}
          {status === 'idle' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">عملیات:</span>
                  <span className="font-semibold text-white">{actionName}</span>
                </div>
                {amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">مبلغ:</span>
                    <span className="font-bold font-mono text-cyan-300 force-ltr">{amount} {token}</span>
                  </div>
                )}
                {recipient && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">گیرنده:</span>
                    <span className="font-mono text-slate-300 text-[11px] force-ltr">{recipient.slice(0, 8)}...{recipient.slice(-6)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">شبکه:</span>
                  <span className="text-blue-400 font-mono">Arbitrum Sepolia (421614)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">کارمزد تخمینی گس:</span>
                  <span className="text-emerald-400 font-mono force-ltr">~0.00003 ETH (&lt;$0.01)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <span>
                  لطفاً پارامترها را بررسی کنید. با کلیک روی ادامه، کیف‌پول مرورگر شما درخواست امضا را نمایش خواهد داد.
                </span>
              </div>
            </div>
          )}

          {/* 2. Awaiting Signature */}
          {status === 'awaiting_signature' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 animate-pulse">
                <Send className="w-6 h-6 rotate-180" />
              </div>
              <h4 className="font-bold text-white text-base">کیف‌پول خود را بررسی کنید</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                لطفاً امضای تراکنش را در پنجره باز شده کیف‌پول خود تایید فرمایید.
              </p>
            </div>
          )}

          {/* 3. Pending Broadcast */}
          {status === 'pending' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-spin">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">تراکنش در حال ثبت در شبکه</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                در حال ارسال به ترتیب‌دهنده آربیتروم نیترو. تایید تراکنش در آربیتروم معمولاً کمتر از ۲ ثانیه طول می‌کشد!
              </p>
              {txHash && (
                <div className="pt-2">
                  <ExplorerLink type="tx" value={txHash} />
                </div>
              )}
            </div>
          )}

          {/* 4. Confirmed */}
          {status === 'confirmed' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">تراکنش با موفقیت تایید شد!</h4>
                <p className="text-xs text-emerald-400 mt-1">
                  نهایی‌شده و ثبت‌شده روی بلاک‌چین آربیتروم سپولیا.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-right space-y-2 text-xs">
                {txHash && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">هش تراکنش:</span>
                    <ExplorerLink type="tx" value={txHash} />
                  </div>
                )}
                {blockNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">شماره بلاک:</span>
                    <span className="text-white font-mono font-semibold">#{blockNumber}</span>
                  </div>
                )}
                {gasUsed && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">گس مصرفی:</span>
                    <span className="text-emerald-400 font-mono">{gasUsed} واحد</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Error */}
          {status === 'error' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-base">تراکنش انجام نشد</h4>
              <p className="text-xs text-red-300 max-w-xs mx-auto">
                {errorMessage || "تراکنش رد شد یا در حین اجرا با خطا مواجه گردید."}
              </p>

              {technicalDetails && (
                <div className="pt-2 text-right">
                  <button
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>جزئیات فنی خطا</span>
                    {showTechDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {showTechDetails && (
                    <pre className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-32 force-ltr">
                      {technicalDetails}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
          {status === 'idle' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                امضا و ارسال تراکنش
              </button>
            </>
          )}

          {status === 'confirmed' && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              ادامه یادگیری
            </button>
          )}

          {status === 'error' && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
            >
              بستن پنجره
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
