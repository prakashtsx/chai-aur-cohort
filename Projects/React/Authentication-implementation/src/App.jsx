import { useState } from "react";
import "./App.css";

const API_URL = "https://api.freeapi.app/api/v1/users";

function App() {
  const [screen, setScreen] = useState("register");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleRegisterChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      setMessage(result.message || "Register successful. Now login.");
      setRegisterData({
        username: "",
        email: "",
        password: "",
        role: "",
      });
      setScreen("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      const accessToken = result.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);
      setUser(result.data.user);
      setLoginData({
        username: "",
        password: "",
      });
      setScreen("home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await apiRequest("/logout", {
        method: "POST",
      });

      localStorage.removeItem("accessToken");
      setToken("");
      setUser(null);
      setMessage("Logout successful");
      setScreen("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (screen === "home") {
    return (
      <main className="app home-screen">
        <button className="logout-btn" onClick={handleLogout} disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </button>

        <section className="welcome-card">
          <h1>Welcome {user?.username} !!</h1>
        </section>

        {error && <p className="alert error">{error}</p>}
      </main>
    );
  }

  return (
    <main className="app form-screen">
      <section className="auth-card">
        <h1>{screen === "register" ? "Register Page" : "Login Page"}</h1>
        <div className="line"></div>

        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}

        {screen === "register" ? (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />

            <select
              name="role"
              value={registerData.role}
              onChange={handleRegisterChange}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <button
                className="link-btn"
                type="button"
                onClick={() => {
                  setScreen("login");
                  setMessage("");
                  setError("");
                }}
              >
                Login here
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <button
                className="link-btn"
                type="button"
                onClick={() => {
                  setScreen("register");
                  setMessage("");
                  setError("");
                }}
              >
                Register here
              </button>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}

export default App;
