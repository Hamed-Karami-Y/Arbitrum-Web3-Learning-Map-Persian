// src/config/demoAddresses.js
// آدرس‌های دمو و منابع شیر آب (فاست) برای تمرین‌های آموزشی و انتقال توکن‌ها

export const DEMO_RECIPIENTS = [
  {
    name: "الکس (هم‌دوره‌ای یادگیری)",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    description: "هم‌دوره‌ای شما در یادگیری وب۳ برای تمرین انتقال توکن",
    tag: "همکار"
  },
  {
    name: "استخر جامعه آربیتروم",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    description: "آدرس شبیه‌سازی صندوق جامعه آموزشی برای تست تراکنش‌ها",
    tag: "جامعه"
  },
  {
    name: "خزانه دائو آموزشی",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    description: "خزانه چندامضایی آزمایشی برای تست انتقالات حاکمیتی",
    tag: "خزانه"
  }
];

export const FAUCET_RESOURCES = [
  {
    name: "فاست آربیتروم سپولیا (Chainlink)",
    url: "https://faucets.chain.link/arbitrum-sepolia",
    description: "دریافت ۰.۱ اتریوم تستی آربیتروم سپولیا به صورت مستقیم."
  },
  {
    name: "فاست وب۳ گوگل کلود (Google Cloud)",
    url: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    description: "اتریوم تستی سریع و رایگان برای توسعه سپولیا."
  },
  {
    name: "پل ارتباطی تستی آربیتروم (از سپولیا L1)",
    url: "https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia",
    description: "انتقال اتریوم تستی از لایه ۱ به لایه ۲ آربیتروم سپولیا."
  }
];
