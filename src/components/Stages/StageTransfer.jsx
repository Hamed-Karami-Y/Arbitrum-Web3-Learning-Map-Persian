// src/components/Stages/StageTransfer.jsx
// مرحله ۶: انتقال توکن - اجرای انتقال ERC-20 و بررسی رویدادهای Transfer منتشرشده

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../../config/contracts.js';
import { DEMO_RECIPIENTS } from '../../config/demoAddresses.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageTransfer({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [recipient, setRecipient] = useState(DEMO_RECIPIENTS[0].address);
  const [amount, setAmount] = useState("50");

  // Read Token Balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Transfer contract write
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: transferError 
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
      refetchBalance();
      completeStage(stage.id, {
        hash: txHash,
        type: `انتقال ${amount} توکن LEARN`,
        recipient,
        amount: `${amount} LEARN`,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "تاییدشده"
      });
    }
  }, [isConfirmed, txHash]);

  const handleTransfer = () => {
    if (!recipient || !amount) return;
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.LearnToken,
        abi: CONTRACT_ABIS.LearnToken,
        functionName: 'transfer',
        args: [recipient, parseUnits(amount, 18)],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const userBalance = balance ? parseFloat(formatUnits(balance, 18)) : 0;

  return (
    <div className="space-y-6 text-right">
      
      {/* Educational Banner */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
        <ArrowRightLeft className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-300 font-medium">
            نحوه کارکرد انتقال توکن در لایه قرارداد هوشمند
          </div>
          <p className="text-slate-300 leading-relaxed">
            هنگامی که تابع <code className="text-cyan-300 font-mono">transfer(to, amount)</code> را فراخوانی می‌کنید، قرارداد هوشمند نگاشت (Mapping) داخلی خود را به‌روزرسانی می‌کند: موجودی شما را کسر کرده، موجودی گیرنده را افزایش می‌دهد و رویداد استاندارد <code className="text-cyan-300 font-mono">Transfer(from, to, value)</code> را منتشر می‌نماید.
          </p>
        </div>
      </div>

      {/* Transfer Form Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" />
            <span>ارسال توکن‌های LEARN</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">
            موجودی در دسترس: <strong className="text-white">{userBalance.toLocaleString()} LEARN</strong>
          </span>
        </div>

        {/* Recipient Picker */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400">آدرس گیرنده</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isAwaitingSignature || isPendingBroadcast}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none force-ltr"
            placeholder="0x..."
          />

          {/* Quick Demo Peer Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 ml-1">گیرندگان نمونه:</span>
            {DEMO_RECIPIENTS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRecipient(demo.address)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors border cursor-pointer ${
                  recipient === demo.address 
                    ? 'bg-blue-600/30 text-cyan-300 border-cyan-500/40 font-bold' 
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>مبلغ انتقال</span>
            <button 
              type="button" 
              onClick={() => setAmount("50")} 
              className="text-cyan-400 hover:underline text-[11px] cursor-pointer"
            >
              تنظیم روی ۵۰ LEARN
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isAwaitingSignature || isPendingBroadcast}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none force-ltr"
            min="1"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleTransfer}
          disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || userBalance < parseFloat(amount || "0")}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isAwaitingSignature ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>تایید transfer() در کیف‌پول...</span>
            </>
          ) : isPendingBroadcast ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-amber-300" />
              <span>در حال ثبت انتقال در شبکه آربیتروم...</span>
            </>
          ) : (
            <>
              <ArrowRightLeft className="w-4 h-4" />
              <span>انتقال {amount} توکن LEARN</span>
            </>
          )}
        </button>

        {transferError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{transferError.message.includes("User rejected") ? "درخواست انتقال توسط کاربر در کیف‌پول لغو شد." : transferError.message}</span>
          </div>
        )}
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">رسید انتقال توکن:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">پاداش این مرحله: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>مرحله ۷ باز شد: تاییدها و سقف برداشت (Allowance)</span>
          </span>
        )}
      </div>

    </div>
  );
}
