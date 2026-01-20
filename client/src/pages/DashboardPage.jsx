import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../api/expenses";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Header from "../components/Header";
import Summary from "../components/Summary";

function DashboardPage({ onLogout, isLoggingOut }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState("all"); // 'all' | '7days' | 'month'
  const [currency, setCurrency] = useState("£"); // '£' or '€'

  async function loadExpenses() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message || "Could not load expenses");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleDeleteExpense(id) {
    try {
      setError("");
      await deleteExpense(id);
      await loadExpenses();
    } catch (err) {
      setError(err.message || "Could not delete expense");
    }
  }

  const now = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const filteredExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);

    if (range === "7days") return expenseDate >= sevenDaysAgo;
    if (range === "month") return expenseDate >= startOfMonth;
    return true; // 'all'
  });

  const total = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  return (
    <div className="page">
      <Header onLogout={onLogout} isLoggingOut={isLoggingOut} />

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

      <Summary
        range={range}
        setRange={setRange}
        currency={currency}
        setCurrency={setCurrency}
        total={total}
        count={filteredExpenses.length}
      />
    </div>
  );
}

export default DashboardPage;


