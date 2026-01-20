function Header({ onLogout, isLoggingOut }) {
  return (
    <header className="pageHeader">
      <h1 className="appTitle">ExpenseLog</h1>

      <div className="headerActions">
        <span className="statusBadge">Logged in</span>

    <button className="btn" type="button" onClick={onLogout} disabled={isLoggingOut}>
    {isLoggingOut ? "Logging out..." : "Log out"}
     </button>

      </div>
    </header>
  );
}

export default Header;

