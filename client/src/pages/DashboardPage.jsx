import { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../api/expenses';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';


function DashboardPage({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState('all'); // 'all' | '7days' | 'month'
  const [currency, setCurrency] = useState('£'); // '£' or '€'

  async function loadExpenses() {
    try {
      setIsLoading(true);
      setError('');

      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message || 'Could not load expenses');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleDeleteExpense(id) {
    try {
      setError('');
      await deleteExpense(id);
      await loadExpenses();
    } catch (err) {
      setError(err.message || 'Could not delete expense');
    }
  }

  const now = new Date();

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(now.getDate() - 7);

const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

const filteredExpenses = expenses.filter((e) => {
  const expenseDate = new Date(e.date);

  if (range === '7days') return expenseDate >= sevenDaysAgo;
  if (range === 'month') return expenseDate >= startOfMonth;
  return true; // 'all'
});

const total = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);


return (
  <div className="page">
    <div className="pageHeader">
  <h1 className="appTitle">ExpenseLog</h1>

  <div className="headerActions">
    <span className="statusBadge">Logged in</span>
    <button className="btn" onClick={onLogout}>Log out</button>
  </div>
  </div>

    <section className="card">
      <h2>Add an Expense</h2>
      <ExpenseForm onExpenseCreated={loadExpenses} />
    </section>

    <section className="card">
      <div className="cardHeader">
        <h2>Expenses</h2>
      </div>

      {isLoading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && expenses.length === 0 && (
        <p className="muted">No expenses yet.</p>
      )}

      {!isLoading && !error && expenses.length > 0 && (
       <ExpenseList
     expenses={filteredExpenses}
     onDeleteExpense={handleDeleteExpense}
     onExpenseUpdated={loadExpenses}
     />


      )}
    </section>
    
    <section className="card">
  <h2>Summary</h2>

  <div className="controls">
    <div className="controlGroup">
      <label className="controlLabel" htmlFor="range">Range</label>
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
      <label className="controlLabel" htmlFor="currency">Currency</label>
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

  <p className="muted">
    Expenses counted: {filteredExpenses.length}
  </p>
</section>


  </div>
);

}

export default DashboardPage;

