/*

The idea is to create a canvas for the legend, rather than a html element.

A canvas is computed and used for the legend.
The x and y.


- So the idea is that you have a list of points each with its own timestamp as input, which is easy.
  For the day chart actually really opening and ending and timestamp will not be bad at all!
  You might go on with the partitioning idea, and use timestamps for the day-relative part.

- There remains the problem of the legend... The idea 
  
  |-------------------------|---|
  you have the things divided in todays's part and historical part,

  the coordinates are computed indipendently...
  what about the labels?
  
  Once this is done, you have actually timestamps assigned through all the line.
  And you can extract legend elements and coordinates.
  
  If stock market is open you have that extra space, else you don't.

  That's a little masterpiece of a chart.

  Try to implement it today.



  Steps:
  if market is open, divide in two. Or actually just always divide in two,
  compute the fraction of space needed for one and the other
  given the data you have and the number of dates that you need, and the resolution of dates that you need...
  
  Store time also as date and not just as timestamp.
  So that when you fetch the data, you actually have also that info,
  and you look for the first date element (say the first exact date), then the second, and so on.
  

  ---

  It should actually be easy for year/5 years:
  just take the first day in a month. And that's it.

  


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Have as input:
  - The granulatiry of the date you want, can be month, day, hour, 30 minutes, and so.
    It is an INTERVAL of time.

  - The number of points that you want, or a range thereof:
    It is an INTEGER

  - A set of data that is the chart_points data with price and timestamps.

  - Return: a list of object {label: (for example feb, or 14:00),
                              timestamp: its timestamp,
                               date: the date:
                               index, the index that is then used for the percentage calculation,
                               percentage: compute already the percentage using the max index as well}

  This data is enough to construct the legend.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

The only problem yet to face is how to handle the extra space...
That has indeed a custom label and percentage.

Should you have a unique set of indexes, but that are used differently to compute the


part
part start x
index...

So that you actually have a list of points where you have not only the
- point_index 
- timestamp(s)
- price
- group id

In the case of day, though, you really have only one part, not two, and that part
always has a defined timestamp, and points SHOULD BE ORGANIZED BY TIMESTAMP.

So the daily chart is a different thing.

---

In the case of a NOT-INTRADAY chart, the thing is done differently.



So according to this option, you actually have intraday and not intraday and according to this,
the point's x and y are computed differently, so you might very well have two different components,
that have the same styles... but for which the x and y really change.

However, since really what the chart does is simply display points based on x and y and that's it.
You should have a general function that computes x and y coordinates.



So you have the chart, and based on the selected period and on the data,
you use the function computeChartData, that returns the legend(s) and the chart line data.

This data is then passed to the legend(s) components and to the chartCanvas component to be displayed,
but the component is only one.



So you need:
computeChartData

computeChartData(seriesData, period, exchange_mic, asset_type, mobile) {

the first thing this does is:
- compute the two parts and its relative x and y percentages.
- You will always use indexes for the left part of the chart, and timestamps for the right part of the chart.
  (or indexes if you want)

- so really its the legend labels and coordinates that you need to compute

}


*/