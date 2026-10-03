// src/components/Stages/StageSecurityLab.jsx
// مرحله ۱۳: تسلط بر امنیت و آزمایشگاه تهدیدات - شبیه‌ساز تعاملی دفاع در برابر حملات وب۳

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  Sparkles,
  KeyRound,
  FileWarning,
  ExternalLink,
  ChevronLeft,
  Slash
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.jsx';
import { StageApproval } from './StageApproval.jsx';

export function StageSecurityLab({ stage }) {
  const { completeStage, isStageCompleted } = useLearning();
  const completed = isStageCompleted(stage.id);

  const [activeTab, setActiveTab] = useState('phishing'); // 'phishing' | 'approval' | 'seed'
  const [phishingAnswers, setPhishingAnswers] = useState({});
  const [approvalChoice, setApprovalChoice] = useState(null);
  const [seedChecklist, setSeedChecklist] = useState({
    noWebsitePrompt: false,
    storeOffline: false,
    hardwareWallet: false,
  });

  // Phishing Scenarios
  const PHISHING_SCENARIOS = [
    {
      id: "scen-1",
      title: "سناریو ۱: پیام خصوصی ایردراپ در دیسکورد",
      dappUrl: "https://arbitrum-airdrop-claim-now.xyz",
      promptText: "همین الان ۵,۰۰۰ توکن ARB دریافت کنید! کیف‌پول را متصل کرده و امضای Permit را تایید نمایید.",
      actionRequested: "Permit2: TransferFrom(All Tokens)",
      isPhishing: true,
      explanation: "کلاهبرداری قطعی! بنیاد آربیتروم هرگز ایردراپ‌ها را در پیام خصوصی دیسکورد یا دامنه‌های ناشناس (.xyz) توزیع نمی‌کند. امضای Permit2 به مهاجم اجازه می‌دهد تمام دارایی‌های کیف‌پول شما را خالی کند."
    },
    {
      id: "scen-2",
      title: "سناریو ۲: تعامل با پل رسمی آربیتروم",
      dappUrl: "https://bridge.arbitrum.io",
      promptText: "واریز ۰.۱ اتریوم از شبکه سپولیا اتریوم به آربیتروم سپولیا.",
      actionRequested: "واریز مستقیم اتریوم بومی به قرارداد Inbox لایه ۱",
      isPhishing: false,
      explanation: "تراکنش معتبر و امن! این پورتال رسمی پل آربیتروم روی دامنه معتبر arbitrum.io است و اتریوم را مستقیماً به قرارداد ورودی رول‌آپ واریز می‌کند."
    },
    {
      id: "scen-3",
      title: "سناریو ۳: هشدار فوری امنیتی برای ابطال قراردادها",
      dappUrl: "https://revoke-security-arbitrum.net",
      promptText: "آسیب‌پذیری اضطراری! عبارت ۱۲ کلمه‌ای بازیابی خود را برای تایید هویت و لغو قراردادهای آلوده وارد کنید.",
      actionRequested: "ورود مستقیم کلمات بازیابی (Seed Phrase)",
      isPhishing: true,
      explanation: "کلاهبرداری مهلک! هیچ ابزار یا پروژه معتبری هرگز کلمات بازیابی شما را درخواست نمی‌کند. وارد کردن این کلمات مساوی است با سرقت آنی ۱۰۰٪ دارایی‌های شما."
    }
  ];

  const handlePhishingSelect = (id, userGuess) => {
    setPhishingAnswers(prev => ({ ...prev, [id]: userGuess }));
  };

  const allPhishingCorrect = PHISHING_SCENARIOS.every(
    scen => phishingAnswers[scen.id] === (scen.isPhishing ? 'reject' : 'approve')
  );

  const isApprovalCorrect = approvalChoice === 'unlimited';
  const isSeedChecklistComplete = Object.values(seedChecklist).every(Boolean);

  const canComplete = allPhishingCorrect && isApprovalCorrect && isSeedChecklistComplete;

  const handleVerify = () => {
    completeStage(stage.id);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-300 font-medium">
            منطقه ۵: شبیه‌ساز تعاملی تهدیدات وب۳
          </div>
          <p className="text-slate-300 leading-relaxed">
            در وب۳، هیچ پشتیبانی مشتری برای بازگرداندن تراکنش‌های اشتباه وجود ندارد. شما به تنهایی مسئول حفظ کلیدهای خصوصی و امضاهای خود هستید. شمّ دفاعی خود را در ۳ سناریوی کلیدی زیر بیازمایید.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('phishing')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'phishing'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          تمرین الف: آشکارساز فیشینگ
        </button>
        <button
          onClick={() => setActiveTab('approval')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'approval'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          تمرین ب: ریسک مجوزهای نامحدود
        </button>
        <button
          onClick={() => setActiveTab('seed')}
          className={`px-4 py-2.5 font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'seed'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          تمرین ج: بهداشت کلمات بازیابی
        </button>
      </div>

      {/* Tab 1: Phishing Scenarios */}
      {activeTab === 'phishing' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            سه سناریوی درخواست اتصال و امضای زیر را بررسی کنید و مشخص کنید آیا آن را <strong>تایید</strong> می‌کنید یا به عنوان تهدید <strong>رد</strong> می‌نمایید:
          </p>

          <div className="space-y-3">
            {PHISHING_SCENARIOS.map((scen) => {
              const userGuess = phishingAnswers[scen.id];
              const isCorrect = userGuess && userGuess === (scen.isPhishing ? 'reject' : 'approve');

              return (
                <div key={scen.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{scen.title}</span>
                    <span className="font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 force-ltr">
                      {scen.dappUrl}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-300 font-semibold">{scen.promptText}</div>
                    <div className="text-[11px] text-cyan-400 font-mono force-ltr text-right">اقدام درخواستی: {scen.actionRequested}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">آیا این درخواست را تایید می‌کنید؟</span>
                    <div className="flex gap-2 font-medium">
                      <button
                        onClick={() => handlePhishingSelect(scen.id, 'approve')}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          userGuess === 'approve'
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        تایید (مجاز است)
                      </button>
                      <button
                        onClick={() => handlePhishingSelect(scen.id, 'reject')}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                          userGuess === 'reject'
                            ? 'bg-red-600 text-white border-red-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        رد درخواست (کلاهبرداری)
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {userGuess && (
                    <div className={`p-2.5 rounded-lg text-[11px] flex items-start gap-2 ${
                      isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/40 text-red-300 border border-red-500/30'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span className="leading-relaxed">{scen.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Approval Risk Analyzer */}
      {activeTab === 'approval' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h4 className="font-bold text-sm text-white">مقایسه ریسک سقف‌های مجوز برداشت (Token Allowances)</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            کدام‌یک از سه گزینه زیر بیشترین خطر فاجعه‌بار مالی را برای موجودی کیف‌پول شما به همراه دارد؟
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: '10', title: 'سقف ۱۰ LEARN', risk: 'ریسک کم', desc: 'قرارداد تنها مجاز است حداکثر تا ۱۰ توکن از حساب شما بردارد.' },
              { id: '1000', title: 'سقف ۱,۰۰۰ LEARN', risk: 'ریسک متوسط', desc: 'قرارداد می‌تواند تا سقف ۱,۰۰۰ توکن مشخص برداشت نماید.' },
              { id: 'unlimited', title: 'سقف نامحدود (Max Uint256)', risk: 'بیشترین ریسک فاجعه‌بار', desc: 'قرارداد تا ابد و در هر زمان می‌تواند تمام توکن‌های فعلی و بعدی شما را برداشت کند.' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setApprovalChoice(opt.id)}
                className={`p-4 rounded-xl border text-right transition-all text-xs cursor-pointer ${
                  approvalChoice === opt.id
                    ? 'bg-blue-950/80 border-cyan-400 ring-1 ring-cyan-400'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white mb-1">{opt.title}</div>
                <div className={`text-[10px] uppercase font-bold mb-2 ${opt.id === 'unlimited' ? 'text-red-400' : 'text-slate-400'}`}>
                  {opt.risk}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>

          {approvalChoice && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              isApprovalCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/40 text-red-300 border border-red-500/30'
            }`}>
              {isApprovalCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span className="leading-relaxed">
                {isApprovalCorrect 
                  ? "کاملاً درست است! مجوز نامحدود Max Uint256 بدان معناست که اگر آن قرارداد ۶ ماه دیگر هک شود، مهاجم می‌تواند بدون نیاز به امضای جدید، تمام توکن‌های شما را به سرقت ببرد." 
                  : "دوباره فکر کنید. مجوزهای محدود خسارت را محدود می‌کنند، اما مجوز نامحدود ۱۰۰٪ موجودی شما را در معرض خطر دائمی قرار می‌دهد."}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Seed Phrase Hygiene */}
      {activeTab === 'seed' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>قوانین حیاتی حفظ کلمات بازیابی (Seed Phrase)</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            رشته ۱۲ یا ۲۴ کلمه‌ای بازیابی، کلید اصلی ریشه تمام هویت و دارایی شما در بلاک‌چین است. اطمینان حاصل کنید که این ۳ اصل تغییرناپذیر را تایید می‌کنید:
          </p>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={seedChecklist.noWebsitePrompt}
                onChange={(e) => setSeedChecklist(prev => ({ ...prev, noWebsitePrompt: e.target.checked }))}
                className="mt-0.5 rounded text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 leading-relaxed">
                <strong>هیچ سایت معتبری هرگز کلمات بازیابی شما را درخواست نخواهد کرد.</strong> هر پنجره پاپ‌آپ، پشتیبان تلگرام یا سایتی که کلمات را بخواهد بی‌درنگ یک کلاهبردار است.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={seedChecklist.storeOffline}
                onChange={(e) => setSeedChecklist(prev => ({ ...prev, storeOffline: e.target.checked }))}
                className="mt-0.5 rounded text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 leading-relaxed">
                <strong>کلمات بازیابی را به صورت آفلاین روی کاغذ فیزیکی یا صفحه فلزی یادداشت کنید.</strong> هرگز اسکرین‌شات نگیرید، در کلاد، تلگرام، ایمیل یا فایل متنی ذخیره نکنید.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={seedChecklist.hardwareWallet}
                onChange={(e) => setSeedChecklist(prev => ({ ...prev, hardwareWallet: e.target.checked }))}
                className="mt-0.5 rounded text-cyan-500 focus:ring-0"
              />
              <span className="text-slate-300 leading-relaxed">
                <strong>کیف‌پول‌های سخت‌افزاری کلید خصوصی را از بدافزارهای کامپیوتر جدا نگه می‌دارند.</strong> برای نگهداری دارایی‌های ارزشمند در آربیتروم وان بسیار توصیه می‌شود.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Verification Action */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          پاداش این مرحله: <strong className="text-amber-400 font-mono">+{stage.xp} XP</strong>
        </div>
        <button
          onClick={handleVerify}
          disabled={!canComplete}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{completed ? "تکمیل شده (دریافت +۳۰۰ XP)" : canComplete ? "تایید تسلط بر امنیت و باز کردن فارغ‌التحصیلی" : "ابتدا تمام تمرین‌های فوق را کامل کنید"}</span>
        </button>
      </div>

    </div>
  );
}
