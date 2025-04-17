import { SingleAsset } from "../../../../../interfaces";

interface AssetTypePercentage {
  label: string;
  percentage: number;
}

export function getAssetTypeBreakdown(assets: SingleAsset[]): AssetTypePercentage[] {
  const totalAssets = assets.length;
  if (totalAssets === 0) return [];

  const typeCount: Record<string, number> = {};

  assets.forEach(asset => {
    const type = asset.asset_type;
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  return Object.entries(typeCount).map(([type, count]) => ({
    label: type,
    percentage: (count / totalAssets) * 100,
  }));
}
