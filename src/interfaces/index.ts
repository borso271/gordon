export type ChatSession = {
  id: string;
  title: string;
  interactions: Interaction[];
  createdAt: string;
  updatedAt: string;
};


export type Transaction = {
  id: number;
  ticker: string;
  name: string;
  asset_type: "stock" | "crypto" | "etf";
  date: number;
  type: "Buy" | "Sell";
  quantity: number;
  price: number;
  status?: string;
};



export type Interaction = {
  id: string;
  userMessage: UserMessage;
  botMessage: BotMessage;
  timestamp: string;
  language: string;
  status: string;
  saved?:boolean;
};

export type UserMessage = {
  id: string;
  text: string;
  role?: string;
  language?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  show?: boolean;
};


export type BotMessage = {
  id: string;
  role?: string;
  language: string;
  parts: BotMessagePart[];
  createdAt?: string;
  metadata?: Record<string, any>;
};


export type TickerInput = {
  symbol: string;
  asset_type: 'stock' | 'crypto' | 'etf';
  ticker_id?: number;
};



export interface SingleAsset {
  ticker: string;
  name: string;
  ticker_id: number;
  last_price: number;
  asset_type: "stock"|"crypto"|"etf";
  last_close: number;
  sector?:string;
  buy_date:string;
  avg_price?: number;
}



export type PortfolioItem = {
  symbol_id: number | null;
  ticker: string | null;
  name: string | null;
  currency: string | null;
  quantity: number;
  avg_price: number;
  asset_type: 'stock' | 'crypto' | 'etf';
  last_close: number | null;
  first_acquired: string | null;
  last_updated: string;
  created_at: string;
  last_price: number | null;
  last_price_timestamp?: string | null;
  pnl: number | null;
  sector?: string;
  /** share of portfolio market value, 0 – 100 % */
  allocation?: number | null;
};


// type PortfolioItem = {
//   symbol_id: number | null;
//   ticker: string | null;
//   name: string | null;
//   currency: string | null;
//   quantity: number;
//   avg_price: number;
//   asset_type: "stock" | "crypto" |"etf";
//   last_close: number | null;
//   first_acquired: string | null;
//   last_updated: string;
//   created_at: string;
//   last_price: number | null;
//   last_price_timestamp?: string | null;
//   pnl: number | null;
//   sector?: string; // optional if you track a sector for each stock
// };



type PolygonSnapshot = {
  current_price: number;
  last_close: number;
  day_high?: number;
  day_low?: number;
  updated?: number;
};
type AssetWithInsightProps = {
  item: {
    id: number;
    ticker: string;
    name?: string;
    asset_type?: "stock"|"crypto"|"etf";
    insight?: string;
    polygon_snapshot?: PolygonSnapshot
  };
};


export type SimpleTicker = {
  symbol_id: number,
  ticker: string,
  name: string,
  asset_type: 'stock' | 'crypto' | 'etf';
  polygon_snapshot?: PolygonSnapshot
};

export type BotMessagePart =
| { type: 'assistantText'; text: string, data?: any | null,sidebar?: boolean, both?: boolean }
| { type: 'knowledge_browser'; data: any,sidebar?: boolean,both?: boolean   }
| { type: 'comparison_pair_picker'; data: any,sidebar?: boolean,both?: boolean   }
| { type: 'follow_ups'; data: any,sidebar?: boolean,both?: boolean   }
| { type: 'analyze_ticker'; data?: any | null,sidebar?: boolean,both?: boolean  }
| { type: 'latest_news'; data?: any | null,sidebar?: boolean,both?: boolean  }
| { type: 'assets_list'; data?: any | null,sidebar?: boolean,both?: boolean  }
| { type: 'annotations'; data?: any | null,sidebar?: boolean,both?: boolean  }
| { type: 'comparison_sidebar'; data?: any | null,sidebar?: boolean,both?: boolean  }
| { type: 'portfolio_overview'; data: any, sidebar?: boolean,both?: boolean  }
| { type: 'tickers_list'; data: any, sidebar?: boolean,both?: boolean  }
| { type: 'comparison_table'; data: any, sidebar?: boolean,both?: boolean  }
| { type: 'comparison_chart'; data: any, sidebar?: boolean,both?: boolean  }
| { type: 'metric_comparison'; data: any, sidebar?: boolean,both?: boolean  }
| { type: 'tickers_chart'; data: any,sidebar?: boolean,both?: boolean   }
| { type: 'financials_table'; data: any,sidebar?: boolean,both?: boolean   }

| {
    type: 'tool_output';
    toolName: 'code_interpreter';
    input: string;
    output?: string;
    imageUrl?: string;
    metadata?: Record<string, any>;
    sidebar?: boolean,
    both?: boolean 
  };

export type Message = UserMessage | BotMessage;



export interface ConversationPair {
    id: string; // ✅ Unique identifier
    user: string;
    assistant: string;
    language: string;
    code?: string;
    analysisData?: any;
    tickerListData?:any;
    suggestionData?: any;
  }

export type Period = "1D" | "1W" | "1M" | "1Y" | "5Y" | "ID";

export interface PricePoint {
  time: number; // assuming a numeric timestamp
  price: number;
  x?: number;
  y?: number;
}

export interface DataPoint {
  timestamp: number;
  price: number;
  [key: string]: any; // allow additional fields
}

export interface DataPointWithX extends DataPoint {
  x: number;
}

export interface DataPointBase {
  price: number;
  [key: string]: any; // allow additional fields
}

export interface IndexedDataPoint extends DataPointBase {
  slot_index: number | null;
  slot_max: number | null;
  slot_position: number | null;
}

export interface DataPointWithXY extends DataPointBase {
  x: number | null;
  y: number;
}

export type IntradayMap = Map<Period, PricePoint[]>;

export interface LastUpdateRef {
  current: number;
}

export interface LastPriceResult {
  period: Period;
  last_price: number;
}

export type PriceDataMap = Map<Period, PricePoint[]>;

export interface Provider {
  name: string;
  logoUrl: string;
  url: string;
  [key: string]: any; // in case other fields exist
}

export const arabicMonthMap: Record<string, string> = {
  Jan: "ينا",
  Feb: "فبر",
  Mar: "مار",
  Apr: "أبر",
  May: "ماي",
  Jun: "يون",
  Jul: "يول",
  Aug: "أغس",
  Sep: "سبت",
  Oct: "أكت",
  Nov: "نوف",
  Dec: "ديس",
};
