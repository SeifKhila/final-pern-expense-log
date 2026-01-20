

function Summary({ range, setRange, currency, setCurrency, total, count }) {
  return (
    <section className="card">
      <h2>Summary</h2>

      <div className="controls">
        <div className="controlGroup">
          <label className="controlLabel" htmlFor="range">
            Range
          </label>

          <select
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="all">All time</option>
            <option value="7days">Last 7 days</option>
            <option value="month">This month</option>
          </select>
        </div>

        <div className="controlGroup">
          <label className="controlLabel" htmlFor="currency">
            Currency
          </label>

          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="£">£ GBP</option>
            <option value="€">€ EUR</option>
          </select>
        </div>
      </div>

      <p className="summaryBig">
        Total: <strong>{currency}{total.toFixed(2)}</strong>
      </p>

      <p className="muted">Expenses counted: {count}</p>
    </section>
  );
}

export default Summary;
