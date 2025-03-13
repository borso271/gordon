"use client"

import React from 'react';

import ChartLoader from '../../../components/Loaders/ChartLoader';
import OuterLoader from '../../../components/Loaders/OuterLoader';
import AnalysisPartLoader from '../../../components/Loaders/AnalysisPartLoader';
import SuggestionsLoader from '../../../components/Loaders/SuggestionsLoader';
import RatingsNewsLoader from '../../../components/Loaders/RatingNewsLoader';
const TestCompPage = () => {
 
return (
  <>
// {/* <SnapshotLoader/> */}
<ChartLoader/>

<AnalysisPartLoader/>
<RatingsNewsLoader/>
<OuterLoader/>
<SuggestionsLoader/>

</>

)}

export default TestCompPage;
