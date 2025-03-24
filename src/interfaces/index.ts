
export interface ConversationPair {
    id: string; // ✅ Unique identifier
    user: string;
    assistant: string;
    language: string;
    code?: string;
    analysisData?: any;
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