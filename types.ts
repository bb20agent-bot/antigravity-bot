
export enum NavTab {
  HOME = 'Home',
  MY_OFFICE = 'My Office',
  MARKETPLACE = 'Marketplace',
  INFO = 'Info',
  ADMIN = 'Admin',
  LIVE = 'Live'
}

export interface UserAssets {
  ton: number;
  vora: number;
}

export interface StrategyInfo {
  name: string;
  trader: string;
  roi: string;
  winRate: string;
  status: 'Live' | 'Paused';
}

export interface PredictionHistoryItem {
  id: string;
  type: 'Long' | 'Short';
  outcome: 'Win' | 'Loss' | 'Pending';
  payout: string;
  time: string;
}

export interface ReferralLevel {
  level: number;
  rate: number;
  members: number;
  volume: string;
}

export interface TeamMilestone {
  volume: number;
  bonus: number;
  achieved: boolean;
}

export interface UserRank {
  level: number;
  title: string;
  description: string;
  progress: number;
}

export interface DNFTCharacter {
  id: string;
  name: string;
  tier: 'Legendary' | 'Epic' | 'Rare' | 'Common';
  image: string;
  bonus: string;
  owned: boolean;
  price?: number;
  lastPrice?: number;
  trend?: number[];
  supply?: number;
}

// --- New Types ---

export type BoostTier = 'Eco' | 'Starter' | 'Pro' | 'Elite' | 'Partner';

export interface DownlineUser {
  id: string;
  name: string;
  rank: string;
  volume: number;
  status: 'Active' | 'Inactive';
  children?: DownlineUser[];
}

export interface LegalNotice {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface UnilevelRewards {
  LEVEL_1: number;
  LEVEL_2: number;
  LEVEL_3: number;
}

export interface ProtocolConfig {
  USER_SHARE_RATIO: number;
  ECOSYSTEM_SHARE_RATIO: number;
  UNILEVEL_REWARDS: UnilevelRewards;
  USER_VIEW_LIMIT?: number;
  t2eTimerEnd?: number; // Added for T2E Timer
}

export const DEFAULT_PROTOCOL_CONFIG: ProtocolConfig = {
  USER_SHARE_RATIO: 0.7,
  ECOSYSTEM_SHARE_RATIO: 0.3,
  UNILEVEL_REWARDS: {
    LEVEL_1: 0.05,
    LEVEL_2: 0.03,
    LEVEL_3: 0.01
  },
  USER_VIEW_LIMIT: 3,
  t2eTimerEnd: 0
};

export interface ProtocolState {
  config: ProtocolConfig;
  isSyncedWithContract: boolean;
  lastSyncHash: string;
  currentBlock: number;
  activeNodeCount: number;
}

export enum SettlementStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

export interface Settlement {
  id: string;
  user: string;
  tonWallet: string;
  amount: number;
  userShare: number;
  platformShare: number;
  type: string;
  status: SettlementStatus;
  date: string;
  txHash?: string;
}

export interface GlobalState {
  totalUsers: number;
  totalVoraMined: number;
  p2pTaxAccumulated: number;
  dnftSales: number;
  t2eTimerEnd?: number; // Added for T2E Timer
  t2eAutoScheduleActive?: boolean; // Automated 7-times daily schedule
}

export const initialGlobalState: GlobalState = {
  totalUsers: 1420,
  totalVoraMined: 45000000,
  p2pTaxAccumulated: 852.5,
  dnftSales: 12500,
  t2eTimerEnd: 0,
  t2eAutoScheduleActive: false
};

export interface UserSettlementSummary {
  userId: string;
  username: string;
  avatar: string;
  tonWallet: string;
  totalSubscribed: number;
  totalWithdrawn: number;
  withdrawableBalance: number;
  lockedBalance: number;
  withdrawalCount: number;
  lastActive: string;
}

export interface ReferralUser {
  id: string;
  username: string;
  avatar: string;
  level: number;
  referrerId: string | null;
  source: string;
  joinDate: string;
  sublevelCount: number;
  totalCommission: number;
  pending70: number;
  locked30: number;
}

export interface VoraTransaction {
  hash: string;
  method: string;
  block: number;
  age: string;
  from: string;
  to: string;
  value: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface NFTTrade {
  id: string;
  nftName: string;
  seller: string;
  buyer: string | null;
  price: number;
  token: string;
  status: 'LISTED' | 'SOLD' | 'CANCELLED';
  imageUrl: string;
}

export interface TradeStrategy {
  id: string;
  title: string;
  author: string;
  views: number;
  likes: number;
  status: string;
  thumbnail: string;
  youtubeChannelName: string;
  isLive: boolean;
  isAutoLoopEnabled: boolean;
  adsAccountId: string;
  estimatedAdRevenue: number;
}

export interface UserRanking {
  id: string;
  rank: number;
  username: string;
  level: number;
  teamSize: number;
  totalWithdrawal: number;
  avatar: string;
}
