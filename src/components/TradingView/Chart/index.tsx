import React, { useEffect, useRef, memo } from 'react';
import styles from './Chart.module.css'
type TradingViewChartProps = {
  args: any;
  language: string;
};

const localeMap: Record<'ar' | 'en', string> = {
  ar: 'ar_AE',
  en: 'en',
};

const returnWidgetConfig = (symbols, chart_type, style, currency, language) => {
  const firstSymbol = symbols[0];
  console.log("first symbol is: ", firstSymbol)
  const otherSymbols = symbols.slice(1);

  // A list of fallback colors to assign to comparison lines
  const lineColors = ["#FF9800", "#4CAF50", "#03A9F4", "#E91E63", "#9C27B0"];
  console.log("PARAMSSSSSSS for the chart are: ", symbols, chart_type, style, currency, language)

  if (style == "simple") {
    const chartConfig = {
      symbols: [
        [`${firstSymbol}|1D|${currency}`],
      ],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: localeMap[language],
      colorTheme: "dark",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      headerFontSize: "medium",
      backgroundColor: "transparent",
      lineWidth: 2,
      lineType: 0,
      dateRanges: [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M",
      ],
      // 👇 Conditionally add compareSymbol only if valid
      ...(chart_type == "comparison" && otherSymbols.length > 0 && {
        compareSymbol: {
          symbol: otherSymbols[0], // or format it like "NASDAQ:AAPL"
          lineColor: lineColors[0],
          lineWidth: 2,
          showLabels: true
        }
      })
    };

    return chartConfig;
  }

  else if (style == "advanced") {
    const firstSymbol = symbols[0];
    const otherSymbols = symbols.slice(1);
  
    const chartConfig = {
      autosize: true,
      symbol: firstSymbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: localeMap[language],
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
      ...(chart_type === "comparison" && otherSymbols.length > 0 && {
        compareSymbols: otherSymbols.map((symbol) => ({
          symbol: symbol,
          position: "SameScale"
        }))
      })
    };
return chartConfig
  }
  return null;
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({ args, language }) => {
  const container = useRef<HTMLDivElement>(null);
  const {tickers, currency, chart_type, style} = args;
  const mainSymbol = tickers[0];

  useEffect(() => {
    if (!container.current) return;
  
    // Clear previous widget (fully reset)
    container.current.innerHTML = "";
  
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
  
    // Proper config: script content must be a raw JS object
    script.innerHTML = JSON.stringify(returnWidgetConfig(tickers, chart_type, style, currency, language));
  
    // Create the outer container (must match TradingView spec)
    const wrapper = document.createElement("div");
    wrapper.className = "tradingview-widget-container__widget";
  
    container.current.appendChild(wrapper);
    container.current.appendChild(script);
  }, [language, tickers, currency, chart_type, style]);

  
  return (
    <div className={styles.chartContainer}>
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>

        <a
          href={language === 'ar' ? "https://ar.tradingview.com/" : "https://www.tradingview.com/"}
          rel="noopener nofollow"
          target="_blank"
        >
         
        </a>
      </div>
    </div>
    
    
  );
};

export default memo(TradingViewChart);




