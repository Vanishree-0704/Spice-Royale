
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import FoodCard from "../components/FoodCard";
import { useFavourites } from "../context/ThemeContext";

function Favourites() {
  const foods = useSelector((state) => state.food.items);
  const { favourites } = useFavourites();
  const favouriteFoods = foods.filter((food) => favourites.includes(food.id));

  return (
    <section className="page-container">
      <span className="eyebrow">YOUR COLLECTION</span>
      <h1 className="page-title">Favourite Dishes</h1>

      {favouriteFoods.length ? (
        <div className="food-grid">
          {favouriteFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No favourites yet</h3>
          <p>Explore the menu and tap the heart on dishes you love.</p>
          <Link className="hero-button" to="/menu">Explore Menu</Link>
        </div>
      )}
    </section>
  );
}

export default Favourites;
