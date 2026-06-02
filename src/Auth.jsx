import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import "./styles/auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (loading) return;

    if (!displayName.trim()) {
      setError("Please enter a display name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: displayName.trim(),
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: displayName.trim(),
        email: email,
        photoURL: "",
        createdAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Hero Section */}
        <div className="auth-hero">
          <div className="auth-logo">💬</div>
          <h1>WorldChat</h1>
          <p>Connect with people around the world in real-time</p>
        </div>

        {/* Form */}
        <div className="auth-form">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
            >
              Login
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            {/* Display Name (only for signup) */}
            {!isLogin && (
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  placeholder="What should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Buttons */}
            <div className="auth-buttons">
              <button
                type="submit"
                className="primary"
                disabled={loading}
              >
                {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
