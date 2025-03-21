import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTextBeforeHyphen } from "../utils/getTextBeforeHyphen";

import getSymbolSnapshot from "../../services/get_components_data/get_symbol_snapshot";
import fetch_symbol_info from "../../utils/fetch_symbol_info";
import fetchLatestPrice from "../../services/get_components_data/fetch_latest_price";


interface SymbolSnapshotData {
    snapshot: any; // or use actual type
    asset_type: string | null;
    symbol_id: string | null;
    symbol_name: string | null;
    lastLivePrice: number | null;
    percentageChange: number | null;
  }
  
  export function useSymbolSnapshot(symbol: string): SymbolSnapshotData {
    // ...existing logic

  const [symbolInfo, setSymbolInfo] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [lastLivePrice, setLastLivePrice] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  const symbol_id = symbolInfo?.id || null;
  const exchange_mic = symbolInfo?.exchange_mic || null;
  const asset_type = symbolInfo?.asset_type || null;
  const hsymbol_name = symbolInfo?.name || null;
  const symbol_name = getTextBeforeHyphen(hsymbol_name);

  const liveData = useSelector((state: any) => state.stocks[symbol] || []);

  // Fetch symbol info
  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        const info = await fetch_symbol_info(symbol);
        setSymbolInfo(info);
      } catch (err) {
        console.error("Error fetching symbol info:", err);
      }
    };

    fetchData();
  }, [symbol]);

  // Fetch snapshot data
  useEffect(() => {
    if (!symbol_id) return;

    const fetchSnapshot = async () => {
      try {
        const data = await getSymbolSnapshot(symbol, asset_type, symbol_id);
        setSnapshot(data || { last_close: 0, currency: "-" });
        setLastLivePrice(data.last_close);
      } catch (err) {
        console.error("🚨 Error fetching snapshot:", err);
      }
    };

    fetchSnapshot();
  }, [symbol_id]);

  // Update price and compute % change
  useEffect(() => {
    let isMounted = true;

    const updatePrice = async () => {
      let latestPrice;

      if (liveData.length > 0) {
        latestPrice = liveData[liveData.length - 1]?.price;
      } else {
        const fallback = await fetchLatestPrice(symbol_id);
        if (fallback && isMounted) {
          latestPrice = fallback.value;
        }
      }

      if (isMounted && latestPrice) {
        setLastLivePrice(latestPrice);
        if (snapshot?.last_close) {
          const change = ((latestPrice - snapshot.last_close) / snapshot.last_close) * 100;
          setPercentageChange(change);
        }
      }
    };

    updatePrice();
    const interval = setInterval(updatePrice, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [liveData, snapshot, symbol_id]);

  return {
    snapshot,
    asset_type,
    symbol_id,
    symbol_name,
    lastLivePrice,
    percentageChange,
  };
}
