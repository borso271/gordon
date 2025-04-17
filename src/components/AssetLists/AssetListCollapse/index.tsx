import React from 'react';
import ToggleList from '../../ToggleList';
import SingleAssetComponent from '../SingleAsset';
import { PortfolioItem } from '../../../interfaces';

interface AssetListProps {
  assets: PortfolioItem[];
  title: string;
}

const AssetListCollapse: React.FC<AssetListProps> = ({ assets, title }) => {
  if (!assets || assets.length === 0) return null;

  return (
    <ToggleList title={title}>
      {assets.map((item, index) => (
        <SingleAssetComponent key={index} {...item} />
      ))}
    </ToggleList>
  );
};

export default AssetListCollapse;
