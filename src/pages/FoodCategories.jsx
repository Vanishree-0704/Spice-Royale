
import { Link } from "react-router-dom";

function FoodCategories() {
  const categories = [
    { name: "Biryani", description: "Chicken, mutton, egg, prawn and veg biryani" },
    { name: "Meals", description: "South Indian meals and thalis" },
    { name: "Fried Rice", description: "Veg and non-veg fried rice varieties" },
    { name: "Gravies", description: "Paneer, mushroom and chicken gravies" },
    { name: "Breads", description: "Butter naan, garlic naan and roti" },
    { name: "Starters", description: "Delicious starters and appetisers" },
    { name: "South Indian", description: "Regional favourites and traditional dishes" },
    { name: "Desserts", description: "Sweet treats after your meal" },
    { name: "Ice Cream", description: "Creamy frozen desserts" },
    { name: "Juices", description: "Fresh juices and refreshing drinks" }
  ];

  return (
    <div className="categories-panel">
      <h2>Explore Our Categories</h2>

      <div className="category-grid">
        {categories.map((item) => (
          <Link
            key={item.name}
            className="category-card"
            to={`/menu?category=${encodeURIComponent(item.name)}`}
          >
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span>Explore Menu →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FoodCategories;
