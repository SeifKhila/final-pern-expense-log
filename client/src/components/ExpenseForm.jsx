import { useState } from 'react';
import { createExpense } from '../api/expenses';

function ExpenseForm({ onExpenseCreated }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError('');

      await createExpense({ title, amount, date });

      // clear the form after success
      setTitle('');
      setAmount('');
      setDate('');

      // tell the Dashboard to refresh the list
      if (onExpenseCreated) {
        onExpenseCreated();
      }
    } catch (err) {
      setError(err.message || 'Could not create expense');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h3>Add an Expense</h3>

    <form className="form" onSubmit={handleSubmit}>
  <div className="formRow">
    <label htmlFor="title">Title</label>
    <input
      id="title"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="e.g. Coffee"
    />
  </div>

  <div className="formRow">
    <label htmlFor="amount">Amount</label>
    <input
      id="amount"
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="e.g. 3.50"
    />
  </div>

  <div className="formRow">
    <label htmlFor="date">Date</label>
    <input
      id="date"
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  </div>

 <button className="btn" type="submit" disabled={isLoading}>
  {isLoading ? "Adding..." : "Add Expense"}
</button>

</form>


      {error && <p>{error}</p>}
    </div>
  );
}

export default ExpenseForm;
