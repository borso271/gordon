export default function TradingHistoryTable({ transactions }) {
    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Ticker</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.transaction_date.split("T")[0]}</td>
              <td>{tx.ticker}</td>
              <td>{tx.transaction_type.toUpperCase()}</td>
              <td>{tx.quantity}</td>
              <td>{tx.price_per_unit}</td>
              <td>{(tx.quantity * tx.price_per_unit).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  