// components/BotMessagePartRenderer.tsx
import React from "react";
import { BotMessagePart } from "../../../interfaces";
import AssistantMessage from "../../Chat/components/AssistantMessage";
import TradingViewSingleChart from '../../TradingView/SingleChart'
import DataTable from "../../DataTable";

// import ComparisonChart from "../../../app/sections/comparison/components/ComparisonChart";
import MetricComparison from "../../../app/sections/comparison/components/MetricComparison";
import PortfolioSummary from "../../../app/sections/portfolio_overview/PortfolioSidebar";
import AnalysisView from "../../AnalysisView";
import ComparisonSidebar from "../../../app/sections/comparison";
import Annotations from "../../Annotations";
import AssetsWithInsight from "../../AssetsWithInsight";
import NewsList from "../../NewNews/NewsList";
import PickPair from "../../../app/sections/comparison/PickPair";
interface Props {
  part: BotMessagePart;
  language: string;
}

const BotMessagePartRenderer: React.FC<Props> = ({ part, language="en" }) => {

    //console.log("in renderer, data is: ", part)
  switch (part.type) {
    case "assistantText":
      return  <AssistantMessage
      
      heading={""} // or parse a heading from content if you want
      text={part.text}
    />;


    case "tickers_chart":

       return  <TradingViewSingleChart
        language = {language}
          symbol = {part.data.tickers[0]}
           currency = {part.data.currency}
              />;



              case "comparison_pair_picker":

              return  <PickPair
              
                     />;

            
              

    case "assets_list":

    return  <AssetsWithInsight

    data = {part.data}
           />;
  
    case "financials_table":
      return   <DataTable 
      title = {part.data.title}
      data = {part.data.data}
      />;

      case "analyze_ticker":
        return   <AnalysisView
        data = {part.data}
        />;


    case "latest_news":
      return   <NewsList
      data = {part.data}
      />;


    case "portfolio_overview":
      return   <PortfolioSummary
      data = {part.data}
      />;


    case "comparison_sidebar":
        return   <ComparisonSidebar 
        data = {part.data}
        />;

    case "annotations":
      return   <Annotations 
      data = {part.data}
      />;

    case "metric_comparison":
       
        return   <MetricComparison 
        rawData = {part.data}
        />;

  
    default:
      return null; // Or <UnknownPart type={part.type} />
  }
};

export default BotMessagePartRenderer;

