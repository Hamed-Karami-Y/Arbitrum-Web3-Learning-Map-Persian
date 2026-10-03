// src/components/Stages/StageSwap.jsx
// مرحله ۸: صرافی غیرمتمرکز آموزشی (AMM) - مبادله با فرمول حاصل‌ضرب ثابت LEARN با LearnUSD (LUSD)

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
  ShieldCheck,
  Zap,
  ArrowDown,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageSwap({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [amountIn, setAmountIn] = useState("25");
  const [slippagePercent, setSlippagePercent] = useState(1); // 1%

  // Read Reserves from SimpleAMM
  const { data: reservesData, refetch: refetchReserves } = useReadContract({
    address: CONTRACT_ADDRESSES.SimpleAMM,
    abi: CONTRACT_ABIS.SimpleAMM,
    functionName: 'getReserves',
  });

  // Read user LEARN balance
  const { data: learnBalance, refetch: refetchLearn } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read user allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.LearnToken,
    abi: CONTRACT_ABIS.LearnToken,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.SimpleAMM] : undefined,
  });

  // Calculate quote using constant product formula with 0.3% fee
  const resA = reservesData ? reservesData[0] : 100000n * 10n**18n;
  const resB = reservesData ? reservesData[1] : 100000n * 10n**18n;

  let estimatedOut = "0.0";
  let minAmountOutBN = 0n;
  try {
    const inBN = parseUnits(amountIn || "0", 18);
    if (inBN > 0n && resA > 0n && resB > 0n) {
      const inWithFee = inBN * 997n;
      const num = inWithFee * resB;
      const den = (resA * 1000n) + inWithFee;
      const outBN = num / den;
      estimatedOut = formatUnits(outBN, 18);
      // Min output after slippage
      minAmountOutBN = (outBN * BigInt(100 - slippagePercent)) / 100n;
    }
  } catch (err) {
    // ignore parsing errors
  }

  // Swap contract write
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: swapError 
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
      refetchReserves();
      refetchLearn();
      completeStage(stage.id, {
        hash: txHash,
        type: `مبادله در AMM: ${amountIn} LEARN ➔ LUSD`,
        amount: `${amountIn} LEARN`,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "تاییدشده"
      });
    }
  }, [isConfirmed, txHash]);

  const handleSwap = () => {
    if (!amountIn || parseFloat(amountIn) <= 0) return;
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.SimpleAMM,
        abi: CONTRACT_ABIS.SimpleAMM,
        functionName: 'swapAforB',
        args: [parseUnits(amountIn, 18), minAmountOutBN],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const currentAllowance = allowance ? parseFloat(formatUnits(allowance, 18)) : 0;
  const needsApproval = currentAllowance < parseFloat(amountIn || "0");

  return (
    <div className="space-y-6 text-right">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-purple-300 font-medium">
            صرافی خودکار با فرمول حاصل‌ضرب ثابت (x * y = k)
          </div>
          <p className="text-purple-200/90 leading-relaxed">
            این صرافی الگوریتمی قیمت‌گذاری توکن‌ها را بر مبنای نسبت نقدینگی دو توکن در استخر انجام می‌دهد. این قرارداد برای مقاصد آموزشی طراحی شده است و نباید با دارایی‌های واقعی به کار رود.
          </p>
        </div>
      </div>

      {/* Visual Pipeline: Input -> Pool -> Output */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="uppercase text-[11px]">مراحل پردازش مبادله در دیفای:</span>
          <span className="text-cyan-400 font-mono">کارمزد: 0.3% (997/1000)</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block text-sm font-mono">{amountIn || "0"}</span>
            <span className="text-[10px] text-slate-400">ورودی LEARN</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col justify-center">
            <span className="text-purple-300 font-bold text-xs font-mono">x · y = k</span>
            <span className="text-[10px] text-slate-400">استخر نقدینگی</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block text-sm font-mono">~{parseFloat(estimatedOut).toFixed(2)}</span>
            <span className="text-[10px] text-slate-400">خروجی LUSD</span>
          </div>
        </div>
      </div>

      {/* Swap Interface Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
            <span>تبادل تعاملی توکن (Token Swap)</span>
          </h4>
          <a
            href={getExplorerAddressUrl(CONTRACT_ADDRESSES.SimpleAMM)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>قرارداد صرافی</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Input Token (LEARN) */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>پرداخت شما (توکن ورودی)</span>
            <span>موجودی: {learnBalance ? parseFloat(formatUnits(learnBalance, 18)).toLocaleString() : "0"} LEARN</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              disabled={isAwaitingSignature || isPendingBroadcast}
              className="flex-1 bg-transparent text-lg font-bold text-white font-mono focus:outline-none force-ltr text-right"
              placeholder="0.0"
              min="1"
            />
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-cyan-300 font-mono text-xs font-bold">
              LEARN
            </span>
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Output Token (LearnUSD) */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>دریافت شما (خروجی برآوردی)</span>
            <span className="text-emerald-400 font-mono">نرخ تبدیل: ~1.00 LUSD/LEARN</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={parseFloat(estimatedOut).toFixed(4)}
              className="flex-1 bg-transparent text-lg font-bold text-emerald-400 font-mono focus:outline-none force-ltr text-right"
            />
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
              LUSD
            </span>
          </div>
        </div>

        {/* Slippage & Metrics Breakdown */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">تحمل لغزش قیمت (Slippage):</span>
            <div className="flex gap-1 font-mono">
              {[0.5, 1.0, 2.0].map(val => (
                <button
                  key={val}
                  onClick={() => setSlippagePercent(val)}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    slippagePercent === val ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">حداقل دریافتی تضمین‌شده:</span>
            <span className="text-slate-300 font-mono">
              {(parseFloat(estimatedOut) * (1 - slippagePercent / 100)).toFixed(4)} LUSD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">کارمزد تامین‌کنندگان نقدینگی:</span>
            <span className="text-slate-300 font-mono">0.3% ({(parseFloat(amountIn || "0") * 0.003).toFixed(4)} LEARN)</span>
          </div>
        </div>

        {/* Swap Action */}
        <button
          onClick={handleSwap}
          disabled={!isConnected || isAwaitingSignature || isPendingBroadcast || parseFloat(amountIn || "0") <= 0}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isAwaitingSignature ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>تایید مبادله در پنجره کیف‌پول...</span>
            </>
          ) : isPendingBroadcast ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-amber-300" />
              <span>در حال اجرای مبادله در آربیتروم...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>اجرای مبادله: {amountIn} LEARN با LUSD</span>
            </>
          )}
        </button>

        {swapError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{swapError.message.includes("User rejected") ? "درخواست مبادله در کیف‌پول لغو شد." : swapError.message}</span>
          </div>
        )}
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">رسید تراکنش مبادله:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">پاداش این مرحله: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>مرحله ۹ باز شد: تامین نقدینگی و سهام LP</span>
          </span>
        )}
      </div>

    </div>
  );
}
