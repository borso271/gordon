import React, { useEffect, useRef, memo } from 'react';
import styles from './Snapshot.module.css'
type TradingViewSingleQuoteProps = {
  language: 'ar' | 'en';
  symbol: string;
};

const localeMap: Record<'ar' | 'en', string> = {
  ar: 'ar_AE',
  en: 'en',
};

const TradingViewSingleQuote: React.FC<TradingViewSingleQuoteProps> = ({ language, symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget (if any)
    containerRef.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      symbol,
      width: '100%',
      isTransparent: true,
      colorTheme: 'dark',
      locale: localeMap[language],
    };

    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
  }, [language, symbol]);

  return (
    <div className={styles.snapshotContainer}>
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href={language === 'ar' ? 'https://ar.tradingview.com/' : 'https://www.tradingview.com/'}
          rel="noopener nofollow"
          target="_blank"
        >
          {/* <span className="blue-text">
            {language === 'ar'
              ? 'تتبع جميع الأسواق على TradingView'
              : 'Track all markets on TradingView'}
          </span> */}
        </a>
      </div>
      </div>
    </div>
  );
};

export default memo(TradingViewSingleQuote);
