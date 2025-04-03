export type ChatSession = {
  id: string;
  title: string;
  interactions: Interaction[];
  createdAt: string;
  updatedAt: string;
};

export type Interaction = {
  id: string;
  userMessage: UserMessage;
  botMessage: BotMessage;
  timestamp: string;
  language: string;
};

export type UserMessage = {
  id: string;
  text: string;
  role?: string;
  language?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
};

export type BotMessagePart =
  | { type: 'assistantText'; content: string, data?: any | null }
  | { type: 'tickers_list'; data: any }
  | { type: 'tickers_chart'; data: any }
  | { type: 'ticker_analysis'; data: any }
  | { type: 'financials_table'; data: any }
  | {
      type: 'tool_output';
      toolName: 'code_interpreter';
      input: string;
      output?: string;
      imageUrl?: string;
      metadata?: Record<string, any>;
    };


  export type BotMessage = {
  id: string;
  role?: string;
  language: string;
  parts: BotMessagePart[];
  createdAt?: string;
  metadata?: Record<string, any>;
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
