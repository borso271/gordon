export function extractImportantFinancials(financialsObject) {
    // Define the sets of important keys for each statement
    const importantIncomeKeys = new Set([
      'Revenues',
      'Gross Profit',
      'Operating Income/Loss',
      'Net Income/Loss',
      'Diluted Earnings Per Share',
      'Diluted Average Shares',
      'Basic Earnings Per Share', // Added as important context
      'Basic Average Shares',     // Added as important context
      'Cost Of Revenue',
      'Operating Expenses', // Often includes SG&A and R&D below
      'Research and Development',
      'Income Tax Expense/Benefit',
    ]);
  
    const importantBalanceSheetKeys = new Set([
      'Assets',
      'Liabilities',
      'Equity',
      'Equity Attributable To Parent', // Often preferred over generic Equity
      'Current Assets',
      'Current Liabilities',
      'Long-term Debt',
      'Inventory', // Important for many industries
      'Accounts Payable', // Important for working capital
      'Fixed Assets', // Important for asset base
      'Intangible Assets', // Important especially post-acquisition
    ]);
  
    const importantCashFlowKeys = new Set([
      'Net Cash Flow From Operating Activities',
      'Net Cash Flow From Investing Activities',
      'Net Cash Flow From Financing Activities',
      'Net Cash Flow', // Overall change can be useful context
    ]);
  
    // Initialize the result object with the standard structure
    const importantFinancials = {
      balance_sheet: {},
      cash_flow_statement: {},
      income_statement: {},
    };
  
    // Helper function to process a single statement
    const processStatement = (statementKey, importantKeysSet, targetObject) => {
      const sourceStatement = financialsObject[statementKey];
      if (sourceStatement && typeof sourceStatement === 'object') {
        for (const key in sourceStatement) {
          // Check if the key exists in the source and is in our important set
          if (Object.hasOwnProperty.call(sourceStatement, key) && importantKeysSet.has(key)) {
            targetObject[key] = sourceStatement[key]; // Copy the key-value pair
          }
        }
      }
    };
  
    // Process each statement type
    processStatement('balance_sheet', importantBalanceSheetKeys, importantFinancials.balance_sheet);
    processStatement('cash_flow_statement', importantCashFlowKeys, importantFinancials.cash_flow_statement);
    processStatement('income_statement', importantIncomeKeys, importantFinancials.income_statement);
  
    return importantFinancials;
  }
  

  
//   // Sample Input (simulating your structure, potentially with extra keys)
//   const fullFinancials = {
//     Financials: { // Assuming the input might be nested like this
//       balance_sheet: {
//         Assets: { value: 10000, unit: 'USD' },
//         'Current Assets': { value: 5000, unit: 'USD' },
//         Inventory: { value: 1000, unit: 'USD' },
//         'Other Current Assets': { value: 500, unit: 'USD' }, // Extra key
//         'Noncurrent Assets': { value: 5000, unit: 'USD' },
//         'Fixed Assets': { value: 4000, unit: 'USD' },
//         'Intangible Assets': { value: 800, unit: 'USD' },
//         'Goodwill': { value: 200, unit: 'USD' }, // Extra key (could be part of Intangibles)
//         'Other Non-current Assets': { value: 200, unit: 'USD' },
//         Liabilities: { value: 6000, unit: 'USD' },
//         'Current Liabilities': { value: 2000, unit: 'USD' },
//         'Accounts Payable': { value: 800, unit: 'USD' },
//         Wages: { value: 500, unit: 'USD' }, // Less critical key
//         'Other Current Liabilities': { value: 700, unit: 'USD' },
//         'Noncurrent Liabilities': { value: 4000, unit: 'USD' },
//         'Long-term Debt': { value: 3500, unit: 'USD' },
//         'Deferred Tax Liabilities': { value: 300, unit: 'USD' }, // Extra key
//         'Other Non-current Liabilities': { value: 200, unit: 'USD' },
//         Equity: { value: 4000, unit: 'USD' },
//         'Equity Attributable To Parent': { value: 4000, unit: 'USD' },
//         'Retained Earnings': { value: 2500, unit: 'USD' }, // Extra key
//         'Liabilities And Equity': { value: 10000, unit: 'USD' } // Often just sum of L+E
//       },
//       cash_flow_statement: {
//         'Net Cash Flow From Operating Activities': { value: 1200, unit: 'USD' },
//         'Depreciation & Amortization': { value: 300, unit: 'USD' }, // Detail of Op CF
//         'Net Cash Flow From Investing Activities': { value: -800, unit: 'USD' },
//         'Capital Expenditures': { value: -900, unit: 'USD' }, // Detail of Inv CF
//         'Net Cash Flow From Financing Activities': { value: -300, unit: 'USD' },
//         'Debt Repayment': { value: -200, unit: 'USD' }, // Detail of Fin CF
//         'Net Cash Flow': { value: 100, unit: 'USD' }
//       },
//       income_statement: {
//         Revenues: { value: 10000, unit: 'USD' },
//         'Benefits Costs and Expenses': { value: 500, unit: 'USD' }, // Assuming this contains SBC
//         'Cost Of Revenue': { value: 4000, unit: 'USD' },
//         'Costs And Expenses': { value: 8500, unit: 'USD' }, // Total Costs line
//         'Gross Profit': { value: 6000, unit: 'USD' },
//         'Nonoperating Income/Loss': { value: -100, unit: 'USD' },
//         'Interest Expense': { value: 150, unit: 'USD' }, // Detail of NonOp
//         'Operating Expenses': { value: 4500, unit: 'USD' },
//         'Selling, General, and Administrative Expenses': { value: 3000, unit: 'USD' },
//         'Research and Development': { value: 1000, unit: 'USD' },
//         'Operating Income/Loss': { value: 1500, unit: 'USD' }, // Gross Profit - OpEx
//         'Income Before Tax': { value: 1400, unit: 'USD' }, // Extra key
//         'Income Tax Expense/Benefit': { value: 350, unit: 'USD' },
//         'Income Tax Expense/Benefit, Deferred': { value: 50, unit: 'USD' }, // Less critical detail
//         'Net Income/Loss': { value: 1050, unit: 'USD' },
//         'Net Income/Loss Attributable To Parent': { value: 1050, unit: 'USD' },
//         'Net Income/Loss Available To Common Stockholders, Basic': { value: 1050, unit: 'USD' },
//         'Preferred Dividends': { value: 0, unit: 'USD' }, // Extra key
//         'Basic Earnings Per Share': { value: 1.05, unit: 'USD / share' },
//         'Diluted Earnings Per Share': { value: 1.02, unit: 'USD / share' },
//         'Basic Average Shares': { value: 1000, unit: 'shares' },
//         'Diluted Average Shares': { value: 1030, unit: 'shares' }
//       }
//     }
//   };
  
  
//   // Extract the important keys (assuming the structure might have the outer 'Financials' key)
//   const importantData = extractImportantFinancials(fullFinancials.Financials);
  
//   console.log(JSON.stringify(importantData, null, 2));