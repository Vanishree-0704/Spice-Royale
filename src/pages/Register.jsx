import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API_BASE_URL from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/customers/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            passwordHash: form.password,
            phone: form.phone,
            address: form.address
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");

      navigate("/login", {
        state: { email: form.email }
      });

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Join Spice Royale</h1>
        <p style={styles.subtitle}>
          Create your account and enjoy royal dining.
        </p>

        {message && <p style={styles.error}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div style={styles.passwordWrapper}>
            <input
              style={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (minimum 8 characters)"
              value={form.password}
              onChange={handleChange}
              minLength="8"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <textarea
            style={styles.textarea}
            name="address"
            placeholder="Delivery Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 16px",
    background: "#fffaf3"
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "35px",
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.10)"
  },
  heading: {
    textAlign: "center",
    color: "#6b1425",
    marginBottom: "8px"
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "25px"
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "14px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px"
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "14px"
  },
  passwordInput: {
    width: "100%",
    padding: "13px 45px 13px 13px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px"
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
    alignItems: "center"
  },
  textarea: {
    width: "100%",
    minHeight: "85px",
    padding: "13px",
    marginBottom: "14px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
    resize: "vertical"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#6b1425",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  error: {
    color: "#c62828",
    textAlign: "center",
    marginBottom: "15px"
  },
  footer: {
    textAlign: "center",
    marginTop: "22px",
    color: "#555"
  },
  link: {
    color: "#8b641e",
    fontWeight: "bold",
    textDecoration: "none"
  }
};

export default Register;
