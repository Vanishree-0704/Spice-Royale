
import { useState } from "react";
import API_BASE_URL from "../api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  placeOrder
} from "../features/food/foodSlice";

const API_URL = `${API_BASE_URL}/api/orders`;

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "15px",
  marginTop: "7px",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  marginBottom: "18px",
  fontWeight: "600"
};

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.food.cart);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  function handleCustomerChange(e) {
    const { name, value } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();

    if (loading) return;

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(customer.phone.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");

    const orderNumber = `SR${Date.now()}`;
    const orderDate = new Date().toLocaleString("en-IN");

    const orderData = {
      orderNumber,
      date: orderDate,
      customerName: customer.name.trim(),
      customerPhone: customer.phone.trim(),
      customerAddress: customer.address.trim(),
      items: JSON.stringify(
        cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity)
        }))
      ),
      total,
      paymentMethod,
      status: "Pending"
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to place order.");
      }

      const savedOrder = await response.json();

      const savedItems =
        typeof savedOrder.items === "string"
          ? JSON.parse(savedOrder.items || "[]")
          : savedOrder.items || [];

      const finalOrder = {
        orderNumber: savedOrder.orderNumber,
        date: savedOrder.date,
        customer: {
          name: savedOrder.customerName,
          phone: savedOrder.customerPhone,
          address: savedOrder.customerAddress
        },
        items: savedItems,
        total: savedOrder.total,
        paymentMethod: savedOrder.paymentMethod,
        status: savedOrder.status
      };

      dispatch(placeOrder(finalOrder));
      dispatch(clearCart());

      setConfirmedOrder(finalOrder);

    } catch (err) {
      console.error("Order placement error:", err);
      setError(
        "Unable to place your order. Please check the backend connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Order confirmation
  if (confirmedOrder) {
    return (
      <section className="page-container">
        <div
          style={{
            maxWidth: "600px",
            margin: "50px auto",
            padding: "35px",
            textAlign: "center",
            borderRadius: "16px",
            background: "#fff",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
          }}
        >
          <h1 style={{ color: "#25834b" }}>
            Order Placed Successfully!
          </h1>

          <p>Thank you for ordering from Spice Royale.</p>

          <h3>Order Number</h3>
          <h2 style={{ color: "#8b2635" }}>
            {confirmedOrder.orderNumber}
          </h2>

          <p>
            <strong>Total Amount:</strong> ₹{confirmedOrder.total}
          </p>

          <p>
            <strong>Payment:</strong> {confirmedOrder.paymentMethod}
          </p>

          <p>
            <strong>Status:</strong> {confirmedOrder.status}
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/my-orders")}
          >
            View My Orders
          </button>

          <button
            className="outline-button"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <section className="page-container">
        <h1 className="page-title">Checkout</h1>

        <div style={{ textAlign: "center", padding: "50px 10px" }}>
          <h2>Your cart is empty.</h2>
          <p className="muted">
            Add some delicious dishes before checkout.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/menu")}
          >
            Explore Menu
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <span className="eyebrow">SPICE ROYALE</span>
      <h1 className="page-title">Checkout</h1>

      <p className="muted">
        Complete your details and confirm your order.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          alignItems: "start",
          marginTop: "30px"
        }}
      >
        {/* Customer Details */}
        <form
          className="admin-form"
          onSubmit={handlePlaceOrder}
        >
          <h2>Delivery Details</h2>

          <label style={labelStyle}>
            Full Name
            <input
              style={inputStyle}
              type="text"
              name="name"
              value={customer.name}
              onChange={handleCustomerChange}
              placeholder="Enter your full name"
              minLength={2}
              required
            />
          </label>

          <label style={labelStyle}>
            Mobile Number
            <input
              style={inputStyle}
              type="tel"
              name="phone"
              value={customer.phone}
              onChange={handleCustomerChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              required
            />
          </label>

          <label style={labelStyle}>
            Delivery Address
            <textarea
              style={inputStyle}
              name="address"
              value={customer.address}
              onChange={handleCustomerChange}
              placeholder="Enter your complete delivery address"
              rows={4}
              required
            />
          </label>

          <h2>Payment Method</h2>

          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "15px"
            }}
          >
            <input
              type="radio"
              name="payment"
              value="Cash on Delivery"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>

          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "20px"
            }}
          >
            <input
              type="radio"
              name="payment"
              value="Online Payment (Demo)"
              checked={paymentMethod === "Online Payment (Demo)"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Online Payment (Demo)
          </label>

          {paymentMethod === "Online Payment (Demo)" && (
            <p className="muted">
              Demo payment option only. No real payment will be processed.
            </p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Order Summary */}
        <div
          className="admin-form"
          style={{ position: "sticky", top: "20px" }}
        >
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "15px",
                padding: "12px 0",
                borderBottom: "1px solid #eee"
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <p className="muted">
                  ₹{item.price} × {item.quantity}
                </p>
              </div>

              <strong>
                ₹{Number(item.price) * Number(item.quantity)}
              </strong>
            </div>
          ))}

          <div style={{ marginTop: "20px" }}>
            <p style={{ display: "flex", justifyContent: "space-between" }}>
              Subtotal <strong>₹{subtotal}</strong>
            </p>

            <p style={{ display: "flex", justifyContent: "space-between" }}>
              Delivery Fee <strong>₹{deliveryFee}</strong>
            </p>

            <hr />

            <h2
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#8b2635"
              }}
            >
              Total <span>₹{total}</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
