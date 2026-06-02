import { auth } from "../firebase";

export default function Header({ onProfile }) {
  const user = auth.currentUser;

  return (
    <header className="header">
      <h3>💬 WorldChat</h3>

      <div className="header-right">
        <span>{user?.displayName || user?.email}</span>
        <button onClick={onProfile}>Profile</button>
      </div>
    </header>
  );
}
