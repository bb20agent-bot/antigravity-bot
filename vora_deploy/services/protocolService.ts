
import { ProtocolConfig, DEFAULT_PROTOCOL_CONFIG, ProtocolState } from '../types';
import { translations, Language } from './i18nService';

class ProtocolService {
    private currentConfig: ProtocolConfig;
    private listeners: ((config: ProtocolConfig) => void)[] = [];

    private state: ProtocolState;

    constructor() {
        const storedConfig = localStorage.getItem('vora_protocol_config');
        if (storedConfig) {
            try {
                this.currentConfig = { ...DEFAULT_PROTOCOL_CONFIG, ...JSON.parse(storedConfig) };
            } catch (e) {
                console.error("Failed to parse stored protocol config", e);
                this.currentConfig = { ...DEFAULT_PROTOCOL_CONFIG };
            }
        } else {
            this.currentConfig = { ...DEFAULT_PROTOCOL_CONFIG };
        }

        this.state = {
            config: this.currentConfig,
            isSyncedWithContract: true,
            lastSyncHash: "ton_v2_f8e2...a1b2",
            currentBlock: 1845201,
            activeNodeCount: 1240
        };

        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'vora_protocol_config' && e.newValue) {
                try {
                    const newConfig = JSON.parse(e.newValue);
                    this.updateConfig(newConfig, true);
                } catch (err) {
                    console.error("Error syncing protocol config from storage", err);
                }
            }
        });
    }

    // [BETA] Mock Backend State
    private mockBackend = {
        userProfile: {
            rank: 12,
            totalEarnings: 3450.20,
            referralCount: 5,
            level: 'Gold',
            nextLevelProgress: 75
        },
        marketConditions: {
            volatility: 'MEDIUM',
            trend: 'UP' as 'UP' | 'DOWN' | 'STAGNANT',
            dominance: 42
        }
    };

    // Brown AI: Multilingual Harsh Asset Audit Logic
    assetMonitor(balance: number, taps: number, trend: 'UP' | 'STAGNANT' | 'DOWN', lang: Language = 'ko') {
        const t = translations[lang] || translations['ko'];

        // Use internal mock state if arguments are defaults
        const currentTrend = trend || this.mockBackend.marketConditions.trend;

        if (currentTrend === 'STAGNANT') {
            return {
                message: t.futureOpaque,
                status: "CRITICAL",
                suggestion: t.movingNeeded
            };
        }
        if (currentTrend === 'DOWN') {
            return {
                message: t.futureWarning,
                status: "WARNING",
                suggestion: "MM 봇 설정을 즉시 재검토하십시오. 리스크가 증가하고 있습니다."
            };
        }
        return {
            message: t.futureStable,
            status: "STABLE",
            suggestion: "현재의 탭 속도를 유지하십시오. 수익률이 안정적입니다."
        };
    }

    getMMBotStats() {
        // [BETA] Randomized Realistic Data
        const variance = () => (Math.random() * 4 - 2); // +/- 2%

        return [
            { pair: 'TON/USDT', efficiency: 98 + variance(), volume24h: 1200000 + (Math.random() * 100000) },
            { pair: 'BTC/BORA', efficiency: 94 + variance(), volume24h: 850000 + (Math.random() * 50000) },
            { pair: 'ETH/BORA', efficiency: 92 + variance(), volume24h: 640000 + (Math.random() * 40000) },
            { pair: 'BORA/USDT', efficiency: 99 + variance(), volume24h: 2100000 + (Math.random() * 200000) },
        ].map(stat => ({
            ...stat,
            efficiency: Number(stat.efficiency.toFixed(2)),
            volume24h: Math.floor(stat.volume24h)
        }));
    }

    // [BETA] Mock User Data Getter
    getUserProfile() {
        return this.mockBackend.userProfile;
    }

    // [BETA] System Stats Getter for Dashboard
    getSystemStats() {
        return {
            totalInflow: 1200000 + Math.floor(Math.random() * 50000),
            activeUsers: 5400 + Math.floor(Math.random() * 200),
            mmPairs: 10
        };
    }

    auditRisk(accounts: any[]) {
        return accounts.filter(acc => acc.withdrawalCount > 50 || acc.totalWithdrawn > 100000)
            .map(acc => ({
                userId: acc.username,
                reason: "High velocity withdrawal detected",
                action: "SUSPEND"
            }));
    }

    getConfig(): ProtocolConfig {
        return this.currentConfig;
    }

    getState(): ProtocolState {
        return this.state;
    }

    updateConfig(newConfig: Partial<ProtocolConfig>, skipStorageUpdate: boolean = false) {
        this.currentConfig = { ...this.currentConfig, ...newConfig };
        this.state.config = this.currentConfig;
        this.state.lastSyncHash = `sync_${Math.random().toString(36).substr(2, 9)}`;
        this.state.currentBlock += 1;

        if (!skipStorageUpdate) {
            localStorage.setItem('vora_protocol_config', JSON.stringify(this.currentConfig));
        }

        this.listeners.forEach(listener => listener(this.currentConfig));
    }

    subscribe(callback: (config: ProtocolConfig) => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }
}

export const protocolService = new ProtocolService();
