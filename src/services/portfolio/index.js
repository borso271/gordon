/*

The idea for this is that the bot will just call


show_tickers_table

might be called with the 

ASK TO SHOW THE TABLE TO GPT...
WITH THE STOCKS...





Rethink about infrastructure.
Try making a fetch_symbols_financials

and show_symbols_chart function,
then try to ask for comparison...


The financials that you ask might be too many, but you can instruct the bot on specific keys...


Always fall back to web...


Or: fetch financials, give it back to gpt and say: these are the financials for the comparison,
call show_chart with appl and goog
symbol, for comparison..., you can ask: when fit display comparisons to the user in tables...

Or, JUST ADD THE TABLES AND OTHER ELEMENTS TO THE CHAT...


NEXT THING TO UNDERSTAND IS HOW EXACTLY TO KEEP TRACK OF THE CHAT HISTORY, GIVEN IT CAN HAVE DIFFERENT ELEMENTS.


1. BY TODAY YOU HAVE COMPARISON,
2. AND YOU HAVE LISTS WITH MORE PARAMETERS...

You have messages, or chart, or analysis, etc.
and you need a single scroll, which means rethinking what is rendered...


---

BY TOMORROW, YOU TRY THE PORTFOLIO STUFF...


*/