
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/food/foodSlice";

function FoodDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.food.items);
  const food = foods.find((item) => String(item.id) === id);

  if (!food) {
    return (
      <section className="page-container">
        <h1>Dish not found</h1>
        <Link to="/menu" className="text-link">Back to Menu</Link>
      </section>
    );
  }

  return (
    <section className="page-container details-layout">
      <img className="details-image" src={food.image} alt={food.name} />
      <div>
        <span className="eyebrow">{food.category}</span>
        <h1 className="page-title">{food.name}</h1>
        <p>{food.description}</p>
        <p><strong>Type:</strong> {food.type}</p>
        <p><strong>Ingredients:</strong> {food.ingredients}</p>
        <p className="details-price">₹{food.price}</p>
        <button
          className="primary-button details-button"
          onClick={() => dispatch(addToCart(food))}
        >
          Add to Cart
        </button>
        <p><Link to="/menu" className="text-link">← Back to Menu</Link></p>
      </div>
    </section>
  );
}

export default FoodDetails;
