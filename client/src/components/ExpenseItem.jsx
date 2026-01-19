import { useState } from 'react';
import { updateExpense } from '../api/expenses';

function ExpenseItem({ expense, onDeleteExpense, onExpenseUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [date, setDate] = useState(expense.date);

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function handleCancel() {
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setDate(expense.date);

    setError('');
    setIsEditing(false);
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setError('');

      await updateExpense(expense.id, { title, amount, date });

      setIsEditing(false);

      if (onExpenseUpdated) {
        onExpenseUpdated();
      }
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
          <strong>{expense.title}</strong> — {expense.amount} — {expense.date}
        </div>

        <div className="expenseActions">
          <button className="btn" type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <button
            className="btnDanger"
            type="button"
            onClick={() => onDeleteExpense(expense.id)}
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
        <input value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input value={date} onChange={(e) => setDate(e.target.value)} />

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



