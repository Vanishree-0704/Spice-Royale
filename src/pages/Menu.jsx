
import { useRef } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FoodCard from "../components/FoodCard";

function Menu() {
  const foods = useSelector((state) => state.food.items);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = useRef(null);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 6;

    
const categories = [
  "All",
  "Biryani",
  "Meals",
  "Fried Rice",
  "Gravies",
  "Breads",
  "Starters",
  "South Indian",
  "Desserts",
  "Ice Cream",
  "Juices"
];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || food.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleFoods = filteredFoods.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  }

  return (
    <section className="page-container">
      <span className="eyebrow">FRESH FROM OUR KITCHEN</span>
      <h1 className="page-title">Our Menu</h1>
      <p className="muted">Discover your next favourite dish.</p>

      <div className="menu-tools">
        <input
          ref={searchInput}
          className="search-input"
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
          placeholder="Search dishes..."
          aria-label="Search dishes"
        />
        <button
          className="outline-button"
          onClick={() => searchInput.current?.focus()}
        >
          Focus Search
        </button>
        <Link className="outline-button" to="/menu/categories">
          Browse Categories
        </Link>
      </div>

      <div className="category-filters">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "filter-chip selected" : "filter-chip"}
            onClick={() => updateParam("category", item === "All" ? "" : item)}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="muted">
        Showing {visibleFoods.length} of {filteredFoods.length} dishes
      </p>

      {visibleFoods.length > 0 ? (
        <div className="food-grid">
          {visibleFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No dishes found</h3>
          <p>Try another search or category.</p>
          <button
            className="primary-button"
            onClick={() => setSearchParams({})}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="pagination">
        <button
          className="outline-button"
          disabled={currentPage <= 1}
          onClick={() => updateParam("page", String(currentPage - 1))}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="outline-button"
          disabled={currentPage >= totalPages}
          onClick={() => updateParam("page", String(currentPage + 1))}
        >
          Next
        </button>
      </div>

      <div className="nested-section">
        <Outlet />
      </div>
    </section>
  );
}

export default Menu;
