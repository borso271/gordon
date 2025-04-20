export function formatPrice(price: number, locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }
  