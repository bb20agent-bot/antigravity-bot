import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, TrendingUp, Gem, Users, Star, ArrowRight } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  icon: React.ReactNode;
  monthlyPriceTon: number;
  yearlyPriceTon: number;
  color: string;
  bgGradient: string;
  features: string[];
  t2eLimit: number;
  multiplier: number;
}

const TIERS: Tier[] = [
  {
    id: 'crew',
    name: 'SEDAN (COMMUTER)',
    icon: <Shield size={20} className="text-cyan-400" />,
    monthlyPriceTon: 100,
    yearlyPriceTon: 1000, 
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-900/20 to-black',
    t2eLimit: 1,
    multiplier: 1,
    features: [
      'Basic Fuel Injection (T2E)',
      'Airdrop Claiming Fee: 5%',
      'Referral: L1(5%)',
      'P2P Drive: Activated'
    ]
  },
  {
    id: 'alpha',
    name: 'SUV (FAMILY RUNNER)',
    icon: <Zap size={20} className="text-purple-400" />,
    monthlyPriceTon: 1000,
    yearlyPriceTon: 10000,
    color: 'text-purple-400',
    bgGradient: 'from-purple-900/20 to-black',
    t2eLimit: 5,
    multiplier: 2.5,
    features: [
      'Turbo Fuel Supply (2.5x)',
      'Airdrop Claiming Fee: 2%',
      'Referral: L1(15%), L2(5%)',
      'P2P Flywheel: SUV Node MM',
      'Copy-Trade Gearbox: Full Access'
    ]
  },
  {
    id: 'noblesse',
    name: 'SPORTSCAR (V-MASTER)',
    icon: <Gem size={20} className="text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />,
    monthlyPriceTon: 10000,
    yearlyPriceTon: 100000,
    color: 'text-cyan-300',
    bgGradient: 'from-cyan-600/30 to-purple-900/40',
    t2eLimit: 20,
    multiplier: 10,
    features: [
      'Nitro Boost V-Velocity (10x)',
      'Airdrop Claiming Fee: 0%',
      'Referral: L1(30%), L2(15%)',
      'P2P Flywheel: Formula Operator',
      'Ecosystem Nitro: +50% Yield Boost',
      'Private Racing Channel Access'
    ]
  }
];

export const SubscriptionView: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [currency, setCurrency] = useState<'VORA'>('VORA');

    const handlePurchase = (tier: Tier) => {
        let price = billingCycle === 'monthly' ? tier.monthlyPriceTon : tier.yearlyPriceTon;
        let finalPrice = price;
        
        alert(`BROMOTION V2 - SUBSCRIPTION\n\nTier: ${tier.name}\nBilling: ${billingCycle}\nAmount Due: ${finalPrice.toLocaleString()} VORA\n\n[PROCEED TO VORA PAYGATE]`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-32">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                    BRO<span translate="no">MOTION</span> HUB
                </h2>
                <p className="text-[10px] text-cyan-500 font-black tracking-[0.3em] mt-2 uppercase">Unlock the Flywheel Economy</p>
                <p className="text-xs text-slate-400 mt-6 px-4 leading-relaxed font-bold uppercase tracking-wide">
                    Elevate your status within the Bromotion ecosystem. Higher tiers grant superior trading velocity and ecosystem governance rights.
                </p>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-white/5 border border-white/10 p-1.5 rounded-full flex relative">
                    <button 
                        onClick={() => setBillingCycle('monthly')} 
                        className={`relative z-10 px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-black' : 'text-slate-500'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle('yearly')} 
                        className={`relative z-10 px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-black' : 'text-slate-500'}`}
                    >
                        Yearly <span className="text-purple-500 ml-1">SAVE 20%</span>
                    </button>
                    <div 
                        className={`absolute top-1.5 bottom-1.5 w-[48%] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300 ease-in-out ${billingCycle === 'yearly' ? 'translate-x-[104%]' : 'translate-x-[0%]'}`} 
                    />
                </div>
            </div>

            {/* Tiers Grid */}
            <div className="space-y-6">
                {TIERS.map(tier => {
                    const finalPrice = billingCycle === 'monthly' ? tier.monthlyPriceTon : tier.yearlyPriceTon;

                    return (
                        <div key={tier.id} className={`bg-gradient-to-br ${tier.bgGradient} border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl`}>
                            {tier.id === 'noblesse' && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-400 to-purple-600 text-white text-[9px] font-black uppercase px-6 py-2 rounded-bl-2xl shadow-xl italic tracking-widest">
                                    Ultimate Status
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-3 italic ${tier.color}`}>
                                        {tier.icon} {tier.name}
                                    </h3>
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-white italic tracking-tighter">{finalPrice.toLocaleString()}</span>
                                        <span className="text-sm text-cyan-500 font-black uppercase italic">VORA</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[1px] bg-white/5 w-full mb-6"></div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[11px] text-slate-300 font-bold uppercase tracking-tight">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${tier.bgGradient}`}>
                                            <Check size={12} className={tier.color} />
                                        </div>
                                        <span className="leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => handlePurchase(tier)}
                                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex justify-center items-center gap-3 italic
                                    ${tier.id === 'noblesse' 
                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-[1.03]' 
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/30'
                                    }
                                `}
                            >
                                Activate {tier.name} <ArrowRight size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-12 p-8 bg-cyan-950/20 border border-cyan-500/20 rounded-[2rem] shadow-inner">
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-4 italic text-center justify-center">
                   <Shield size={16} /> Bromotion Governance Notice
                </h4>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase text-center tracking-wide">
                    Subscription tiers contribute directly to the VORA P2P Liquidity Engine. 
                    <br/>Noblesse members are granted priority access to new AI strategy deployments and manual lot-size override permissions within the MT5 Bridge.
                </p>
            </div>
        </div>
    );
};
