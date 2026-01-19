import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, onDeleteExpense, onExpenseUpdated }) {
  return (
    <div>
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDeleteExpense={onDeleteExpense}
          onExpenseUpdated={onExpenseUpdated}
        />
      ))}
    </div>
  );
}

export default ExpenseList;


