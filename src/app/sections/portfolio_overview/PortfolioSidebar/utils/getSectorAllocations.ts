import { SingleAsset } from "../../../../../interfaces";

interface SectorPercentage {
  label: string;
  percentage: number;
}

export function getSectorPercentageBreakdown(assets: SingleAsset[]): SectorPercentage[] {
  const stockAssets = assets.filter(asset => asset.asset_type === 'stock' && asset.sector);
  const totalStocks = stockAssets.length;

  if (totalStocks === 0) return [];

  const sectorCount: Record<string, number> = {};

  stockAssets.forEach(asset => {
    const sector = asset.sector!;
    sectorCount[sector] = (sectorCount[sector] || 0) + 1;
  });

  return Object.entries(sectorCount).map(([sector, count]) => ({
    label: sector,
    percentage: (count / totalStocks) * 100,
  }));
}
