import React from 'react';
import styles from './OverviewContent.module.css';

import AssetListCollapse from '../../../../../../components/AssetLists/AssetListCollapse';
import OverviewHeader from '../OverviewHeader';
// import SymbolChart from '../../../../../../components/DataDriven/PortfolioChart';
import SimpleChart from '../../../../../../components/DataDriven/SimpleChart';
import { PortfolioItem } from '../../../../../../interfaces';

import PercentageOverviewBox from '../../../../../../components/PercentageOverviewBox';
import { getTopPerformersAndLosers } from '../../utils/getWinnersLosers';
import { testchartdata } from '../../../../../../constants';
import { useTranslation } from 'react-i18next';



interface OverviewContentProps {
  filteredAssets: PortfolioItem[];
  filteredHistory:any;
  selectedAssetType: string;
  data:any;
}

const OverviewContent: React.FC<OverviewContentProps> = ({
  filteredAssets,
  filteredHistory,
  selectedAssetType,
  data
}) => {

  const { top_performers, top_losers } = getTopPerformersAndLosers(filteredAssets);

  const { t } = useTranslation();

  return (
    
<div className={styles.content}>

<OverviewHeader start_amount={10000} end_amount={12000}/>

<SimpleChart data={testchartdata} language={'en'}/>
{selectedAssetType === "stock" && (
  <PercentageOverviewBox
    titleKey="sector_allotment"
    items={data.stockSectorAllocation}
    labelWidth={105}
  />
)}

{selectedAssetType === "all" && (
  <PercentageOverviewBox
    titleKey="asset_type_allotment"
    items={data.assetTypeAllocation}
   
  />
)}


<AssetListCollapse assets={top_performers} title={t('top_winners')} />
<AssetListCollapse assets={top_losers} title={t('top_losers')} />
<AssetListCollapse assets={filteredAssets} title={t('all_assets')} />


    </div>
  );
};

export default OverviewContent;
