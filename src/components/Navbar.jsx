
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  UtensilsCrossed,
  Heart,
  UserRound,
  LogOut
} from "lucide-react";

function Navbar() {
  const cart = useSelector((state) => state.food.cart);

  const location = useLocation();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [showAccount, setShowAccount] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Refresh customer details whenever the page changes
  useEffect(() => {
    const savedCustomer = localStorage.getItem(
      "spiceRoyaleCustomer"
    );

    setCustomer(
      savedCustomer ? JSON.parse(savedCustomer) : null
    );

    setShowAccount(false);
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("spiceRoyaleToken");
    localStorage.removeItem("spiceRoyaleCustomer");

    setCustomer(null);
    setShowAccount(false);

    alert("You have been logged out successfully.");

    navigate("/login");
  }

  return (
    <header className="navbar royal-navbar">
      <Link to="/" className="brand royal-brand">
        <span className="royal-logo">
          <UtensilsCrossed size={25} />
        </span>

        <span>
          SPICE <strong>ROYALE</strong>
          <small>AN EXPERIENCE OF ROYAL INDIAN CUISINE</small>
        </span>
      </Link>

      <nav className="nav-links royal-nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Our Menu</NavLink>
        <NavLink to="/about">Our Story</NavLink>

        <NavLink to="/favourites" className="royal-fav-link">
          <Heart size={16} />
          Favourites
        </NavLink>

        <NavLink to="/my-orders">My Orders</NavLink>

        <Link to="/cart" className="cart-link royal-cart-link">
          <ShoppingCart size={18} />
          Cart
          <span className="royal-cart-count">
            {cartCount}
          </span>
        </Link>

        {/* Customer Account */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowAccount(!showAccount)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              background: "transparent",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            <UserRound size={20} />
            {customer ? customer.fullName : "Account"}
          </button>

          {showAccount && (
            <div
              style={{
                position: "absolute",
                top: "42px",
                right: "0",
                width: "250px",
                padding: "18px",
                background: "#ffffff",
                color: "#333333",
                borderRadius: "10px",
                boxShadow: "0 5px 25px rgba(0,0,0,0.18)",
                zIndex: 1000
              }}
            >
              {customer ? (
                <>
                  <h3
                    style={{
                      margin: "0 0 12px",
                      color: "#6b1425"
                    }}
                  >
                    My Account
                  </h3>

                  <p style={{ margin: "7px 0" }}>
                    <strong>Name:</strong> {customer.fullName}
                  </p>

                  <p
                    style={{
                      margin: "7px 0",
                      overflowWrap: "anywhere"
                    }}
                  >
                    <strong>Email:</strong> {customer.email}
                  </p>

                  <p style={{ margin: "7px 0" }}>
                    <strong>Customer ID:</strong> {customer.customerId}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      marginTop: "15px",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "#6b1425",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ color: "#6b1425", marginTop: 0 }}>
                    Welcome!
                  </h3>

                  <p>Login to view your account details.</p>

                  <Link
                    to="/login"
                    onClick={() => setShowAccount(false)}
                    style={{
                      display: "block",
                      padding: "10px",
                      textAlign: "center",
                      background: "#6b1425",
                      color: "#ffffff",
                      borderRadius: "6px",
                      textDecoration: "none"
                    }}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setShowAccount(false)}
                    style={{
                      display: "block",
                      marginTop: "10px",
                      textAlign: "center",
                      color: "#8b641e"
                    }}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
