/*

we need a route to get ticker snapshot info...

gts the snapshot code as input and returns the data for the snapshot,
also handle subscription to websocket, so you can display the latest value...

For demo is fine...
Either you have latest price, subscription limited to 50 stocks...
or just display a random value, that is the last historical data.
Keep historical data for now.

Just use trading view for the chart.

Then save the conversations in the database in a smart way.


You cannot have the same results twice over...


1. Make the snapshot info route.
2. Save conversations in the databse.

3. Make a unique flow version and see how well it works... if you can switch back.
4. Start infrastructure for portfolio page with tables for the user stocks...
5. Have the download function that takes something and you download it...


---

6. Do stock quierying based on analysit ratings as well.

---

1. Build a microservice for backtracking.
2. Strategy.
3. Index overview of documents with llama index.
4. Analysis.
5. Snapshot.
6. Comparison. Give chart, and compare perhaps in a list the data of the two stocks.
7. Lists of stocks.
8. Portfolio maker.

---
9. Common database, but a service of each of them.
---

Other things:
6. Documents search. Hey, do I have a document on whatever (try llama index)

6. If you do strategy it must be into two parts.
   Ok, we need to select a portfolio before making a strategy. I can pick a portfolio from a
   bunch based on your preferences, but I need to know something about your preference, is that all right?
   I can select a nice portfolio for you but i need some infomation, or I can propose some
   popular ones...

   // then it can call a function...

   Ok I want this portfolio...

   Mmmm, ok, based on your preference, i selected this out of our list of strategies...
   and then tell more about that...

7. Backtesting...




TRY other functionalities...
like pyportfolio op
and backtesting...


and then the single line of action will be buy, that will send the user to a specific page, return data about what he wants to
buy to whatever interface, from which it will need to confirm...



*/