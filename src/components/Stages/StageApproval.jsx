// src/components/Stages/StageApproval.jsx
// مرحله ۷: چرخه تایید و سقف برداشت (Allowance) - تایید قرارداد دیفای و تمرین ابطال امن مجوز (Revoke)

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowDown,
  RefreshCw,
  Slash
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageApproval({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [approveAmount, setApproveAmount] = useState("100");

  // Read current allowance for SimpleAMM
  const { data: allowance, refetch: refetchAllowance, isLoading: isAllowanceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.SimpleAMM] : undefined,
  });

  // Write approve contract
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: approveError 
  } = useWriteContract();

  const { 
    isLoading: isPendingBroadcast, 
    isSuccess: isConfirmed, 
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed && txHash) {
      refetchAllowance();
      completeStage(stage.id, {
        hash: txHash,
        type: `به‌روزرسانی سقف مجوز (Approval)`,
        spender: CONTRACT_ADDRESSES.SimpleAMM,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "تاییدشده"
      });
    }
  }, [isConfirmed, txHash]);

  const handleApprove = (amountToApprove) => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.LearnToken,
        abi: CONTRACT_ABIS.LearnToken,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.SimpleAMM, parseUnits(amountToApprove, 18)],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevoke = () => {
    handleApprove("0");
  };

  const formattedAllowance = allowance ? formatUnits(allowance, 18) : "0.0";
  const numAllowance = parseFloat(formattedAllowance);
  const hasAllowance = numAllowance > 0;

  return (
    <div className="space-y-6 text-right">
      
      {/* Key Principle Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-300 font-medium">
            قانون طلایی وب۳: هرگز بیش از حد نیاز مجوز صادر نکنید
          </div>
          <p className="text-amber-200/90 leading-relaxed">
            برخلاف انتقال‌های ارز بومی، قراردادهای هوشمند نمی‌توانند بدون هماهنگی قبلی توکن‌های ERC-20 شما را برداشت کنند. شما ابتدا باید دستور <code className="text-amber-300 font-mono">approve(spender, amount)</code> را فراخوانی کنید تا یک سقف مشخص تعیین شود. همیشه از صدور مجوزهای نامحدود در پروتکل‌های ناشناس پرهیز کنید!
          </p>
        </div>
      </div>

      {/* Visual Architectural Diagram */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="font-bold text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          <span>چرخه تایید و سقف برداشت (Allowance Lifecycle)</span>
        </h4>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs py-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 text-center w-full">
            <span className="text-cyan-400 font-bold block mb-1">کیف‌پول شما</span>
            <span className="text-[11px] text-slate-400">مالک توکن‌های LEARN</span>
          </div>

          <div className="text-cyan-400 text-xs font-bold text-center font-mono">
            <div className="hidden md:block">⬅ approve(100)</div>
            <div className="md:hidden">⬇ approve(100)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 text-center w-full">
            <span className="text-purple-400 font-bold block mb-1">قرارداد توکن</span>
            <span className="text-[11px] text-slate-400">ثبت سقف مجاز در دفترکل</span>
          </div>

          <div className="text-purple-400 text-xs font-bold text-center font-mono">
            <div className="hidden md:block">⬅ transferFrom()</div>
            <div className="md:hidden">⬇ transferFrom()</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-center w-full">
            <span className="text-emerald-400 font-bold block mb-1">صرافی SimpleAMM</span>
            <span className="text-[11px] text-slate-400">اجرای امن معامله</span>
          </div>
        </div>
      </div>

      {/* Interactive Approval Management Panel */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white">قرارداد مقصد خرج‌کننده: صرافی SimpleAMM</h4>
          <a
            href={getExplorerAddressUrl(CONTRACT_ADDRESSES.SimpleAMM)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>قرارداد DEX</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Current Allowance Metric */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">سقف فعال و مجاز کنونی برای برداشت</span>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {isAllowanceLoading ? "در حال دریافت..." : `${numAllowance.toLocaleString()} LEARN`}
            </div>
          </div>
          <button
            onClick={() => refetchAllowance()}
            className="p-1 text-slate-400 hover:text-cyan-400 cursor-pointer"
            title="به‌روزرسانی سقف"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              disabled={isAwaitingSignature || isPendingBroadcast}
              className="w-36 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none force-ltr"
              placeholder="100"
              min="1"
            />
            <button
              onClick={() => handleApprove(approveAmount)}
              disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAwaitingSignature ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>تایید approve() در پنجره کیف‌پول...</span>
                </>
              ) : isPendingBroadcast ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-amber-300" />
                  <span>در حال ثبت مجوز در آربیتروم...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>تایید {approveAmount} توکن LEARN برای AMM</span>
                </>
              )}
            </button>
          </div>

          {/* Revoke Button */}
          {hasAllowance && (
            <button
              onClick={handleRevoke}
              disabled={isAwaitingSignature || isPendingBroadcast}
              className="w-full py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Slash className="w-4 h-4 text-red-400" />
              <span>ابطال و لغو مجوز (تنظیم مجدد روی ۰ - Revoke)</span>
            </button>
          )}

          {approveError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{approveError.message.includes("User rejected") ? "درخواست تایید در کیف‌پول لغو شد." : approveError.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">رسید تراکنش تایید مجوز:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">پاداش این مرحله: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>مرحله ۸ باز شد: صرافی غیرمتمرکز و مبادله AMM</span>
          </span>
        )}
      </div>

    </div>
  );
}
