
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import FoodDetails from "./pages/FoodDetails";
import About from "./pages/About";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";
import FoodCategories from "./pages/FoodCategories";
import Register from "./pages/Register";
import Login from "./pages/Login";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/menu" element={<Menu />}>
            <Route
              path="categories"
              element={<FoodCategories />}
            />
          </Route>

          <Route
            path="/food/:id"
            element={<FoodDetails />}
          />

          <Route path="/about" element={<About />} />

          <Route
            path="/favourites"
            element={<Favourites />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/my-orders" element={<MyOrders />} />

          <Route path="/admin" element={<Admin />} />

          {/* Customer Authentication */}
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
