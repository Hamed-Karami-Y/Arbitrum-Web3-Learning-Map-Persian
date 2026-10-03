// src/components/Stages/StageConnectWallet.jsx
// مرحله ۱: اتصال کیف‌پول - اتصال امن و غیرحضانتی از طریق Wagmi و Viem

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { arbitrumSepolia } from 'viem/chains';
import { 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { ARBITRUM_SEPOLIA_CHAIN_ID } from '../../config/chain.js';

export function StageConnectWallet({ stage }) {
  const { address, isConnected, chain, isConnecting } = useAccount();
  const { connectors, connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, error: switchError } = useSwitchChain();
  const { data: balanceData, isLoading: isBalanceLoading, refetch: refetchBalance } = useBalance({
    address,
    chainId: arbitrumSepolia.id,
  });

  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const isArbitrumSepolia = isConnected && chain?.id === ARBITRUM_SEPOLIA_CHAIN_ID;

  const handleVerify = () => {
    if (!isConnected || !isArbitrumSepolia) return;
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Educational Banner */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-300 font-medium">
            اتصال امن و غیرحضانتی (Non-Custodial)
          </div>
          <p className="text-slate-300 leading-relaxed">
            اتصال کیف‌پول یک ارتباط فقط-خواندنی را از طریق ارائه‌دهنده وب۳ مرورگر شما برقرار می‌کند و تنها آدرس عمومی شما را به اشتراک می‌گذارد. این برنامه <strong>هرگز</strong> عبارت بازیابی، کلید خصوصی یا رمز عبور شما را درخواست نخواهد کرد.
          </p>
        </div>
      </div>

      {/* Main Connection Panel */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <span>وضعیت کیف‌پول</span>
          </h4>
          <span className={`px-2.5 py-0.5 rounded-full text-xs border ${
            isArbitrumSepolia 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : isConnected 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isArbitrumSepolia ? "آماده روی آربیتروم سپولیا" : isConnected ? "شبکه نامعتبر" : "کیف‌پول متصل نیست"}
          </span>
        </div>

        {/* State A: Wallet Disconnected */}
        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              کیف‌پول نصب‌شده در مرورگر خود را جهت اتصال به شبکه آزمایشی آربیتروم سپولیا انتخاب کنید:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {connectors.map(connector => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector, chainId: arbitrumSepolia.id })}
                  disabled={isConnecting}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-right transition-all group active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
                      {connector.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                        {connector.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        ارائه‌دهنده EIP-1193
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold group-hover:-translate-x-1 transition-transform">
                    اتصال ←
                  </span>
                </button>
              ))}
            </div>

            {connectError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{connectError.message.includes("User rejected") ? "درخواست اتصال توسط کاربر لغو شد." : connectError.message}</span>
              </div>
            )}
          </div>
        ) : (
          /* State B: Connected */
          <div className="space-y-4">
            
            {/* Account Details */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-400">آدرس متصل:</span>
                <span className="text-cyan-300 font-bold font-mono select-all force-ltr">{address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">شبکه فعال:</span>
                <span className={`font-semibold ${isArbitrumSepolia ? 'text-emerald-400' : 'text-red-400'}`}>
                  {chain?.name || `شناسه زنجیره ${chain?.id}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">موجودی بومی ETH:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold font-mono">
                    {isBalanceLoading ? "در حال دریافت..." : `${parseFloat(balanceData?.formatted || "0").toFixed(4)} ETH`}
                  </span>
                  <button 
                    onClick={() => refetchBalance()} 
                    className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                    title="به‌روزرسانی موجودی"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Wrong Network Alert & Switch Action */}
            {!isArbitrumSepolia && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>عدم تطابق شبکه بلاک‌چین</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  کیف‌پول شما در حال حاضر به شبکه <strong>{chain?.name}</strong> متصل است. این آزمایشگاه آموزشی روی <strong>آربیتروم سپولیا (Arbitrum Sepolia با شناسه: ۴۲۱۶۱۴)</strong> اجرا می‌شود.
                </p>
                <button
                  onClick={() => switchChain({ chainId: arbitrumSepolia.id })}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  تغییر شبکه به آربیتروم سپولیا
                </button>
                {switchError && (
                  <p className="text-[11px] text-red-300 mt-1">
                    خطا در تغییر شبکه: {switchError.message}
                  </p>
                )}
              </div>
            )}

            {/* Disconnect button */}
            <div className="flex justify-end">
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>قطع اتصال کیف‌پول</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Completion & XP Button */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          پاداش تکمیل مرحله ۱: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleVerify}
          disabled={!isConnected || !isArbitrumSepolia}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-cyan-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{completed ? "تکمیل شده (دریافت +۵۰ XP)" : "تایید اتصال کیف‌پول و باز کردن مرحله ۲"}</span>
        </button>
      </div>

    </div>
  );
}
