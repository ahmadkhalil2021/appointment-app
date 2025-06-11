import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BookingPage from "./BookingPage";
import AppointmentsPage from "./AppointmentsPage";
import LoginPage from "./LoginPage";
import PrivateRoute from "./PrivateRoute";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <nav
        style={{ padding: "1rem", textAlign: "center", background: "#4a90e2" }}
      >
        <Link to="/" style={linkStyle}>
          Termin buchen
        </Link>

        <Link to="/appointments" style={linkStyle}>
          Login
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <AppointmentsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const linkStyle = {
  margin: "0 1rem",
  color: "white",
  fontWeight: "700",
  textDecoration: "none",
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
