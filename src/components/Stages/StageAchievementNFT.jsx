// src/components/Stages/StageAchievementNFT.jsx
// مرحله ۱۱: توکن‌های NFT و مالکیت اثبات‌پذیر - ضرب نشان رسمی «پایه‌های وب۳ آربیتروم»

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, getExplorerAddressUrl } from '../../config/contracts.js';
import { ExplorerLink } from '../Common/ExplorerLink.jsx';

export function StageAchievementNFT({ stage }) {
  const { address, isConnected } = useAccount();
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  // Read hasMinted
  const { data: hasMintedOnchain, refetch: refetchMinted } = useReadContract({
    address: CONTRACT_ADDRESSES.AchievementNFT,
    abi: CONTRACT_ABIS.AchievementNFT,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
  });

  // Read user tokenId
  const { data: userTokenId, refetch: refetchTokenId } = useReadContract({
    address: CONTRACT_ADDRESSES.AchievementNFT,
    abi: CONTRACT_ABIS.AchievementNFT,
    functionName: 'userTokenId',
    args: address ? [address] : undefined,
  });

  // Mint contract write
  const { 
    writeContract, 
    data: txHash, 
    isPending: isAwaitingSignature, 
    error: mintError 
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
      refetchMinted();
      refetchTokenId();
      completeStage(stage.id, {
        hash: txHash,
        type: `ضرب نشان افتخار NFT`,
        blockNumber: receipt?.blockNumber?.toString() || "",
        status: "تاییدشده"
      });
    }
  }, [isConfirmed, txHash]);

  const handleMint = () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.AchievementNFT,
        abi: CONTRACT_ABIS.AchievementNFT,
        functionName: 'mintAchievement',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isMinted = hasMintedOnchain || completed;
  const tokenIdDisplay = userTokenId ? userTokenId.toString() : "1";

  return (
    <div className="space-y-6 text-right">
      
      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-pink-950/40 border border-pink-500/30 flex items-start gap-3">
        <Award className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-pink-300 font-medium">
            توکن‌های غیرمثلی استاندارد ERC-721 (NFT)
          </div>
          <p className="text-slate-300 leading-relaxed">
            برخلاف توکن‌های مثلی که تمام واحدها یکسانند، توکن‌های ERC-721 نمایانگر دارایی‌های دیجیتال منحصربه‌فرد با شناسه‌های اختصاصی هستند. این نشان، یک نماد دستاورد آموزشی برای این دوره است و گواهی مالی محسوب نمی‌شود.
          </p>
        </div>
      </div>

      {/* NFT Showcase Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
        
        {/* Visual Badge Graphic */}
        <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-2 border-cyan-400/40 p-4 flex flex-col items-center justify-between text-center shadow-xl shadow-cyan-500/10 group shrink-0">
          <div className="w-full flex justify-between items-center text-[10px] font-mono text-cyan-400">
            <span>AW3F</span>
            <span>#{tokenIdDisplay}</span>
          </div>

          <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center bg-blue-500/10 group-hover:scale-105 transition-transform">
            <Award className="w-10 h-10 text-cyan-300 animate-pulse" />
          </div>

          <div>
            <div className="text-xs font-bold text-white tracking-wider">
              فارغ‌التحصیل آربیتروم
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              نشان رسمی آن‌چین
            </div>
          </div>
        </div>

        {/* Badge Metadata Details */}
        <div className="flex-1 space-y-3 text-xs w-full">
          <div>
            <div className="text-base font-bold text-white">پایه‌های وب۳ آربیتروم (Arbitrum Web3 Foundations)</div>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              اعطا شده به کاربرانی که ماژول‌های بنیادین رمزنگاری، شبکه، گس، توکن‌ها و دیفای را سپری کرده‌اند.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">استاندارد</span>
              <span className="text-cyan-300 font-bold font-mono">ERC-721</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">نحوه ذخیره متادیتا</span>
              <span className="text-purple-300 font-bold">گرافیک برداری SVG آن‌چین</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">قرارداد</span>
              <span className="text-slate-300 truncate block font-mono force-ltr">{CONTRACT_ADDRESSES.AchievementNFT.slice(0, 10)}...</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">شبکه</span>
              <span className="text-emerald-400 font-bold font-mono">Arbitrum Sepolia</span>
            </div>
          </div>

          {/* Mint Button */}
          <div className="pt-2">
            {isMinted ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>نشان دستاورد با موفقیت به آدرس شما ضرب شد!</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleMint}
                disabled={!isConnected || isAwaitingSignature || isPendingBroadcast}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAwaitingSignature ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>تایید mintAchievement() در کیف‌پول...</span>
                  </>
                ) : isPendingBroadcast ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-amber-300" />
                    <span>در حال ضرب نشان در آربیتروم سپولیا...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>ضرب نشان افتخار تاییدشده NFT</span>
                  </>
                )}
              </button>
            )}

            {mintError && (
              <div className="mt-2 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{mintError.message.includes("already minted") ? "نشان افتخار قبلاً برای این آدرس صادر شده است." : mintError.message}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Explorer Receipt */}
      {txHash && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">رسید ضرب توکن NFT:</span>
          <ExplorerLink type="tx" value={txHash} />
        </div>
      )}

      {/* Footer XP indicator */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">پاداش این مرحله: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong></span>
        {completed && (
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>مرحله ۱۲ باز شد: بازارچه NFT</span>
          </span>
        )}
      </div>

    </div>
  );
}
