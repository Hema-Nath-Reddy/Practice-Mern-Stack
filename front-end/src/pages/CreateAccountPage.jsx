import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import useUser from "../useUser";
export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoading, user } = useUser();
  async function createAccount() {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      alert("Successfully created account.");
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div className="login">
      <div className="form">
        <h1>Create account</h1>
        {user ? (
          <p>Already logged in.</p> 
        ) : (
          <>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              name="confirm-password"
              placeholder="Confirm your password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={createAccount} className="log-btn">
              Create Account
            </button>
            <Link to="/login">Already have an account? Login.</Link>
          </>
        )}
      </div>
    </div>
  );
}
