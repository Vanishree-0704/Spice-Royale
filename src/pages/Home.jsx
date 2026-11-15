
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Clock3,
  Utensils
} from "lucide-react";

import FoodCard from "../components/FoodCard";
import heroImage from "../data/images/hero.jpg";

function Home() {
  const foods = useSelector((state) => state.food.items);

  const popularFoods = foods
    .filter((food) => food.popular)
    .slice(0, 4);

  const categories = [
    { name: "Biryani", icon: "🍛", description: "Aromatic royal rice delicacies" },
    { name: "Meals", icon: "🍱", description: "Traditional Indian meals" },
    { name: "Starters", icon: "🍢", description: "Delicious appetizers" },
    { name: "Fried Rice", icon: "🍚", description: "Indo-Chinese favourites" },
    { name: "Gravies", icon: "🥘", description: "Rich and flavourful curries" },
    { name: "Desserts", icon: "🍨", description: "Sweet royal endings" }
  ];

  return (
    <div className="royal-home">

      {/* HERO SECTION */}
      <section className="royal-hero">

        <div className="royal-hero-content">

          <span className="royal-eyebrow">
            ✦ WELCOME TO SPICE ROYALE ✦
          </span>

          <h1>
            Experience The
            <span> Royal Taste </span>
            Of India
          </h1>

          <p>
            Discover the richness of Indian cuisine,
            where traditional recipes meet extraordinary
            flavours and every meal feels royal.
          </p>

          <div className="royal-hero-actions">
            <Link to="/menu" className="royal-primary-btn">
              Explore Our Menu
              <ArrowRight size={18} />
            </Link>

            <Link to="/about" className="royal-outline-btn">
              Discover Our Story
            </Link>
          </div>

          <div className="royal-hero-note">
            <Star size={16} fill="currentColor" />
            Crafted with passion. Served with tradition.
          </div>

        </div>

        <div className="royal-hero-visual">
          <div className="royal-image-frame">
            <img
              src={heroImage}
              alt="Spice Royale signature Indian cuisine"
            />
          </div>

          <div className="royal-image-label">
            <span>THE ROYAL COLLECTION</span>
            <strong>Authentic Indian Flavours</strong>
          </div>
        </div>

      </section>

      {/* TRUST STRIP */}
      <section className="royal-trust-strip">

        <div>
          <Utensils size={23} />
          <span>
            <strong>Authentic Flavours</strong>
            <small>Traditional recipes</small>
          </span>
        </div>

        <div>
          <ShieldCheck size={23} />
          <span>
            <strong>Quality Ingredients</strong>
            <small>Carefully selected</small>
          </span>
        </div>

        <div>
          <Clock3 size={23} />
          <span>
            <strong>Fresh Preparation</strong>
            <small>Made with care</small>
          </span>
        </div>

      </section>

      {/* CATEGORIES */}
      <section className="royal-section royal-categories">

        <div className="royal-section-heading">
          <div>
            <span className="royal-section-label">
              EXPLORE OUR COLLECTION
            </span>

            <h2>Discover Our Menu</h2>

            <p>
              A delightful selection of Indian favourites
              for every food lover.
            </p>
          </div>

          <Link to="/menu" className="royal-view-link">
            View All <ArrowRight size={17} />
          </Link>
        </div>

        <div className="royal-category-grid">

          {categories.map((category) => (
            <Link
              to="/menu"
              className="royal-category-card"
              key={category.name}
            >
              <span className="royal-category-icon">
                {category.icon}
              </span>

              <h3>{category.name}</h3>

              <p>{category.description}</p>

              <ArrowRight size={17} />
            </Link>
          ))}

        </div>

      </section>

      {/* POPULAR FOOD */}
      <section className="royal-section royal-popular">

        <div className="royal-section-heading">
          <div>
            <span className="royal-section-label">
              HANDPICKED FOR YOU
            </span>

            <h2>Our Signature Dishes</h2>

            <p>
              Taste the dishes that make every visit special.
            </p>
          </div>

          <Link to="/menu" className="royal-view-link">
            Full Menu <ArrowRight size={17} />
          </Link>
        </div>

        <div className="food-grid">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>

      </section>

      {/* ROYAL EXPERIENCE */}
      <section className="royal-experience">

        <div>
          <span className="royal-section-label">
            MORE THAN JUST A MEAL
          </span>

          <h2>
            Every Flavour Tells
            <span> A Royal Story</span>
          </h2>

          <p>
            From aromatic biryanis to traditional Indian
            delicacies, discover a celebration of taste,
            culture and culinary passion.
          </p>

          <Link to="/about" className="royal-primary-btn">
            Know Our Story
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="royal-experience-stats">
          <div>
            <strong>{foods.length}+</strong>
            <span>Menu Items</span>
          </div>

          <div>
            <strong>100%</strong>
            <span>Passion for Taste</span>
          </div>

          <div>
            <strong>1</strong>
            <span>Royal Experience</span>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Home;
