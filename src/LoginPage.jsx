import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin") {
      onLogin();
      navigate("/appointments");
    } else {
      setError("Falsches Passwort");
    }
  };

  return (
    <div className="login-container">
      <h2>Login erforderlich</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Passwort eingeben"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Einloggen</button>
        {error && <p className="error">{error}</p>}
      </form>

      <style jsx>{`
        .login-container {
          max-width: 30%;
          margin: 5rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          text-align: center;
          font-family: sans-serif;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          margin: 1rem 0;
          border: 1px solid #ccc;
          border-radius: 10px;
        }

        button {
          padding: 0.7rem 1.5rem;
          border: none;
          background: #4a90e2;
          color: white;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
        }

        .error {
          color: red;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
