
import { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import { useDispatch, useSelector } from "react-redux";
import {
  addFood,
  updateFood,
  deleteFood
} from "../features/food/foodSlice";

const FOOD_API_URL = `${API_BASE_URL}/api/foods`;
const ORDERS_API_URL = `${API_BASE_URL}/api/orders`;
const ADMIN_LOGIN_URL = `${API_BASE_URL}/api/admin/login`;

const emptyForm = {
  name: "",
  category: "Biryani",
  type: "Veg",
  price: "",
  rating: "4.5",
  image: "",
  description: "",
  ingredients: "",
  popular: false
};

// Get local date in YYYY-MM-DD format
function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Convert stored order date into YYYY-MM-DD
function getOrderDateKey(dateValue) {
  if (!dateValue) return null;

  const dateString = String(dateValue).trim();

  // Handle Indian date format: DD/MM/YYYY
  const indianDateMatch = dateString.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
  );

  if (indianDateMatch) {
    const day = Number(indianDateMatch[1]);
    const month = Number(indianDateMatch[2]);
    const year = Number(indianDateMatch[3]);

    const parsedDate = new Date(year, month - 1, day);

    if (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day
    ) {
      return getLocalDateKey(parsedDate);
    }

    return null;
  }

  // Handle ISO dates and other standard date formats
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return getLocalDateKey(parsedDate);
}

function Admin() {
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.food.items);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSaving, setIsSaving] = useState(false);

  const [isAdmin, setIsAdmin] = useState(
    Boolean(localStorage.getItem("spiceRoyaleAdminToken"))
  );

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const adminToken = localStorage.getItem("spiceRoyaleAdminToken");

  function showMessage(text, type = "success") {
    setMessage(text);
    setMessageType(type);
  }

  function logoutAdmin() {
    localStorage.removeItem("spiceRoyaleAdminToken");
    setIsAdmin(false);
    setOrders([]);
    setPassword("");
    setForm(emptyForm);
    setEditingId(null);
    showMessage("Admin logged out successfully.");
  }

  function handleUnauthorized(response) {
    if (response.status === 401 || response.status === 403) {
      logoutAdmin();
      showMessage(
        "Admin session expired or access denied. Please login again.",
        "error"
      );
      return true;
    }

    return false;
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setMessage("");

    try {
      const response = await fetch(ADMIN_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed.");
      }

      if (data.role !== "ADMIN" || !data.token) {
        throw new Error("Invalid admin login response.");
      }

      localStorage.setItem("spiceRoyaleAdminToken", data.token);
      setIsAdmin(true);
      setPassword("");
      showMessage("Admin login successful.");

    } catch (error) {
      showMessage(
        error.message || "Unable to login as admin.",
        "error"
      );
    } finally {
      setLoginLoading(false);
    }
  }

  // Fetch all orders using Admin JWT
  useEffect(() => {
    if (!isAdmin || !adminToken) return;

    async function fetchOrders() {
      setOrdersLoading(true);

      try {
        const response = await fetch(ORDERS_API_URL, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        if (!response.ok) {
          if (handleUnauthorized(response)) return;
          throw new Error("Unable to fetch orders.");
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

      } catch (error) {
        console.error("Order fetch error:", error);
        showMessage(
          "Unable to load customer orders. Check backend connection.",
          "error"
        );
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
  }, [isAdmin, adminToken]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => (order.status || "Pending") === "Pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const totalSales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  // Today's and tomorrow's date keys
  const today = new Date();
  const todayKey = getLocalDateKey(today);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowKey = getLocalDateKey(tomorrow);

  // Today's orders
  const todayOrders = orders.filter(
    (order) => getOrderDateKey(order.date) === todayKey
  );

  // Tomorrow's orders
  const tomorrowOrders = orders.filter(
    (order) => getOrderDateKey(order.date) === tomorrowKey
  );

  // Daily sales exclude cancelled orders
  const todaySales = todayOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const tomorrowSales = tomorrowOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const filteredOrders = orders.filter((order) => {
    const search = orderSearch.trim().toLowerCase();
    const orderNumber = String(order.orderNumber || "").toLowerCase();
    const customerName = String(
      order.customer?.name || ""
    ).toLowerCase();

    const matchesSearch =
      orderNumber.includes(search) ||
      customerName.includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      (order.status || "Pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  }


  // Current month and previous month keys
  const currentMonthKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const previousMonthDate = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  const previousMonthKey = `${previousMonthDate.getFullYear()}-${String(
    previousMonthDate.getMonth() + 1
  ).padStart(2, "0")}`;

  // This month's orders
  const thisMonthOrders = orders.filter((order) => {
    const dateKey = getOrderDateKey(order.date);
    return dateKey && dateKey.slice(0, 7) === currentMonthKey;
  });

  // Last month's orders
  const lastMonthOrders = orders.filter((order) => {
    const dateKey = getOrderDateKey(order.date);
    return dateKey && dateKey.slice(0, 7) === previousMonthKey;
  });

  // Monthly sales exclude cancelled orders
  const thisMonthSales = thisMonthOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const lastMonthSales = lastMonthOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);


  // Last 7 days sales analytics
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      key: getLocalDateKey(date),
      label: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      })
    };
  });

  const weeklySalesData = lastSevenDays.map((day) => {
    const dayOrders = orders.filter(
      (order) => getOrderDateKey(order.date) === day.key
    );

    const validOrders = dayOrders.filter(
      (order) => order.status !== "Cancelled"
    );

    const sales = validOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    return {
      ...day,
      orderCount: dayOrders.length,
      sales
    };
  });

  const lastSevenDaysOrders = weeklySalesData.reduce(
    (sum, day) => sum + day.orderCount,
    0
  );

  const lastSevenDaysSales = weeklySalesData.reduce(
    (sum, day) => sum + day.sales,
    0
  );

  const highestSalesDay = weeklySalesData.reduce(
    (highest, day) =>
      day.sales > highest.sales ? day : highest,
    weeklySalesData[0]
  );

  const averageDailySales = lastSevenDaysSales / 7;



  // Add or update food using Admin JWT
  async function handleSubmit(e) {
    e.preventDefault();

    if (isSaving) return;

    if (!adminToken) {
      showMessage("Please login again as Admin.", "error");
      logoutAdmin();
      return;
    }

    const foodData = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      popular: Boolean(form.popular)
    };

    setIsSaving(true);
    setMessage("");

    try {
      let response;

      if (editingId !== null) {
        response = await fetch(`${FOOD_API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(foodData)
        });
      } else {
        response = await fetch(FOOD_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(foodData)
        });
      }

      if (!response.ok) {
        if (handleUnauthorized(response)) return;

        const errorText = await response.text();
        throw new Error(errorText || "Unable to save food.");
      }

      const savedFood = await response.json();

      if (editingId !== null) {
        dispatch(updateFood(savedFood));
        showMessage("Dish updated successfully in MySQL.");
      } else {
        dispatch(addFood(savedFood));
        showMessage("New dish added successfully to MySQL.");
      }

      setForm(emptyForm);
      setEditingId(null);

    } catch (error) {
      console.error("Food save error:", error);
      showMessage(
        "Unable to save dish. Check backend connection and try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function editFood(food) {
    setForm({
      ...food,
      price: String(food.price),
      rating: String(food.rating)
    });

    setEditingId(food.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete food using Admin JWT
  async function handleDeleteFood(food) {
    if (!adminToken) {
      showMessage("Please login again as Admin.", "error");
      logoutAdmin();
      return;
    }

    try {
      const response = await fetch(`${FOOD_API_URL}/${food.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      if (!response.ok) {
        if (handleUnauthorized(response)) return;

        const errorText = await response.text();
        throw new Error(errorText || "Unable to delete food.");
      }

      dispatch(deleteFood(food.id));

      if (editingId === food.id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      showMessage("Dish deleted successfully from MySQL.");

    } catch (error) {
      console.error("Food delete error:", error);
      showMessage(
        "Unable to delete dish. Check backend connection.",
        "error"
      );
    }
  }

  // Update order status using Admin JWT
  async function handleOrderStatusChange(orderNumber, newStatus) {
    try {
      const response = await fetch(
        `${ORDERS_API_URL}/${orderNumber}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      if (!response.ok) {
        if (handleUnauthorized(response)) return;
        throw new Error("Unable to update order status.");
      }

      const updatedOrder = await response.json();

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.orderNumber === orderNumber
            ? {
                ...order,
                status: updatedOrder.status
              }
            : order
        )
      );

      showMessage(
        `Order ${orderNumber} updated to ${newStatus}.`
      );

    } catch (error) {
      console.error("Order status update error:", error);
      showMessage(
        "Unable to update order status in MySQL.",
        "error"
      );
    }
  }

  // Delete customer order using Admin JWT
  async function handleDeleteOrder(orderNumber) {
    try {
      const response = await fetch(
        `${ORDERS_API_URL}/${orderNumber}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      if (!response.ok) {
        if (handleUnauthorized(response)) return;
        throw new Error("Unable to delete order.");
      }

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) => order.orderNumber !== orderNumber
        )
      );

      showMessage(
        `Order ${orderNumber} deleted successfully from MySQL.`
      );

    } catch (error) {
      console.error("Order delete error:", error);
      showMessage(
        "Unable to delete order from MySQL.",
        "error"
      );
    }
  }

  if (!isAdmin) {
    return (
      <section className="page-container">
        <h1 className="page-title">Admin Login</h1>

        <form
          className="admin-form"
          onSubmit={handleAdminLogin}
        >
          <label>
            Admin Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </label>

          <label>
            Admin Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </label>

          {message && (
            <p
              className={
                messageType === "error"
                  ? "error-message"
                  : "success-message"
              }
            >
              {message}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="page-container">
      <span className="eyebrow">RESTAURANT MANAGEMENT</span>

      <h1 className="page-title">Admin Dashboard</h1>

      <div className="admin-actions">
        <p className="muted">Logged in as Administrator</p>

        <button
          type="button"
          className="outline-button"
          onClick={logoutAdmin}
        >
          Logout
        </button>
      </div>

      <p className="muted">
        Add, edit or remove dishes from the menu.
      </p>

      {/* Dashboard Summary */}
      <div className="admin-summary-grid">
        <div className="admin-summary-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
        </div>

        <div className="admin-summary-card">
          <span>Pending Orders</span>
          <h2>{pendingOrders}</h2>
        </div>

        <div className="admin-summary-card">
          <span>Preparing Orders</span>
          <h2>{preparingOrders}</h2>
        </div>

        <div className="admin-summary-card">
          <span>Total Sales</span>
          <h2>₹{totalSales.toFixed(2)}</h2>
        </div>

        <div className="admin-summary-card">
          <span>Today's Orders</span>
          <h2>{todayOrders.length}</h2>
        </div>

        <div className="admin-summary-card">
          <span>Today's Sales</span>
          <h2>₹{todaySales.toFixed(2)}</h2>
        </div>

        <div className="admin-summary-card">
          <span>Tomorrow's Orders</span>
          <h2>{tomorrowOrders.length}</h2>
        </div>

        <div className="admin-summary-card">
          <span>Tomorrow's Sales</span>
          <h2>₹{tomorrowSales.toFixed(2)}</h2>
        </div>


<div className="admin-summary-card">
  <span>This Month Orders</span>
  <h2>{thisMonthOrders.length}</h2>
</div>

<div className="admin-summary-card">
  <span>This Month Sales</span>
  <h2>₹{thisMonthSales.toFixed(2)}</h2>
</div>

<div className="admin-summary-card">
  <span>Last Month Orders</span>
  <h2>{lastMonthOrders.length}</h2>
</div>

<div className="admin-summary-card">
  <span>Last Month Sales</span>
  <h2>₹{lastMonthSales.toFixed(2)}</h2>
</div>


<div className="admin-summary-card">
  <span>Last 7 Days Orders</span>
  <h2>{lastSevenDaysOrders}</h2>
</div>

<div className="admin-summary-card">
  <span>Last 7 Days Sales</span>
  <h2>₹{lastSevenDaysSales.toFixed(2)}</h2>
</div>

<div className="admin-summary-card">
  <span>Highest Sales Day</span>
  <h2>{highestSalesDay.label}</h2>
  <p>₹{highestSalesDay.sales.toFixed(2)}</p>
</div>

<div className="admin-summary-card">
  <span>Average Daily Sales</span>
  <h2>₹{averageDailySales.toFixed(2)}</h2>
</div>


      </div>

      {message && (
        <p
          className={
            messageType === "error"
              ? "error-message"
              : "success-message"
          }
        >
          {message}
        </p>
      )}

      {/* Add / Edit Food Form */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>
          {editingId !== null ? "Edit Dish" : "Add New Dish"}
        </h2>

        <div className="form-grid">
          <label>
            Dish Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              placeholder="Dish name"
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {[
                "Biryani",
                "Starters",
                "North Indian",
                "South Indian",
                "Breads",
                "Desserts",
                "Drinks"
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Food Type
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </label>

          <label>
            Price (₹)
            <input
              name="price"
              type="number"
              min="1"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Rating
            <input
              name="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Image URL
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              required
              placeholder="https://..."
            />
          </label>
        </div>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={2}
          />
        </label>

        <label>
          Ingredients
          <input
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            required
          />
        </label>

        <label className="checkbox-label">
          <input
            name="popular"
            type="checkbox"
            checked={form.popular}
            onChange={handleChange}
          />
          Mark as a popular dish
        </label>

        <div className="admin-actions">
          <button
            className="primary-button"
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : editingId !== null
                ? "Save Changes"
                : "Add Dish"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="outline-button"
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setMessage("");
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Current Menu */}
      <h2 className="list-heading">
        Current Menu ({foods.length})
      </h2>

      <div className="admin-list">
        {foods.map((food) => (
          <article className="admin-food-row" key={food.id}>
            <img src={food.image} alt={food.name} />

            <div>
              <h3>{food.name}</h3>
              <p>
                {food.category} · {food.type} · ₹{food.price}
              </p>
            </div>

            <div className="admin-row-actions">
              <button
                type="button"
                className="outline-button"
                onClick={() => editFood(food)}
              >
                Edit
              </button>

              <button
                type="button"
                className="remove-button"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    `Are you sure you want to delete ${food.name}?`
                  );

                  if (confirmDelete) {
                    handleDeleteFood(food);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Customer Order Management */}
      <h2 className="list-heading">
        Customer Orders ({orders.length})
      </h2>

      <div className="admin-order-filters">
        <input
          type="text"
          placeholder="Search by order ID or customer name..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="admin-orders-list">
        {ordersLoading ? (
          <p className="muted">Loading customer orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="muted">No matching orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <article
              className="admin-order-card"
              key={order.orderNumber}
            >
              <div className="admin-order-header">
                <div>
                  <h3>{order.orderNumber}</h3>
                  <p>{order.date}</p>
                </div>

                <span>{order.status || "Pending"}</span>
              </div>

              <div className="admin-order-customer">
                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer?.name || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.customer?.phone || "N/A"}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.customer?.address || "N/A"}
                </p>
              </div>

              <h4>Ordered Items</h4>

              {(order.items || []).map((item, index) => (
                <p key={item.id ?? index}>
                  {item.name} × {item.quantity} — ₹
                  {Number(item.price) * Number(item.quantity)}
                </p>
              ))}

              <h3>Total: ₹{order.total}</h3>

              <p>Payment: {order.paymentMethod}</p>

              <label>
                Update Order Status

                <select
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    handleOrderStatusChange(
                      order.orderNumber,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">
                    Out for Delivery
                  </option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              <button
                type="button"
                className="remove-button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete order ${order.orderNumber}?`
                    )
                  ) {
                    handleDeleteOrder(order.orderNumber);
                  }
                }}
              >
                Delete Order
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default Admin;
