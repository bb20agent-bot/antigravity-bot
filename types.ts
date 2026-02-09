
export enum NavTab {
  HOME = 'Home',
  MY_OFFICE = 'My Office',
  MARKETPLACE = 'Marketplace',
  INFO = 'Info'
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
