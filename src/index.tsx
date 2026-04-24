import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserApp from '../user/UserApp';
import LegacyUserApp from '../true_legacy_vora/user/UserApp';
import VoraminiApp from './App';  // <- Added new Flywheel UI App
import AdminDashboard from '../pages/AdminDashboard';
import IdoLaunchpad from '../pages/IdoLaunchpad';
import VoraScanPage from '../pages/VoraScanPage';
import TradingDashboard from '../pages/TradingDashboard';
import VoraSwapApp from './pages/VoraSwapApp'; // <- Added Bromotion P2P Hub
import AngelInvestDashboard from '../pages/AngelInvestDashboard'; // <- Added Founder Private Dashboard
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const RootRouter = () => {
   const hostname = window.location.hostname;
   const searchParams = new URLSearchParams(window.location.search);
   const hasSwapParam = searchParams.get('app') === 'swap';
   const hasInvestParam = searchParams.get('app') === 'invest';
   const [forceSwap, setForceSwap] = React.useState(hasSwapParam);
   const [forceInvest, setForceInvest] = React.useState(hasInvestParam);
   const [isTelegram, setIsTelegram] = React.useState(false);
   const [isReady, setIsReady] = React.useState(false);

   React.useEffect(() => {
       const tgTimer = setTimeout(() => {
           const tg = (window as any).Telegram?.WebApp;
           if (tg && (tg.initData !== '' || (tg.platform && tg.platform !== 'unknown'))) {
               setIsTelegram(true);
               if (tg.initDataUnsafe?.start_param === 'swap' || tg.initDataUnsafe?.start_param === 'p2p') {
                   setForceSwap(true);
               }
               if (tg.initDataUnsafe?.start_param === 'invest') {
                   setForceInvest(true);
               }
           }
           setIsReady(true);
       }, 50); // Small buffer for SDK initialization
       return () => clearTimeout(tgTimer);
   }, []);

   if (!isReady) return null; // Pre-render shield

   // 0. Angel Invest Dashboard (vorainvest.com) - Private Access
   if (forceInvest || hostname.includes('vorainvest.com') || searchParams.has('token') || hostname.includes('localhost') || hostname === '127.0.0.1') {
       return <AngelInvestDashboard />;
   }

   // 1. Scan Domain (VoraScan)
   if (hostname.includes('vorascan.com')) {
       return <VoraScanPage />;
   }
   
   // 3. Bromotion Hub (voraswap.com) - P2P dNFT Market (Checks forceSwap first)
   if (forceSwap || hostname.includes('voraswap.com')) {
       return <VoraSwapApp />;
   }

   // 2. Flywheel Mini App (voramini.com)
   if (hostname.includes('voramini.com')) {
       return <VoraminiApp />;
   }

   // 4. Default fallback: If in Telegram, show the newest Flywheel T3E Mini App
   if (isTelegram) {
       return <VoraminiApp />;
   }

   // 5. Ultimate fallback
   return <TradingDashboard />;
};

const manifestUrl = window.location.origin + '/tonconnect-manifest.json';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRouter />} />
          <Route path="/app" element={<RootRouter />} />
          <Route path="/legacy" element={<LegacyUserApp />} />
          <Route path="/dashboard" element={<TradingDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/voraadmin" element={<AdminDashboard />} />
          <Route path="/ido" element={<IdoLaunchpad />} />
        </Routes>
      </BrowserRouter>
    </TonConnectUIProvider>
  </React.StrictMode>
);