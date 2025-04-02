/*



if compare stocks is called,
tables and charts are added to the chat,
and you say the bot; this is the data, explain it to the user, and give an overview of this comparison.

OK

---

Next step:
a clean fetching data for comparison endpoint...
You might actually have a fetch_financials that takes an array with one or more stocks, for scalability.

Then add show_chart function to gpt.
Then try the comparison today.

--- --- --- --- --- ---

If you have a stream of data...
and if gpt is able to call charts
or even show graphs...

You just have to style its own format, and nothing else.
And you use an advanced model for better performance.

--- --- --- --- --- ---



Data returned from your endpoint is:
Select a bunch of them, so basically do another endpoint to get data for comparison,
this is way to much...

When this function is called, you should have a way to:
- Present the chart, present the table,
  show texted response...

Ideally when you call for comparison, gpt will tell you:
- Ok, let me fetch the data and prepare this comparison for you...
- It will then.



Option 1: give the data to gpt and tell him to use table sto display the data when needed...
Avoid using the separate title. ... ... ... ... ...
--- --- --- --- --- --- --- --- ---

For each one of this you should know when it is best, when it is worse...
The comparison.


Show charts and tables, and then gpt will give you its idea as well...
I guess the time the tables are displayed the chat will start chatting...

You might also ask the bot to build tables when needed...

---
You should test if with comparison the bot will be able to call the
graphs and tables itself.

Test it like this...
And test how many function calls it will throw...


Like:
table, [goog, appl], financial comparison...
chart [goog, appl], etc.
but then the response will always be different... but the bot will decide,
and you can use the latest model for the demo, since derayah they are rich...

---
This is probably the way to do it.
- Try adding a show_chart function,
- Go back to normal streaming and normal scroll
- fetch_symbols_financials [stock1, stock2]
- then try what it does...

---
- further suggestions

---
fetch_financial_data []

---
search_web


Financial data fetched: {
  'Company Profile': {
    name: 'Nvidia Corp',
    description: 'Nvidia is a leading developer of graphics processing units. Traditionally, GPUs were used to enhance the experience on computing platforms, most notably in gaming applications on PCs. GPU use cases have since emerged as important semiconductors used in artificial intelligence. Nvidia not only offers AI GPUs, but also a software platform, Cuda, used for AI model development and training. Nvidia is also expanding its data center networking solutions, helping to tie GPUs together to handle complex workloads.'
  },

  'Technical Indicators': {
    'Relative Strength Index': 50.84807978,
    'Simple Moving Average': 134.586,
    'Exponential Moving Average': 134.24082191,
    'MACD Value': 0.97692496,
    'MACD Signal': -0.40792511,
    'MACD Histogram': 1.38485007
  },

  Financials: {
    balance_sheet: {
      Assets: [Object],
      'Current Assets': [Object],
      Inventory: [Object],
      'Other Current Assets': [Object],
      'Noncurrent Assets': [Object],
      'Fixed Assets': [Object],
      'Intangible Assets': [Object],
      'Other Non-current Assets': [Object],
      Liabilities: [Object],
      'Current Liabilities': [Object],
      'Accounts Payable': [Object],
      Wages: [Object],
      'Other Current Liabilities': [Object],
      'Noncurrent Liabilities': [Object],
      'Long-term Debt': [Object],
      'Other Non-current Liabilities': [Object],
      Equity: [Object],
      'Equity Attributable To Parent': [Object],
      'Liabilities And Equity': [Object]
    },

    cash_flow_statement: {
      'Net Cash Flow From Operating Activities': [Object],
      'Net Cash Flow From Investing Activities': [Object],
      'Net Cash Flow From Financing Activities': [Object],
      'Net Cash Flow': [Object]
    },

    comprehensive_income: {
      'Comprehensive Income/Loss': [Object],
      'Comprehensive Income/Loss Attributable To Parent': [Object],
      'Other Comprehensive Income/Loss': [Object]
    },

    income_statement: {
      Revenues: [Object],
      'Benefits Costs and Expenses': [Object],
      'Cost Of Revenue': [Object],
      'Costs And Expenses': [Object],
      'Gross Profit': [Object],
      'Nonoperating Income/Loss': [Object],
      'Operating Expenses': [Object],
      'Selling, General, and Administrative Expenses': [Object],
      'Research and Development': [Object],
      'Operating Income/Loss': [Object],
      'Income Tax Expense/Benefit': [Object],
      'Income Tax Expense/Benefit, Deferred': [Object],
      'Net Income/Loss': [Object],
      'Net Income/Loss Attributable To Parent': [Object],
      'Net Income/Loss Available To Common Stockholders, Basic': [Object],
      'Basic Earnings Per Share': [Object],
      'Diluted Earnings Per Share': [Object],
      'Basic Average Shares': [Object],
      'Diluted Average Shares': [Object]
    }
  }
}