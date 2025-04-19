import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { getChartData } from "../../services/database/fetch_chart_data";
import mergeIntradayData from "../../components/DataDriven/SymbolChart/utils/merge_intraday_data";
import getSymbolSnapshot from "../../services/database/get_symbol_snapshot.js";
import fetch_symbol_info from "../../services/database/fetch_symbol_info.js";
import formatTimestamp from "../../components/DataDriven/SymbolChart/utils/format_timestsamp";
import returnPriceLegendSegments from "../../components/DataDriven/SymbolChart/utils/compute_price_legend/return_price_legend_metadata";
import { assign_list_XYCoordinatesIndexSimple } from "../../components/DataDriven/SymbolChart/utils/compute_point_coordinates/compute_xy_index";
import computeLastPrices from "../../components/DataDriven/SymbolChart/utils/compute_last_prices";
import { computeHistoricalPercentage} from "../../components/DataDriven/SymbolChart/utils/compute_historical_percentage";

// Same logic, just moved into a hook:

import { PricePoint, IntradayMap, LastPriceResult, PriceDataMap} from "../../interfaces/index.js";


// Get a reference point for 'now' (e.g., roughly June 11, 2024 midday GMT)
// Using a fixed value makes the example consistent. Replace with Date.now() for dynamic time.
const now = 1718107200000; // Example timestamp

// Helper to create intervals (milliseconds)
// 
export type Period = "1D" | "1W" | "1M" | "1Y" | "5Y" | "ID";
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY; // Approximation
const YEAR = 365 * DAY; // Approximation

// Create the Map
const periodDataMap = new Map();

// --- 1D Data (e.g., last 24 hours, ~4hr intervals) ---
periodDataMap.set("1D",
[{"price":180279,"time":1745020800000},{"price":180220,"time":1745021672727},{"price":180264,"time":1745022545454},{"price":180193,"time":1745023418181},{"price":180327,"time":1745024290909},{"price":180247,"time":1745025163636},{"price":180250,"time":1745026036363},{"price":180261,"time":1745026909090},{"price":180463,"time":1745027781818},{"price":179916,"time":1745028654545},{"price":179990,"time":1745029527272},{"price":180135,"time":1745030400000},{"price":180095,"time":1745031272727},{"price":180497,"time":1745032145454},{"price":180660,"time":1745033018181},{"price":181162,"time":1745033890909},{"price":180554,"time":1745034763636},{"price":180694,"time":1745035636363},{"price":180359,"time":1745036509090},{"price":180808,"time":1745037381818},{"price":180790,"time":1745038254545},{"price":180650,"time":1745039127272},{"price":180298,"time":1745040000000},{"price":179668,"time":1745040872727},{"price":179812,"time":1745041745454},{"price":179368,"time":1745042618181},{"price":179620,"time":1745043490909},{"price":179663,"time":1745044363636},{"price":179614,"time":1745045236363},{"price":179550,"time":1745046109090},{"price":179556,"time":1745046981818},{"price":179577,"time":1745047854545},{"price":179611,"time":1745048727272},{"price":179484,"time":1745049600000},{"price":179494,"time":1745050472727},{"price":179490,"time":1745051345454},{"price":179274,"time":1745052218181},{"price":179070,"time":1745053090909},{"price":179227,"time":1745053963636},{"price":179000,"time":1745054836363},{"price":179000,"time":1745055709090},{"price":179000,"time":1745056581818},{"price":179517,"time":1745057454545},{"price":179072,"time":1745058327272},{"price":179000,"time":1745059200000},{"price":179093,"time":1745060072727},{"price":179008,"time":1745060945454},{"price":179501,"time":1745061818181},{"price":179273,"time":1745062690909},{"price":179957,"time":1745063563636},{"price":180086,"time":1745064436363},{"price":180352,"time":1745065309090},{"price":180051,"time":1745066181818},{"price":180158,"time":1745067054545},{"price":180322,"time":1745067927272},{"price":180630,"time":1745068800000},{"price":180373,"time":1745069672727},{"price":180555,"time":1745070545454},{"price":180603,"time":1745071418181},{"price":180623,"time":1745072290909},{"price":180702,"time":1745073163636},{"price":180756,"time":1745074036363},{"price":180808,"time":1745074909090},{"price":180977,"time":1745075781818},{"price":181062,"time":1745076654545},{"price":181122,"time":1745077527272},{"price":181133,"time":1745078400000},{"price":181104,"time":1745079272727},{"price":181229,"time":1745080145454},{"price":181181,"time":1745081018181},{"price":181280,"time":1745081890909},{"price":181088,"time":1745082763636},{"price":180904,"time":1745083636363},{"price":180833,"time":1745084509090},{"price":181162,"time":1745085381818},{"price":181181,"time":1745086254545},{"price":180819,"time":1745087127272},{"price":180676,"time":1745088000000},{"price":181353,"time":1745088872727},{"price":181713,"time":1745089745454},{"price":181617,"time":1745090618181},{"price":181582,"time":1745091490909},{"price":181801,"time":1745092363636},{"price":182278,"time":1745093236363},{"price":182925,"time":1745094109090},{"price":183000,"time":1745094981818},{"price":183000,"time":1745095854545},{"price":183000,"time":1745096727272},{"price":183000,"time":1745097600000},{"price":182842,"time":1745098472727},{"price":183000,"time":1745099345454},{"price":183000,"time":1745100218181},{"price":182854,"time":1745101090909},{"price":182854,"time":1745101963636},{"price":182957,"time":1745102836363},{"price":183000,"time":1745103709090},{"price":183000,"time":1745104581818},{"price":183000,"time":1745105454545},{"price":182645,"time":1745106327272},{"price":182648,"time":1745107200000}]
);
// --- 1W Data (e.g., last 6 business days, daily intervals) ---
periodDataMap.set("1W", 
[{"price":170000,"time":1744502400000},{"price":170000,"time":1744508509090},{"price":170516,"time":1744514618181},{"price":170720,"time":1744520727272},{"price":170950,"time":1744526836363},{"price":171149,"time":1744532945454},{"price":171304,"time":1744539054545},{"price":171246,"time":1744545163636},{"price":171133,"time":1744551272727},{"price":170849,"time":1744557381818},{"price":170959,"time":1744563490909},{"price":170870,"time":1744569600000},{"price":171188,"time":1744575709090},{"price":171842,"time":1744581818181},{"price":171893,"time":1744587927272},{"price":171792,"time":1744594036363},{"price":172004,"time":1744600145454},{"price":171870,"time":1744606254545},{"price":172317,"time":1744612363636},{"price":172527,"time":1744618472727},{"price":172402,"time":1744624581818},{"price":171732,"time":1744630690909},{"price":171947,"time":1744636800000},{"price":171575,"time":1744642909090},{"price":171621,"time":1744649018181},{"price":171321,"time":1744655127272},{"price":171333,"time":1744661236363},{"price":171226,"time":1744667345454},{"price":170947,"time":1744673454545},{"price":171090,"time":1744679563636},{"price":170760,"time":1744685672727},{"price":170285,"time":1744691781818},{"price":170000,"time":1744697890909},{"price":170000,"time":1744704000000},{"price":170376,"time":1744710109090},{"price":170037,"time":1744716218181},{"price":170014,"time":1744722327272},{"price":170000,"time":1744728436363},{"price":170000,"time":1744734545454},{"price":170000,"time":1744740654545},{"price":170000,"time":1744746763636},{"price":170077,"time":1744752872727},{"price":170590,"time":1744758981818},{"price":170327,"time":1744765090909},{"price":170945,"time":1744771200000},{"price":171484,"time":1744777309090},{"price":171561,"time":1744783418181},{"price":171796,"time":1744789527272},{"price":171760,"time":1744795636363},{"price":171883,"time":1744801745454},{"price":172018,"time":1744807854545},{"price":171488,"time":1744813963636},{"price":171460,"time":1744820072727},{"price":171761,"time":1744826181818},{"price":171693,"time":1744832290909},{"price":171782,"time":1744838400000},{"price":172140,"time":1744844509090},{"price":172095,"time":1744850618181},{"price":172465,"time":1744856727272},{"price":171945,"time":1744862836363},{"price":171766,"time":1744868945454},{"price":171766,"time":1744875054545},{"price":171963,"time":1744881163636},{"price":172084,"time":1744887272727},{"price":172126,"time":1744893381818},{"price":171789,"time":1744899490909},{"price":172116,"time":1744905600000},{"price":172322,"time":1744911709090},{"price":172321,"time":1744917818181},{"price":172326,"time":1744923927272},{"price":172251,"time":1744930036363},{"price":172462,"time":1744936145454},{"price":172537,"time":1744942254545},{"price":172601,"time":1744948363636},{"price":172956,"time":1744954472727},{"price":172615,"time":1744960581818},{"price":172878,"time":1744966690909},{"price":173077,"time":1744972800000},{"price":173041,"time":1744978909090},{"price":172995,"time":1744985018181},{"price":173178,"time":1744991127272},{"price":173205,"time":1744997236363},{"price":173572,"time":1745003345454},{"price":173710,"time":1745009454545},{"price":173850,"time":1745015563636},{"price":173686,"time":1745021672727},{"price":174120,"time":1745027781818},{"price":174040,"time":1745033890909},{"price":173803,"time":1745040000000},{"price":173564,"time":1745046109090},{"price":173737,"time":1745052218181},{"price":173710,"time":1745058327272},{"price":173099,"time":1745064436363},{"price":173548,"time":1745070545454},{"price":173916,"time":1745076654545},{"price":174181,"time":1745082763636},{"price":174533,"time":1745088872727},{"price":174161,"time":1745094981818},{"price":174341,"time":1745101090909},{"price":174569,"time":1745107200000}]
);

// --- 1M Data (e.g., last ~6 weeks, weekly intervals) ---
periodDataMap.set("1M", 
[{"price":172190,"time":1742428800000},{"price":172028,"time":1742455854545},{"price":172222,"time":1742482909090},{"price":172510,"time":1742509963636},{"price":172217,"time":1742537018181},{"price":172494,"time":1742564072727},{"price":172425,"time":1742591127272},{"price":172186,"time":1742618181818},{"price":171993,"time":1742645236363},{"price":172037,"time":1742672290909},{"price":171977,"time":1742699345454},{"price":171768,"time":1742726400000},{"price":171820,"time":1742753454545},{"price":171904,"time":1742780509090},{"price":171552,"time":1742807563636},{"price":171222,"time":1742834618181},{"price":171524,"time":1742861672727},{"price":171390,"time":1742888727272},{"price":171612,"time":1742915781818},{"price":171707,"time":1742942836363},{"price":171258,"time":1742969890909},{"price":171004,"time":1742996945454},{"price":171338,"time":1743024000000},{"price":171133,"time":1743051054545},{"price":170971,"time":1743078109090},{"price":171238,"time":1743105163636},{"price":171156,"time":1743132218181},{"price":171192,"time":1743159272727},{"price":171148,"time":1743186327272},{"price":171143,"time":1743213381818},{"price":171170,"time":1743240436363},{"price":171196,"time":1743267490909},{"price":171353,"time":1743294545454},{"price":171358,"time":1743321600000},{"price":171360,"time":1743348654545},{"price":171258,"time":1743375709090},{"price":171074,"time":1743402763636},{"price":171381,"time":1743429818181},{"price":171620,"time":1743456872727},{"price":171615,"time":1743483927272},{"price":171649,"time":1743510981818},{"price":171404,"time":1743538036363},{"price":171254,"time":1743565090909},{"price":171266,"time":1743592145454},{"price":171296,"time":1743619200000},{"price":171318,"time":1743646254545},{"price":171331,"time":1743673309090},{"price":171659,"time":1743700363636},{"price":171585,"time":1743727418181},{"price":171503,"time":1743754472727},{"price":171673,"time":1743781527272},{"price":171694,"time":1743808581818},{"price":171710,"time":1743835636363},{"price":171872,"time":1743862690909},{"price":172024,"time":1743889745454},{"price":171648,"time":1743916800000},{"price":171094,"time":1743943854545},{"price":170497,"time":1743970909090},{"price":170809,"time":1743997963636},{"price":171338,"time":1744025018181},{"price":171124,"time":1744052072727},{"price":170649,"time":1744079127272},{"price":170989,"time":1744106181818},{"price":171301,"time":1744133236363},{"price":170837,"time":1744160290909},{"price":171069,"time":1744187345454},{"price":170647,"time":1744214400000},{"price":171143,"time":1744241454545},{"price":171389,"time":1744268509090},{"price":171749,"time":1744295563636},{"price":172186,"time":1744322618181},{"price":171881,"time":1744349672727},{"price":171887,"time":1744376727272},{"price":171417,"time":1744403781818},{"price":171440,"time":1744430836363},{"price":171219,"time":1744457890909},{"price":171546,"time":1744484945454},{"price":171484,"time":1744512000000},{"price":170926,"time":1744539054545},{"price":170658,"time":1744566109090},{"price":170718,"time":1744593163636},{"price":170220,"time":1744620218181},{"price":170770,"time":1744647272727},{"price":170213,"time":1744674327272},{"price":170765,"time":1744701381818},{"price":170570,"time":1744728436363},{"price":170517,"time":1744755490909},{"price":170964,"time":1744782545454},{"price":170612,"time":1744809600000},{"price":170987,"time":1744836654545},{"price":170277,"time":1744863709090},{"price":170000,"time":1744890763636},{"price":170578,"time":1744917818181},{"price":170472,"time":1744944872727},{"price":170772,"time":1744971927272},{"price":170260,"time":1744998981818},{"price":170786,"time":1745026036363},{"price":170137,"time":1745053090909},{"price":170000,"time":1745080145454},{"price":170589,"time":1745107200000}]
);

// --- 1Y Data (e.g., last year, ~2-month intervals) ---
periodDataMap.set("1Y", 

  [{"price":159545,"time":1713571200000},{"price":159509,"time":1713889745454},{"price":159477,"time":1714208290909},{"price":159216,"time":1714526836363},{"price":159364,"time":1714845381818},{"price":159783,"time":1715163927272},{"price":159371,"time":1715482472727},{"price":158974,"time":1715801018181},{"price":159153,"time":1716119563636},{"price":159575,"time":1716438109090},{"price":159965,"time":1716756654545},{"price":160786,"time":1717075200000},{"price":161566,"time":1717393745454},{"price":160935,"time":1717712290909},{"price":160918,"time":1718030836363},{"price":161222,"time":1718349381818},{"price":160920,"time":1718667927272},{"price":160719,"time":1718986472727},{"price":161121,"time":1719305018181},{"price":160974,"time":1719623563636},{"price":160971,"time":1719942109090},{"price":160998,"time":1720260654545},{"price":160901,"time":1720579200000},{"price":160523,"time":1720897745454},{"price":160987,"time":1721216290909},{"price":161170,"time":1721534836363},{"price":161463,"time":1721853381818},{"price":161783,"time":1722171927272},{"price":161543,"time":1722490472727},{"price":161604,"time":1722809018181},{"price":161543,"time":1723127563636},{"price":161867,"time":1723446109090},{"price":162082,"time":1723764654545},{"price":162386,"time":1724083200000},{"price":162721,"time":1724401745454},{"price":162817,"time":1724720290909},{"price":162944,"time":1725038836363},{"price":162857,"time":1725357381818},{"price":162872,"time":1725675927272},{"price":162443,"time":1725994472727},{"price":162319,"time":1726313018181},{"price":162865,"time":1726631563636},{"price":162546,"time":1726950109090},{"price":162360,"time":1727268654545},{"price":162566,"time":1727587200000},{"price":162979,"time":1727905745454},{"price":162805,"time":1728224290909},{"price":163255,"time":1728542836363},{"price":162677,"time":1728861381818},{"price":162641,"time":1729179927272},{"price":162386,"time":1729498472727},{"price":162584,"time":1729817018181},{"price":162655,"time":1730135563636},{"price":162934,"time":1730454109090},{"price":162719,"time":1730772654545},{"price":162449,"time":1731091200000},{"price":162505,"time":1731409745454},{"price":162329,"time":1731728290909},{"price":162290,"time":1732046836363},{"price":161963,"time":1732365381818},{"price":162186,"time":1732683927272},{"price":162542,"time":1733002472727},{"price":162967,"time":1733321018181},{"price":162619,"time":1733639563636},{"price":161988,"time":1733958109090},{"price":161552,"time":1734276654545},{"price":160996,"time":1734595200000},{"price":160925,"time":1734913745454},{"price":160629,"time":1735232290909},{"price":160726,"time":1735550836363},{"price":160961,"time":1735869381818},{"price":161087,"time":1736187927272},{"price":160860,"time":1736506472727},{"price":160793,"time":1736825018181},{"price":160695,"time":1737143563636},{"price":160479,"time":1737462109090},{"price":160277,"time":1737780654545},{"price":160405,"time":1738099200000},{"price":160598,"time":1738417745454},{"price":159973,"time":1738736290909},{"price":160100,"time":1739054836363},{"price":160701,"time":1739373381818},{"price":160696,"time":1739691927272},{"price":160748,"time":1740010472727},{"price":160849,"time":1740329018181},{"price":161704,"time":1740647563636},{"price":161906,"time":1740966109090},{"price":161484,"time":1741284654545},{"price":161205,"time":1741603200000},{"price":160876,"time":1741921745454},{"price":160624,"time":1742240290909},{"price":160130,"time":1742558836363},{"price":159888,"time":1742877381818},{"price":160068,"time":1743195927272},{"price":159777,"time":1743514472727},{"price":159905,"time":1743833018181},{"price":160205,"time":1744151563636},{"price":160068,"time":1744470109090},{"price":159754,"time":1744788654545},{"price":160190,"time":1745107200000}]
);

// --- A (All Time) Data (e.g., last 6 years, yearly intervals) ---
periodDataMap.set("5Y", 
[{"price":140125,"time":1587340800000},{"price":140177,"time":1588934400000},{"price":140097,"time":1590528000000},{"price":140210,"time":1592121600000},{"price":140097,"time":1593715200000},{"price":140314,"time":1595308800000},{"price":140805,"time":1596902400000},{"price":141122,"time":1598496000000},{"price":140846,"time":1600089600000},{"price":140269,"time":1601683200000},{"price":140349,"time":1603276800000},{"price":139577,"time":1604870400000},{"price":139475,"time":1606464000000},{"price":139463,"time":1608057600000},{"price":139993,"time":1609651200000},{"price":139268,"time":1611244800000},{"price":139778,"time":1612838400000},{"price":140218,"time":1614432000000},{"price":140639,"time":1616025600000},{"price":140399,"time":1617619200000},{"price":140290,"time":1619212800000},{"price":140553,"time":1620806400000},{"price":140527,"time":1622400000000},{"price":141046,"time":1623993600000},{"price":141312,"time":1625587200000},{"price":141699,"time":1627180800000},{"price":141995,"time":1628774400000},{"price":141527,"time":1630368000000},{"price":141430,"time":1631961600000},{"price":141511,"time":1633555200000},{"price":141014,"time":1635148800000},{"price":140358,"time":1636742400000},{"price":140452,"time":1638336000000},{"price":140695,"time":1639929600000},{"price":141582,"time":1641523200000},{"price":141219,"time":1643116800000},{"price":141733,"time":1644710400000},{"price":142188,"time":1646304000000},{"price":142365,"time":1647897600000},{"price":142730,"time":1649491200000},{"price":142566,"time":1651084800000},{"price":142477,"time":1652678400000},{"price":142330,"time":1654272000000},{"price":142013,"time":1655865600000},{"price":142274,"time":1657459200000},{"price":141696,"time":1659052800000},{"price":141370,"time":1660646400000},{"price":141096,"time":1662240000000},{"price":141237,"time":1663833600000},{"price":141468,"time":1665427200000},{"price":141776,"time":1667020800000},{"price":140976,"time":1668614400000},{"price":141232,"time":1670208000000},{"price":141768,"time":1671801600000},{"price":141478,"time":1673395200000},{"price":141860,"time":1674988800000},{"price":142076,"time":1676582400000},{"price":142155,"time":1678176000000},{"price":142233,"time":1679769600000},{"price":142329,"time":1681363200000},{"price":142223,"time":1682956800000},{"price":142288,"time":1684550400000},{"price":142221,"time":1686144000000},{"price":142109,"time":1687737600000},{"price":142454,"time":1689331200000},{"price":142073,"time":1690924800000},{"price":142836,"time":1692518400000},{"price":143052,"time":1694112000000},{"price":143211,"time":1695705600000},{"price":143529,"time":1697299200000},{"price":143581,"time":1698892800000},{"price":143937,"time":1700486400000},{"price":144064,"time":1702080000000},{"price":144182,"time":1703673600000},{"price":144456,"time":1705267200000},{"price":144543,"time":1706860800000},{"price":144689,"time":1708454400000},{"price":144982,"time":1710048000000},{"price":145621,"time":1711641600000},{"price":145532,"time":1713235200000},{"price":145068,"time":1714828800000},{"price":144415,"time":1716422400000},{"price":144713,"time":1718016000000},{"price":144558,"time":1719609600000},{"price":145090,"time":1721203200000},{"price":145013,"time":1722796800000},{"price":145169,"time":1724390400000},{"price":145334,"time":1725984000000},{"price":145713,"time":1727577600000},{"price":145800,"time":1729171200000},{"price":145769,"time":1730764800000},{"price":145939,"time":1732358400000},{"price":146362,"time":1733952000000},{"price":146980,"time":1735545600000},{"price":146737,"time":1737139200000},{"price":146836,"time":1738732800000},{"price":146433,"time":1740326400000},{"price":146116,"time":1741920000000},{"price":145632,"time":1743513600000},{"price":145907,"time":1745107200000}]



);

periodDataMap.set("ID", [
   
  ]);

// --- You can now use periodDataMap ---
// Example: Get 1W data
// const weeklyData = periodDataMap.get("1W");
// console.log(weeklyData);

console.log("Generated periodDataMap:", periodDataMap);


export function usePortfolioChart(symbol: string, width: number, height: number) {

 const [snapShot, setSnapshot] = useState({ last_close: 0, currency: "-" });
//   const [symbolInfo, setSymbolInfo] = useState<any>(null);
//   useEffect(() => {
//     async function fetchData() {
//       if (!symbol) return;
//       try {
//         const info = await fetch_symbol_info(symbol);
//         setSymbolInfo(info);
//       } catch (error) {
//         console.error("Error fetching symbol info:", error);
//       }
//     }
//     fetchData();
//   }, [symbol]);
  
//   const symbol_id = symbolInfo?.id || null;
//   const exchange_mic = symbolInfo?.exchange_mic || null;
//   const asset_type = symbolInfo?.asset_type || null;
//   const symbol_name = symbolInfo?.name || null;

//   const [snapShot, setSnapshot] = useState({ last_close: 0, currency: "-" });
//   useEffect(() => {
//     if (!symbol_id) return; 
//     async function fetchSnapshot() {
//       try {
//         const data = await getSymbolSnapshot(symbol, asset_type, symbol_id);
//         setSnapshot(data || { last_close: 0, currency: "-" });
//       } catch (error) {
//         console.error("🚨 Error fetching snapshot:", error);
//       }
//     }
//     fetchSnapshot();
//   }, [symbol_id]);

//   // 3) Market open logic
//   const [isMarketOpen, setMarketOpen] = useState(false);
  
//   const checkMarketStatus = async () => {
//     try {
//       const response = await fetch("api/market_status", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           asset_type,     // e.g. "stock" or "crypto"
//           exchange_mic,   // e.g. "XNAS"
//         }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Request failed with status ${response.status}`);
//       }
  
//       const data = await response.json();
//       const marketOpen: boolean = data.isOpen;
  
//       setMarketOpen(marketOpen);
//     } catch (error) {
//       console.error("❌ Error checking market status:", error);
//       setMarketOpen(false); // Fallback to false on error
//     }
//   };
  
//   useEffect(() => {
//     if (!asset_type || !exchange_mic) return;
//     // Check once
//     checkMarketStatus();
//     // Check every minute
//     const interval = setInterval(() => {
//       checkMarketStatus();
//     }, 60 * 1000);
//     return () => clearInterval(interval);
//   }, [asset_type, exchange_mic]);

//   // 4) Chart data logic

 const [seriesesData, setSeriesesData] = useState<PriceDataMap>(periodDataMap);

  const lastUpdateTimeRef = useRef<number>(0);

//   useEffect(() => {
//     if (!symbol_id || !exchange_mic || !asset_type) {
//       console.warn("⏭️ Skipping getChartData - Missing required values.");
//       return;
//     }
  
  // 5) Intraday data + live data merging logic
  const [intradayData, setIntradayData] = useState<any[]>([]);
  useEffect(() => {
   
    setIntradayData(seriesesData.get("ID") || []);
  }, [seriesesData]);

  const liveData = useSelector((state: any) => state.stocks[symbol] || []);
  
useEffect(() => {
    if (!liveData.length) return;
  
    const newPoints: PricePoint[] = liveData
      .map((entry) => ({
        time: entry.timestamp,
        price: entry.price,
      }))
      .filter((point) => point.time > lastUpdateTimeRef.current)
      .sort((a, b) => a.time - b.time);
  
    if (newPoints.length === 0) return;
  
    setSeriesesData((prevMap: IntradayMap) => {
      const updatedMap = mergeIntradayData(prevMap, newPoints, lastUpdateTimeRef);
      setIntradayData(updatedMap.get("1D") || []);
      return updatedMap;
    });
  }, [liveData, seriesesData]);

  // 6) Period + computed values
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1D");

  const periodData: PricePoint[] = seriesesData.get(selectedPeriod) || [];
  const prices = periodData.map((d: any) => d.price);
  const dayMin = prices.length > 0 ? Math.min(...prices) : 0;
  const dayMax = prices.length > 0 ? Math.max(...prices) : 0;

  const preferredPeriod: Period = "1D"; // ✅ not "ID"
  
  const fallbackPeriod: Period = "1D"; // ✅ not "ID"

  const mostRecentPeriodData = seriesesData.get(preferredPeriod)?.length
    ? seriesesData.get(preferredPeriod)
    : seriesesData.get(fallbackPeriod);
  const currentPrice = mostRecentPeriodData?.length
    ? mostRecentPeriodData[mostRecentPeriodData.length - 1].price
    : snapShot.last_close || 0;
  const lastUpdatedTimestamp = mostRecentPeriodData?.length
    ? mostRecentPeriodData[mostRecentPeriodData.length - 1].time
    : snapShot.last_close || 0;

  const lastUpdated = formatTimestamp(lastUpdatedTimestamp);

  const range = dayMax - dayMin;
  const padding = range * 0.15; 
  const adjustedHigh = dayMax + padding;
  const adjustedLow = Math.floor(dayMin - padding);




  const priceLegendSegments = useMemo(() => {
    return dayMin !== undefined && dayMax !== undefined
      ? returnPriceLegendSegments(adjustedLow, adjustedHigh)
      : [];
  }, [dayMin, dayMax]);


const dataPoints: PricePoint[] = seriesesData.get("ID") || [];
const timeLegendPercentage = computeHistoricalPercentage(dataPoints, selectedPeriod);

//   const timeLegendPercentage = computeHistoricalPercentage(seriesesData.get("ID") || [], selectedPeriod);

  const [relevant_close, setRelevantClose] = useState(0);
  useEffect(() => {
    if (periodData.length > 0) {
      setRelevantClose(periodData[0]?.price || 0);
    }
  }, [periodData, selectedPeriod]);

  const isPositiveChange = currentPrice > relevant_close;

  // 7) Combine final chart data
  const firstpartwidth = useMemo(() => {
    return (width * timeLegendPercentage) / 100 - 10;
  }, [width, timeLegendPercentage]);


//   console.log("series data in context is: ", seriesesData)
  
  const lastPrices: LastPriceResult[] = computeLastPrices(seriesesData);

  const offsetX = selectedPeriod === "1D" ? 0 : firstpartwidth;
  const intradaywidth = width - offsetX;

  const finalPeriodData = useMemo(() => {
    
    // 1) Compute periodData coords
    const periodData_with_coos = assign_list_XYCoordinatesIndexSimple(
      periodData,
      width,
      adjustedLow,
      adjustedHigh,
      height,
      0,       
      0       
    );

    // 2) Compute intraday coords
    const intradayData_With_Coos = assign_list_XYCoordinatesIndexSimple(
      intradayData,
      intradaywidth,
      adjustedLow,
      adjustedHigh,
      height,
      offsetX,
      0 
    );
  
    // 3) Merge the two
    return periodData_with_coos.concat(intradayData_With_Coos);
  
    // Add all relevant dependencies
  }, [
    periodData,
    intradayData,
    firstpartwidth,
    intradaywidth,
    adjustedLow,
    adjustedHigh,
    height,
    width,
    offsetX
  ]);

  // ✅ Return everything needed by SymbolChart's rendering
  return {
    selectedPeriod,
    setSelectedPeriod,
    periodData,
    currentPrice,
    snapShot,
    lastUpdated,
    isPositiveChange,
    finalPeriodData,
    priceLegendSegments,
    timeLegendPercentage,
    lastPrices,
    adjustedLow,
    adjustedHigh,
  };
}
