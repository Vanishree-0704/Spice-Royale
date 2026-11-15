
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/food/foodSlice";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { useFavourites } from "../context/ThemeContext";

function FoodCard({ food }) {
  const dispatch = useDispatch();
  const { favourites, toggleFavourite } = useFavourites();
  const isFavourite = favourites.includes(food.id);

  return (
    <article className="food-card">
      <div className="food-image-wrap">
        <Link to={`/food/${food.id}`}>
         
<img
  src={food.image}
  alt={food.name}
  className="food-image"
  loading="lazy"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80";
  }}
/>

        </Link>
        <button
          className={isFavourite ? "heart-button favourited" : "heart-button"}
          onClick={() => toggleFavourite(food.id)}
          aria-label="Toggle favourite"
        >
          <Heart size={20} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="food-info">
        <span className="food-category">{food.category}</span>
        <h3><Link to={`/food/${food.id}`}>{food.name}</Link></h3>
        <p className="food-description">{food.description}</p>

        <div className="food-meta">
          <span className="food-price">₹{food.price}</span>
          <span className="food-rating">
            <Star size={15} fill="currentColor" /> {food.rating}
          </span>
        </div>

        <button
          className="primary-button"
          onClick={() => dispatch(addToCart(food))}
        >
          <ShoppingBag size={17} /> Add to Cart
        </button>
      </div>
    </article>
  );
}

export default FoodCard;
