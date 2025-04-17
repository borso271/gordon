export function computeRange(a: number, b: number): [number, number] {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
  
    const bothPositive = min >= 0 && max >= 0;
  
    const rangeMin = bothPositive ? 0 : min - Math.abs(min) * 0.2;
    const rangeMax = max + Math.abs(max) * 0.2;
  
    return [rangeMin, rangeMax];
  }

  export function computeZeroHeight(
    maxHeight: number,
    rangeMin: number,
    rangeMax: number
  ): number {
    if (rangeMin >= 0) return 0;
    
    if (rangeMin <= 0 && rangeMax <=0) return maxHeight;
  
    const range = rangeMax - rangeMin;
    const zeroPosition = Math.abs(rangeMin) / range;
  
    return zeroPosition * maxHeight;
  }
  