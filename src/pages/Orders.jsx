
import { useReducer, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  placeOrder
} from "../features/food/foodSlice";
import {
  MapPin,
  Phone,
  User,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Clock
} from "lucide-react";
import API_BASE_URL from "../api";

const API_URL = `${API_BASE_URL}/api/orders`;

const initialForm = {
  name: "",
  phone: "",
  address: ""
};

function formReducer(state, action) {
  return { ...state, [action.name]: action.value };
}

function Orders() {
  const cart = useSelector((state) => state.food.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, updateForm] = useReducer(formReducer, initialForm);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("spiceRoyaleCustomer");

    if (savedCustomer) {
      try {
        const parsedCustomer = JSON.parse(savedCustomer);
        setCustomer(parsedCustomer);

        updateForm({
          name: "name",
          value: parsedCustomer.fullName || ""
        });
      } catch {
        setCustomer(null);
      }
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const delivery = subtotal >= 499 ? 0 : 40;
  const total = subtotal + delivery;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (loading) return;

    if (!cart.length) {
      setMessage("Your cart is empty. Please add a dish first.");
      return;
    }

    const token = localStorage.getItem("spiceRoyaleToken");

    if (!token || !customer) {
      setMessage("Please login to your account before placing an order.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (form.address.trim().length < 10) {
      setMessage("Please enter a complete delivery address.");
      return;
    }

    setLoading(true);

    const estimatedDeliveryAt = new Date(
      Date.now() + 45 * 60 * 1000
    ).toISOString();

    const orderNumber = "SR" + Date.now().toString().slice(-6);

    const orderData = {
      orderNumber,
      date: new Date().toLocaleString("en-IN"),
      customerName: form.name.trim(),
      customerPhone: form.phone.trim(),
      customerAddress: form.address.trim(),
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.status === 401) {
        localStorage.removeItem("spiceRoyaleToken");
        localStorage.removeItem("spiceRoyaleCustomer");
        setCustomer(null);

        throw new Error("Your login session expired. Please login again.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Order could not be saved.");
      }

      const savedOrder = await response.json();

      const savedItems =
        typeof savedOrder.items === "string"
          ? JSON.parse(savedOrder.items || "[]")
          : savedOrder.items || [];

      const finalOrder = {
        orderNumber: savedOrder.orderNumber,
        customer: {
          name: savedOrder.customerName,
          phone: savedOrder.customerPhone,
          address: savedOrder.customerAddress
        },
        items: savedItems,
        subtotal,
        delivery,
        total: savedOrder.total,
        paymentMethod: savedOrder.paymentMethod,
        date: savedOrder.date,
        status: savedOrder.status,
        estimatedDeliveryAt,
        estimatedDeliveryLabel: "Within 45 minutes"
      };

      dispatch(placeOrder(finalOrder));
      dispatch(clearCart());
      setPlacedOrder(finalOrder);

    } catch (error) {
      console.error("Order API error:", error);
      setMessage(error.message || "Unable to save your order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const estimatedTime = placedOrder?.estimatedDeliveryAt
    ? new Date(placedOrder.estimatedDeliveryAt).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }
      )
    : "";

  if (placedOrder) {
    return (
      <section className="royal-checkout-page">
        <div className="royal-success-card">
          <CheckCircle size={65} className="royal-success-icon" />

          <span className="royal-section-label">SPICE ROYALE</span>
          <h1>Thank You for Your Order!</h1>
          <p className="royal-success-description">
            Your order has been saved successfully.
          </p>

          <div className="royal-order-reference">
            <span>ORDER REFERENCE</span>
            <strong>{placedOrder.orderNumber}</strong>
          </div>

          <div className="royal-eta-confirmation">
            <Clock size={20} />
            <div>
              <span>Estimated Delivery</span>
              <strong>{estimatedTime}</strong>
              <small>{placedOrder.estimatedDeliveryLabel}</small>
            </div>
          </div>

          <div className="royal-confirmation-details">
            <p><User size={17} /> {placedOrder.customer.name}</p>
            <p><Phone size={17} /> {placedOrder.customer.phone}</p>
            <p><MapPin size={17} /> {placedOrder.customer.address}</p>
          </div>

          <div className="royal-confirmation-items">
            <h3>Order Details</h3>

            {placedOrder.items.map((item) => (
              <p key={item.id}>
                {item.name} × {item.quantity}
                <strong>₹{item.price * item.quantity}</strong>
              </p>
            ))}

            <div className="royal-confirmation-total">
              <span>Total Amount</span>
              <strong>₹{placedOrder.total}</strong>
            </div>
          </div>

          <p className="royal-payment-note">
            Payment method: {placedOrder.paymentMethod}
          </p>

          <p className="royal-demo-note">
            This is a demonstration order. No real payment will be processed.
            Delivery time is only an estimate.
          </p>

          <a href="/" className="royal-checkout-btn">
            Back to Home <ArrowRight size={18} />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="royal-checkout-page">
      <div className="royal-checkout-container">

        <div className="royal-checkout-heading">
          <span className="royal-section-label">ALMOST THERE</span>
          <h1>Complete Your Order</h1>
          <p>Just a few details before your royal dining experience.</p>
        </div>

        {message && (
          <p className="royal-checkout-error">{message}</p>
        )}

        <div className="royal-checkout-layout">

          <form className="royal-checkout-form" onSubmit={handleSubmit}>
            <div className="royal-form-section">
              <h2><User size={21} /> Customer Details</h2>

              <label>
                Full Name
                <input
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) =>
                    updateForm({ name: "name", value: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </label>

              <label>
                Mobile Number
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    updateForm({
                      name: "phone",
                      value: e.target.value.replace(/\D/g, "")
                    })
                  }
                  placeholder="10-digit mobile number"
                />
              </label>

              <label>
                Delivery Address
                <textarea
                  required
                  minLength={10}
                  value={form.address}
                  onChange={(e) =>
                    updateForm({ name: "address", value: e.target.value })
                  }
                  placeholder="House number, street, area, city and pincode"
                  rows={4}
                />
              </label>
            </div>

            <div className="royal-form-section">
              <h2><ShoppingBag size={21} /> Payment Method</h2>

              <label className="royal-payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>
                  <strong>Cash on Delivery</strong>
                  <small>Demo selection – pay at delivery in a real service</small>
                </span>
              </label>

              <label className="royal-payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="Demo Online Payment"
                  checked={paymentMethod === "Demo Online Payment"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>
                  <strong>Online Payment (Demo)</strong>
                  <small>No actual payment will be collected</small>
                </span>
              </label>
            </div>

            <button
              className="royal-checkout-btn"
              type="submit"
              disabled={!cart.length || loading}
            >
              {loading ? "Placing Order..." : `Place Order · ₹${total}`}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <aside className="royal-checkout-summary">
            <span className="royal-section-label">YOUR SELECTION</span>
            <h2>Order Summary</h2>

            {cart.length ? (
              cart.map((item) => (
                <div className="royal-checkout-item" key={item.id}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))
            ) : (
              <p className="royal-no-items">Your cart is currently empty.</p>
            )}

            <div className="royal-checkout-price-row">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div className="royal-checkout-price-row">
              <span>Delivery Fee</span>
              <strong>{delivery === 0 ? "FREE" : `₹${delivery}`}</strong>
            </div>

            <div className="royal-checkout-grand-total">
              <span>Total Amount</span>
              <strong>₹{total}</strong>
            </div>

            <p className="royal-demo-note">
              Demo checkout only. No real payment is collected.
            </p>
          </aside>

        </div>
      </div>
    </section>
  );
}

export default Orders;
