import { useState } from 'react';
import { updateExpense } from '../api/expenses';

function formatDisplayDate(dateValue) {
  if (!dateValue) return '';

  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return String(dateValue);

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function toDateInputValue(dateValue) {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function ExpenseItem({ expense, onDeleteExpense, onExpenseUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [date, setDate] = useState(toDateInputValue(expense.date));

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function handleCancel() {
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setDate(toDateInputValue(expense.date));
    setError('');
    setIsEditing(false);
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setError('');

      await updateExpense(expense.id, { title, amount, date });

      setIsEditing(false);
      if (onExpenseUpdated) onExpenseUpdated();
    } catch (err) {
      setError(err.message || 'Could not update expense');
    } finally {
      setIsSaving(false);
    }
  }

  // VIEW MODE
  if (!isEditing) {
    return (
      <div className="expenseRow">
        <div className="expenseText">
          <strong>{expense.title}</strong> — {Number(expense.amount).toFixed(2)} —{' '}
          {formatDisplayDate(expense.date)}
        </div>

        <div className="expenseActions">
          <button className="btn" type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>

         <button
         className="btnDanger"
         type="button"
        onClick={() => {
         const ok = window.confirm(`Delete "${expense.title}"?`);
         if (ok) onDeleteExpense(expense.id);
        }}
>
            Delete
         </button>

        </div>
      </div>
    );
  }

  // EDIT MODE
       return (
        <div className="expenseRow">
        <div className="editFields">
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
      </div>

      <div className="expenseActions">
        <button className="btn" type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        <button className="btnDanger" type="button" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ExpenseItem;




