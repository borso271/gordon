
1. Decide what data you should have in.



https://github.com/npantfoerder/cryptocurrencies/blob/master/crypto_data.csv


------------

2. What filters do you accept?

- Type (etf, stock, crypto)...
- Sector/industry... to have exact matches you might use a vector similarity in case not found...
  (you should train the bot to know your categories), so for now just do what you can...
  Have ten limited sectors...
- Country...

- Market cap more than...
- Price more than...
- Founded after...

3. What sorting do you accept?
- Market Cap...
- Price...
- Founded...
- Best performing this year, this month...

------------

TODAY:

1. TODAY RERUN THE AGGREAGATOR, ADD STOCKS, AND KNOW WHERE YOU SHOULD TAKE OR UPDATE DATA FROM THE DATABASE.
FIX THE DATA ISSUE FOR TOMORROW WHERE YOU INSTEAD WILL DO THE ACTUAL FECTCHING...

Three things to do today:

0. add more crypto
1. Run for all
2. DO THE FETCHING FUNCTION

---------

you might want to test just TABLES first of all,
first thing: test tables...

and then you might also want to test lists just with search,
and try to use the questions the other bot uses...

... ... ... have also a different external api fetch data

---------

Instructions:

When a user asks for a list of securities, call the `get_securities_list` function.

Do not ask the user to specify filters like asset type, sector, or sorting preference unless they provide that information themselves.

If the user doesn’t mention a filter or sorting option, just use the default values defined in the function schema.

Your goal is to provide results quickly and smoothly, without requiring the user to make extra decisions.

---------

{
  "name": "get_securities_list",
  "description": "Retrieve a list of securities (stocks, crypto, or ETFs) based on filters and sorting preferences. Use default if the user does not specify filters or sorting preference in the query.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "asset_type": {
        "type": "string",
        "enum": ["stock", "crypto", "etf"],
        "description": "The type of asset to retrieve. Defaults to 'stock' if not specified."
      },
      "sector": {
        "type": "string",
        "enum": [
          "technology",
          "finance",
          "healthcare",
          "energy",
          "consumer",
          "utilities",
          "real_estate",
          "industrials",
          "materials",
          "communication"
        ],
        "description": "The sector of interest for the asset. Defaults to 'technology' if not specified."
      },
      "sort_by": {
        "type": "string",
        "enum": ["price", "volume"],
        "description": "How to sort the results. 'price' for ascending price, 'volume' for descending trading volume. Defaults to 'price'."
      }
    },
    "required": [],
    "additionalProperties": false
  }
}

------------





























------------

OPTIONAL:
you can use this for the top market movers:

https://polygon.io/docs/rest/stocks/snapshots/top-market-movers


------------

What data do you show?
1. LOGO
2. NAME
3. SYMBOL
4. PRICE
<!-- 5. COUNTRY
6. FOUNDED. -->
7. CAPITALIZATION
8. OPTIONAL: 12 MONTHS RANGE

show as a table or???

------------

EASY

2. Have the data in, fetch the data, and have the script that does it (use what you have now). Or use api to fetch live data, if not already in database...

------------

3. build the function openai should call, with detailed instructions to use defaults if the user does not specify anything.

------------

EASY
4. Have the route to fetch the required data.

------------

EASY

5. Build the component to return the data (with the button "analyze" active if we have data about it)

------------

EASY

6. Default to web search if the route returns an empty list, or if there are illegal parameters.

-------







7. I guess it would be the same as suggest stocks? Decide this point.
Its a list of stocks ... which is different actually...

---





----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Next three things:

<!-- 1. TEST SEARCH WITHOUT SUGGEST STOCKS, BUT ONLY WITH ONLINE SEARCH. -->

4. Test that language is updating correctly on refresh.

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

Tomorrow do the search function, suggest utilities function, in which it returns with a nice list,
and when it was updated. And fallback to search if that does not work, or something goes wrong with it.
Do it modular.

---------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------




















---------------------------
test both things.
but given a list from database is probably the best thing actually.


Tomorrow add search, for which you need context related to sector, industry, market cap, price, performance?

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------



7. faq menu sometimes opening wrong side?

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

AGAIN FUCKING THREAD id !!!

EventStream.ts:159 Uncaught (in promise) OpenAIError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    at AssistantStream._EventStream_handleError (EventStream.ts:159:40)Caused by: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    at JSON.parse (<anonymous>)
    at Stream.iterator (streaming.ts:121:32)
    at async AssistantStream._fromReadableStream (AssistantStream.ts:175:22)

------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

Tomorrow:
And test... use only stocks.

CREATE THE COMPONENT...

4. - ⁠List (It makes you a list with top performing stocks)
- ⁠The list can be queried, for example it can be reordered by volume, or by price
- ⁠List needs to be for ETFs, Stocks, Funds for example
- ⁠We need shariah compliant assets from saudi market

You need an extra function call for this...

- TYPE OF SECURITY... STOCK, ETF, FUND...
- SORTED BY... VOLUME, PRICE, MARKET CAP... ... DEFAULT: VOLUME...
- LATEST PRICE AS WELL (LATEST PRICES ARE UPDATED UP TO YESTERDAY...)
- WE CAN ALSO HAVE SHARIA COMPLIANT... THE LIST IS...

You do this for prototyping only, not hard data fetching... also sharia compliant probably should not be the right way...
If you do the list...






------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

maybe you can get the list, and if the stock has a websocket property has an extra button, that is: a analyze stock button...


I am not a big fun of the approach of having buttons all around the response, rather having gpt handling stuff, and give data to it...


------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------
------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------
------------------------------------------------------------------------------------------------------------------------- --------------------------- --------------------------- ----------

Add the etfs stuff






test lists using only tavily...

else, do the normal search, and if does not succeed fall back to tavily...
should return as a table if succeeds...

