export interface GroundingSource {
  title: string;
  uri: string;
}

export interface VixData {
  value: number;
  change: string; // e.g., "+1.2%" or "-0.5%"
  summary: string;
  sources: GroundingSource[];
  timestamp: number;
}

export interface MarketTickerItem {
  id: string;
  name: string; // Chinese Name
  symbol: string;
  price: string;
  changePercent: string;
  isPositive: boolean; // True if change is >= 0
}

export enum SentimentLevel {
  CALM = 'CALM',
  MODERATE_FEAR = 'MODERATE_FEAR',
  EXTREME_FEAR = 'EXTREME_FEAR',
  UNKNOWN = 'UNKNOWN'
}

export interface DashboardState {
  loading: boolean;
  error: string | null;
  vixData: VixData | null;
  marketData: MarketTickerItem[];
  sentiment: SentimentLevel;
}