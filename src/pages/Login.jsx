import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API_BASE_URL from "../api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
       `${API_BASE_URL}/api/customers/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("spiceRoyaleToken", data.token);

      localStorage.setItem(
        "spiceRoyaleCustomer",
        JSON.stringify({
          customerId: data.customerId,
          fullName: data.fullName,
          email: data.email,
        })
      );

      alert(`Welcome back, ${data.fullName}!`);
      navigate("/");
    } catch (error) {
      setMessage(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back</h2>

        <p style={styles.subtitle}>
          Login to your Spice Royale account
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          {/* Password with Show / Hide Eye */}
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.passwordInput}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {message && (
            <p style={styles.error}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    padding: "40px 16px",
    background: "#fffaf3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  heading: {
    color: "#6b1425",
    textAlign: "center",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    fontSize: "15px",
  },

  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "15px",
  },

  passwordInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 45px 13px 13px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    fontSize: "15px",
  },

  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#6b1425",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },

  button: {
    width: "100%",
    padding: "13px",
    background: "#6b1425",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "5px",
  },

  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "12px",
  },

  footer: {
    textAlign: "center",
    marginTop: "22px",
    color: "#555",
  },

  link: {
    color: "#6b1425",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default Login;