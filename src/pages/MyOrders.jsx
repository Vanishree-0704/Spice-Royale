
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Clock, XCircle, ShoppingBag } from "lucide-react";
import { addToCart } from "../features/food/foodSlice";
import API_BASE_URL from "../api";
import "./MyOrders.css";

const API_URL = `${API_BASE_URL}/api/orders`;

const trackingSteps = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered"
];

function MyOrders() {
  const cart = useSelector((state) => state.food.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("spiceRoyaleToken");

        if (!token) {
          setOrders([]);
          setError("Please login to view your orders.");
          return;
        }

        const response = await fetch(
          `${API_URL}/my-orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("spiceRoyaleToken");
          localStorage.removeItem("spiceRoyaleCustomer");
          throw new Error("Your session expired. Please login again.");
        }

        if (!response.ok) {
          throw new Error("Unable to fetch your orders.");
        }

        const data = await response.json();

        const formattedOrders = data.map((order) => ({
          orderNumber: order.orderNumber,
          customer: {
            name: order.customerName,
            phone: order.customerPhone,
            address: order.customerAddress
          },
          items:
            typeof order.items === "string"
              ? JSON.parse(order.items || "[]")
              : order.items || [],
          total: order.total,
          paymentMethod: order.paymentMethod,
          date: order.date,
          status: order.status || "Pending"
        }));

        setOrders(formattedOrders);
        setError("");

      } catch (err) {
        console.error("My Orders fetch error:", err);
        setError(err.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const sortedOrders = [...orders].reverse();

  async function handleCancel(orderNumber) {
    const selectedOrder = orders.find(
      (order) => order.orderNumber === orderNumber
    );

    if (!selectedOrder || selectedOrder.status !== "Pending") {
      alert("Only Pending orders can be cancelled.");
      return;
    }

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel order ${orderNumber}?`
    );

    if (!confirmCancel) return;

    const token = localStorage.getItem("spiceRoyaleToken");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    setCancellingOrder(orderNumber);

    try {
      const response = await fetch(
        `${API_URL}/${orderNumber}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to cancel order."
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.orderNumber === orderNumber
            ? { ...order, status: data.status }
            : order
        )
      );

      alert("Your order has been cancelled successfully.");

    } catch (err) {
      console.error("Order cancellation error:", err);
      alert(err.message || "Unable to cancel order.");
    } finally {
      setCancellingOrder(null);
    }
  }

  function handleReorder(order) {
    if (order.status === "Cancelled") return;

    if (cart.length > 0) {
      const confirmAdd = window.confirm(
        "Your cart already has items. Do you want to add this previous order to your existing cart?"
      );

      if (!confirmAdd) return;
    }

    order.items.forEach((item) => {
      const quantity = Number(item.quantity) || 1;

      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(item));
      }
    });

    navigate("/cart");
  }

  return (
    <section className="page-container my-orders-page">
      <div className="my-orders-heading">
        <span className="eyebrow">YOUR FOOD JOURNEY</span>

        <h1 className="page-title">My Orders</h1>

        <p className="muted">
          Track your orders and enjoy every royal bite.
        </p>
      </div>

      {loading ? (
        <div className="my-orders-empty">
          <h2>Loading Your Orders...</h2>
        </div>
      ) : error ? (
        <div className="my-orders-empty">
          <h2>{error.includes("login") || error.includes("session") ? "Login Required" : "Unable to Load Orders"}</h2>
          <p>{error}</p>

          {error.toLowerCase().includes("login") ||
          error.toLowerCase().includes("session") ? (
            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          )}
        </div>
      ) : orders.length === 0 ? (
        <div className="my-orders-empty">
          <h2>No Orders Yet</h2>
          <p>Your delicious journey starts with your first order.</p>
        </div>
      ) : (
        <div className="my-orders-list">
          {sortedOrders.map((order) => {
            const currentStatus = order.status || "Pending";
            const currentStep = trackingSteps.indexOf(currentStatus);
            const isCancelled = currentStatus === "Cancelled";
            const canCancel = currentStatus === "Pending";

            return (
              <article
                className="my-order-card"
                key={order.orderNumber}
              >
                <div className="my-order-header">
                  <div>
                    <span className="my-order-label">
                      ORDER NUMBER
                    </span>

                    <h2>{order.orderNumber}</h2>

                    <p className="my-order-date">
                      {order.date}
                    </p>
                  </div>

                  <span
                    className={`my-order-status ${
                      isCancelled
                        ? "status-cancelled"
                        : `status-${currentStatus
                            .toLowerCase()
                            .replaceAll(" ", "-")}`
                    }`}
                  >
                    {currentStatus}
                  </span>
                </div>

                <div className="my-order-divider" />

                {!isCancelled ? (
                  <div className="order-tracking">
                    <h3>Order Tracking</h3>

                    <div className="tracking-progress">
                      {trackingSteps.map((step, index) => (
                        <div
                          className={`tracking-step ${
                            index <= currentStep ? "completed" : ""
                          }`}
                          key={step}
                        >
                          <div className="tracking-circle">
                            {index < currentStep ? "✓" : index + 1}
                          </div>

                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="cancelled-message">
                    This order has been cancelled.
                  </div>
                )}

                <div className="my-order-divider" />

                <div className="my-order-items">
                  <h3>Ordered Items</h3>

                  {(order.items || []).map((item) => (
                    <div
                      className="my-order-item"
                      key={item.id}
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <strong>
                        ₹{Number(item.price) * Number(item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="my-order-divider" />

                <div className="my-order-footer">
                  <div>
                    <span>Payment Method</span>
                    <p>{order.paymentMethod}</p>
                  </div>

                  <div className="my-order-total">
                    <span>Total Amount</span>
                    <h2>₹{order.total}</h2>
                  </div>
                </div>

                <div className="my-order-actions">
                  {!isCancelled && (
                    <button
                      type="button"
                      className="my-order-reorder-btn"
                      onClick={() => handleReorder(order)}
                    >
                      <ShoppingBag size={17} />
                      Reorder
                    </button>
                  )}

                  {canCancel && (
                    <button
                      type="button"
                      className="my-order-cancel-btn"
                      disabled={cancellingOrder === order.orderNumber}
                      onClick={() => handleCancel(order.orderNumber)}
                    >
                      <XCircle size={17} />

                      {cancellingOrder === order.orderNumber
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyOrders;
