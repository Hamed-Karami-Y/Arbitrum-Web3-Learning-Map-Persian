// src/components/Stages/StageFirstTx.jsx
// مرحله ۴: اولین تراکنش آن‌چین - چرخه کامل اجرای تراکنش واقعی روی شبکه آزمایشی

import React, { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { DEMO_RECIPIENTS } from '../../config/demoAddresses.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageFirstTx({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  
  const [recipient, setRecipient] = useState(address || DEMO_RECIPIENTS[0].address);
  const [amount, setAmount] = useState("0.0001");
  const [txSubmitted, setTxSubmitted] = useState(false);

  const completed = isStageCompleted(stage.id);

  // Wagmi send transaction hooks
  const { 
    sendTransaction, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: sendError 
  } = useSendTransaction();

  const { 
    data: receipt, 
    isLoading: isPendingBroadcast, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // When confirmed, award XP and record transaction
  useEffect(() => {
    if (isConfirmed && receipt && txHash) {
      completeStage(stage.id, {
        hash: txHash,
        type: "اولین تراکنش آن‌چین",
        amount: `${amount} ETH`,
        recipient,
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        status: "تاییدشده",
      });
    }
  }, [isConfirmed, receipt, txHash]);

  const handleSend = () => {
    if (!recipient || !amount) return;
    try {
      sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
      setTxSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Celebration Banner if already completed */}
      {completed ? (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">
            دستاورد بزرگ: شما رسماً وارد دنیای آن‌چین شدید!
          </h4>
          <p className="text-xs text-emerald-200/90 max-w-md mx-auto leading-relaxed">
            «شما نخستین تراکنش واقعی خود را روی بلاک‌چین ثبت کردید.» این رکورد برای همیشه در تاریخچه تغییرناپذیر آربیتروم سپولیا ماندگار است.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-cyan-300 font-medium">
              نخستین گام در دنیای بلاک‌چین واقعی
            </div>
            <p className="text-slate-300 leading-relaxed">
              یک تراکنش واقعی تستی با مقدار <strong>۰.۰۰۰۱ اتریوم تستی</strong> ارسال کنید. می‌توانید آن را به آدرس خودتان بازگردانید یا به آدرس هم‌دوره‌ای آموزشی ارسال نمایید.
            </p>
          </div>
        </div>
      )}

      {/* Transaction Setup Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <span>آماده‌سازی تراکنش</span>
        </h4>

        {/* Recipient Selection */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400">آدرس گیرنده</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isAwaitingSignature || isPendingBroadcast}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none force-ltr"
              placeholder="0x..."
            />
            {address && (
              <button
                type="button"
                onClick={() => setRecipient(address)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                ارسال به خودم
              </button>
            )}
          </div>

          {/* Quick Demo Choices */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 ml-1">آدرس‌های دمو:</span>
            {DEMO_RECIPIENTS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRecipient(demo.address)}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-blue-950 border border-slate-800 text-[11px] text-cyan-300 transition-colors cursor-pointer"
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">مبلغ (ETH)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isAwaitingSignature || isPendingBroadcast}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none force-ltr"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSend}
          disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || completed}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isAwaitingSignature ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>تایید امضا در پنجره کیف‌پول...</span>
            </>
          ) : isPendingBroadcast ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>در حال نهایی‌سازی در آربیتروم نیترو...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>ارسال ۰.۰۰۰۱ اتریوم روی شبکه آربیتروم</span>
            </>
          )}
        </button>

        {sendError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{sendError.message.includes("User rejected") ? "امضای تراکنش توسط کاربر در کیف‌پول لغو شد." : sendError.message}</span>
          </div>
        )}
      </div>

      {/* Transaction Details & Lifecycle Viewer */}
      {txHash && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-cyan-300">
              مشخصات رسید تراکنش آن‌چین
            </h5>
            <span className={`px-2 py-0.5 rounded text-[10px] ${
              isConfirmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300 animate-pulse'
            }`}>
              {isConfirmed ? 'نهایی‌شده' : 'در انتظار تایید'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">هش تراکنش:</span>
              <ExplorerLink type="tx" value={txHash} />
            </div>
            {receipt?.blockNumber && (
              <div className="flex justify-between">
                <span className="text-slate-400">شماره بلاک:</span>
                <span className="text-white font-mono">#{receipt.blockNumber.toString()}</span>
              </div>
            )}
            {receipt?.gasUsed && (
              <div className="flex justify-between">
                <span className="text-slate-400">گس مصرفی:</span>
                <span className="text-emerald-400 font-mono">{receipt.gasUsed.toString()} واحد</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">شبکه:</span>
              <span className="text-blue-400">Arbitrum Sepolia</span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <ExplorerLink 
              type="tx" 
              value={txHash} 
              label="مشاهده در مرورگر بلاک‌چین آربیسکن" 
              className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-xs" 
            />
          </div>
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">پاداش این مرحله: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>مرحله ۵ باز شد: توکن‌های ERC-20</span>
          </span>
        )}
      </div>

    </div>
  );
}
