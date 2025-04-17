import React, { useEffect, useRef, memo } from 'react';
import styles from './SingleChart.module.css'
type TradingViewChartProps = {
  language: string;
  symbol: string;    // e.g. "AAPL"
  currency: string;  // e.g. "USD"
};

const localeMap: Record<'ar' | 'en', string> = {
  ar: 'ar_AE',
  en: 'en',
};

const TradingViewSingleChart: React.FC<TradingViewChartProps> = ({ language, symbol, currency }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
    container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    const widgetConfig = {
      symbols: [
        [`${symbol}`, `${symbol}|1D|${currency}`],
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
      backgroundColor: "rgba(15, 15, 15, 0)",
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
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    container.current.appendChild(script);
  }, [language, symbol, currency]);

  return (
    <div className={styles.chartContainer}>
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href={language === 'ar' ? "https://ar.tradingview.com/" : "https://www.tradingview.com/"}
          rel="noopener nofollow"
          target="_blank"
        >
        
        </a>
      </div>
    </div>
    </div>
  );
};

export default memo(TradingViewSingleChart);
