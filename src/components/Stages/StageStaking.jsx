// src/components/Stages/StageStaking.jsx
// مرحله ۱۰: مکانیسم‌های استیکینگ و بازدهی - استیک LEARN، رهگیری پاداش و تجربه تایمر قفل

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Lock,
  Unlock,
  Coins,
  RefreshCw
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageStaking({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [stakeAmount, setStakeAmount] = useState("50");

  // Read stake info
  const { data: stakeInfo, refetch: refetchStake } = useReadContract({
    address: CONTRACT_ADDRESSES.StakingLab,
    abi: CONTRACT_ABIS.StakingLab,
    functionName: 'getStakeInfo',
    args: address ? [address] : undefined,
  });

  // Write contract hook
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: stakeError 
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
      refetchStake();
      completeStage(stage.id, {
        hash: txHash,
        type: `عملیات استیکینگ در StakingLab`,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "تاییدشده"
      });
    }
  }, [isConfirmed, txHash]);

  const handleStake = () => {
    if (!stakeAmount) return;
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.StakingLab,
        abi: CONTRACT_ABIS.StakingLab,
        functionName: 'stake',
        args: [parseUnits(stakeAmount, 18)],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaim = () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.StakingLab,
        abi: CONTRACT_ABIS.StakingLab,
        functionName: 'claimReward',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnstake = () => {
    if (!stakeInfo || stakeInfo[0] === 0n) return;
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.StakingLab,
        abi: CONTRACT_ABIS.StakingLab,
        functionName: 'unstake',
        args: [stakeInfo[0]],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const stakedAmount = stakeInfo ? parseFloat(formatUnits(stakeInfo[0], 18)) : 0;
  const isLocked = stakeInfo ? stakeInfo[3] : false;
  const pendingReward = stakeInfo ? parseFloat(formatUnits(stakeInfo[2], 18)) : 0;

  return (
    <div className="space-y-6 text-right">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-indigo-300 font-medium">
            سازوکار استیکینگ و تولید سود در دیفای
          </div>
          <p className="text-slate-300 leading-relaxed">
            قراردادهای استیکینگ دارایی‌های شما را برای مدتی قفل کرده و در ازای آن بر حسب زمان و حجم سرمایه، پاداش تولید می‌کنند. این پاداش‌ها برای تمرین در شبکه آزمایشی طراحی شده و ارزش مالی واقعی ندارند.
          </p>
        </div>
      </div>

      {/* Live Staking Status Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>صندوق استیکینگ (Staking Lab)</span>
          </h4>
          <button onClick={() => refetchStake()} className="text-slate-400 hover:text-cyan-400 cursor-pointer" title="به‌روزرسانی">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">اصل سرمایه استیک‌شده شما</span>
            <span className="text-white font-bold font-mono text-sm">{stakedAmount.toLocaleString()} LEARN</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">پاداش تستی انباشته‌شده</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">{pendingReward.toFixed(5)} LEARN</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">وضعیت قفل (تایمر ۶۰ ثانیه دمو)</span>
            <span className={`font-bold text-xs flex items-center gap-1 mt-1 ${isLocked ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{isLocked ? "اصل سرمایه قفل است" : "قفل باز شد / قابل برداشت"}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              disabled={isAwaitingSignature || isPendingBroadcast}
              className="w-36 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none force-ltr"
              placeholder="50"
              min="1"
            />
            <button
              onClick={handleStake}
              disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAwaitingSignature ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>تایید stake() در کیف‌پول...</span>
                </>
              ) : isPendingBroadcast ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-amber-300" />
                  <span>در حال قفل توکن‌ها در StakingLab...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>استیک {stakeAmount} توکن LEARN</span>
                </>
              )}
            </button>
          </div>

          {/* Claim and Unstake secondary controls */}
          {stakedAmount > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleClaim}
                disabled={isAwaitingSignature || isPendingBroadcast}
                className="py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>دریافت پاداش‌های آزمایشی</span>
              </button>
              <button
                onClick={handleUnstake}
                disabled={isAwaitingSignature || isPendingBroadcast || isLocked}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>{isLocked ? "قفل است (صبر کنید)" : "خروج و برداشت اصل سرمایه"}</span>
              </button>
            </div>
          )}

          {stakeError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{stakeError.message.includes("User rejected") ? "تراکنش توسط کاربر در کیف‌پول لغو شد." : stakeError.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">رسید تراکنش استیکینگ:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">پاداش این مرحله: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>مرحله ۱۱ باز شد: توکن‌های دستاورد NFT</span>
          </span>
        )}
      </div>

    </div>
  );
}
