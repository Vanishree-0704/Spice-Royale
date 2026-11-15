
const imageModules = import.meta.glob(
  "./images/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const getFoodImage = (filename) =>
  imageModules[`./images/${filename}`];
const foods = [
  // BIRYANI
  {
    id: 1,
    name: "Chicken Dum Biryani",
    category: "Biryani",
    type: "Non-Veg",
    price: 220,
    rating: 4.8,
     image: getFoodImage("chicken dum biriyani.jpg"),
    description: "Aromatic basmati rice layered with spicy chicken.",
    ingredients: "Basmati rice, chicken, mint, spices",
    popular: true
  },
  {
    id: 2,
    name: "Mutton Biryani",
    category: "Biryani",
    type: "Non-Veg",
    price: 300,
    rating: 4.8,
   image: getFoodImage("mutton biriyani.jpg"),
    description: "Rich dum biryani with tender mutton.",
    ingredients: "Mutton, basmati rice, spices",
    popular: true
  },
  {
    id: 3,
    name: "Egg Biryani",
    category: "Biryani",
    type: "non Veg",
    price: 110,
    rating: 4.5,
    image: getFoodImage("egg biriyani.jpg"),
    description: "Flavourful biryani served with boiled eggs.",
    ingredients: "Rice, eggs, onions, spices",
    popular: false
  },
  {
    id: 4,
    name: "Prawn Biryani",
    category: "Biryani",
    type: "Non-Veg",
    price: 280,
    rating: 4.7,
    image: getFoodImage("prawn biryani.jpg"),
    description: "Coastal-style biryani with spiced prawns.",
    ingredients: "Prawns, rice, herbs, spices",
    popular: false
  },
  {
    id: 5,
    name: "Veg Biryani",
    category: "Biryani",
    type: "Veg",
    price: 140,
    rating: 4.6,
    image: getFoodImage("veg biryani.jpg"),
    description: "Basmati rice cooked with vegetables and spices.",
    ingredients: "Rice, vegetables, mint, spices",
    popular: true
  },
  {
    id: 6,
    name: "Paneer Biryani",
    category: "Biryani",
    type: "Veg",
    price: 170,
    rating: 4.6,
    image:getFoodImage ("paneer-biryani.png"),
    description: "Fragrant biryani with paneer and Indian spices.",
    ingredients: "Paneer, rice, herbs, spices",
    popular: false
  },

  // MEALS
  {
    id: 7,
    name: "South Indian Veg Meals",
    category: "Meals",
    type: "Veg",
    price: 150,
    rating: 4.7,
    image: getFoodImage("south-veg-meals.jpg"),
    description: "Traditional vegetarian meal with rice and sides.",
    ingredients: "Rice, sambar, vegetables, rasam",
    popular: true
  },
  {
    id: 8,
    name: "Mini Veg Meals",
    category: "Meals",
    type: "Veg",
    price: 110,
    rating: 4.4,
    image: getFoodImage("mini-veg-meals.jpg"),
    description: "A smaller, satisfying South Indian meal.",
    ingredients: "Rice, curry, vegetables",
    popular: false
  },
  {
    id: 9,
    name: "North Indian Veg Thali",
    category: "Meals",
    type: "Veg",
    price: 180,
    rating: 4.6,
    image: getFoodImage("north-veg-thali.jpg"),
    description: "A platter of Indian vegetarian favourites.",
    ingredients: "Roti, rice, dal, vegetables",
    popular: false
  },
  {
    id: 10,
    name: "Paneer Special Meals",
    category: "Meals",
    type: "Veg",
    price: 210,
    rating: 4.7,
    image: getFoodImage("panner-meals.jpeg"),
    description: "A filling meal with paneer curry and rice.",
    ingredients: "Paneer, rice, curry, vegetables",
    popular: false
  },
  {
    id: 11,
    name: "South Indian Non-Veg Meals",
    category: "Meals",
    type: "Non-Veg",
    price: 230,
    rating: 4.8,
    image: getFoodImage("south-indian-nonveg-meals.jpeg"),
    description: "Rice served with delicious non-vegetarian sides.",
    ingredients: "Rice, chicken curry, vegetables",
    popular: true
  },
  {
    id: 12,
    name: "Chicken Meals",
    category: "Meals",
    type: "Non-Veg",
    price: 160,
    rating: 4.7,
    image: getFoodImage("chicken-meals.png"),
    description: "A hearty meal served with chicken gravy.",
    ingredients: "Rice, chicken, curry, spices",
    popular: false
  },

  // VEG FRIED RICE
  {
    id: 13,
    name: "Veg Fried Rice",
    category: "Fried Rice",
    type: "Veg",
    price: 120,
    rating: 4.5,
    image: getFoodImage("veg-fried-rice.jpg"),
    description: "Classic wok-tossed rice with fresh vegetables.",
    ingredients: "Rice, carrots, beans, spring onions",
    popular: true
  },
  {
    id: 14,
    name: "Paneer Fried Rice",
    category: "Fried Rice",
    type: "Veg",
    price: 150,
    rating: 4.6,
    image: getFoodImage("paneer-fried-rice.jpg"),
    description: "Fried rice tossed with paneer cubes.",
    ingredients: "Rice, paneer, vegetables, sauces",
    popular: false
  },
  {
    id: 15,
    name: "Mushroom Fried Rice",
    category: "Fried Rice",
    type: "Veg",
    price: 130,
    rating: 4.5,
    image: getFoodImage("Mushroom-fried-rice.jpg"),
    description: "Mushrooms and vegetables tossed with rice.",
    ingredients: "Rice, mushrooms, garlic, vegetables",
    popular: false
  },
  {
    id: 16,
    name: "Schezwan Veg Fried Rice",
    category: "Fried Rice",
    type: "Veg",
    price: 150,
    rating: 4.6,
    image: getFoodImage("Schezwan-Fried-Rice.jpg"),
    description: "Spicy fried rice with Schezwan seasoning.",
    ingredients: "Rice, vegetables, chilli sauce",
    popular: false
  },
  {
    id: 17,
    name: "Gobi Fried Rice",
    category: "Fried Rice",
    type: "Veg",
    price: 130,
    rating: 4.4,
    image: getFoodImage("gobi-fried-rice.jpg"),
    description: "Vegetable fried rice with cauliflower.",
    ingredients: "Rice, cauliflower, peppers, spices",
    popular: false
  },

  // NON-VEG FRIED RICE
  {
    id: 18,
    name: "Chicken Fried Rice",
    category: "Fried Rice",
    type: "Non-Veg",
    price: 150,
    rating: 4.7,
    image: getFoodImage("chicken-fried-rice.jpg"),
    description: "Wok-tossed rice with chicken and vegetables.",
    ingredients: "Rice, chicken, eggs, vegetables",
    popular: true
  },
  {
    id: 19,
    name: "Egg Fried Rice",
    category: "Fried Rice",
    type: "Non-Veg",
    price: 110,
    rating: 4.5,
    image: getFoodImage("egg-fried-rice.jpg"),
    description: "Fried rice tossed with egg and spring onions.",
    ingredients: "Rice, eggs, spring onions, sauces",
    popular: false
  },
  {
    id: 20,
    name: "Schezwan Chicken Fried Rice",
    category: "Fried Rice",
    type: "Non-Veg",
    price: 160,
    rating: 4.7,
    image: getFoodImage("schezwan-chicken-fried-rice.jpg"),
    description: "Spicy chicken fried rice with bold flavours.",
    ingredients: "Rice, chicken, chilli sauce, vegetables",
    popular: false
  },
  {
    id: 21,
    name: "Prawn Fried Rice",
    category: "Fried Rice",
    type: "Non-Veg",
    price: 180,
    rating: 4.7,
    image: getFoodImage("prawn-fried-rice.jpg"),
    description: "Fried rice tossed with seasoned prawns.",
    ingredients: "Rice, prawns, garlic, vegetables",
    popular: false
  },
  {
    id: 22,
    name: "Mixed Non-Veg Fried Rice",
    category: "Fried Rice",
    type: "Non-Veg",
    price: 200,
    rating: 4.8,
    image: getFoodImage("mixed-nonveg-fried-rice.png"),
    description: "Fried rice with mixed non-vegetarian flavours.",
    ingredients: "Rice, chicken, egg, spices",
    popular: false
  },

  // GRAVIES
  {
    id: 23,
    name: "Paneer Butter Masala",
    category: "Gravies",
    type: "Veg",
    price: 190,
    rating: 4.8,
    image: getFoodImage("paneer-butter-masala.jpg"),
    description: "Paneer cubes in a creamy tomato gravy.",
    ingredients: "Paneer, tomato, butter, cream",
    popular: true
  },
  {
    id: 24,
    name: "Kadai Paneer",
    category: "Gravies",
    type: "Veg",
    price: 200,
    rating: 4.6,
    image: getFoodImage("kadai-paneer.jpg"),
    description: "Paneer cooked with peppers and kadai spices.",
    ingredients: "Paneer, capsicum, tomato, spices",
    popular: false
  },
  {
    id: 25,
    name: "Mushroom Masala",
    category: "Gravies",
    type: "Veg",
    price: 180,
    rating: 4.5,
    image: getFoodImage("mushroom-masala.jpg"),
    description: "Mushrooms simmered in a flavourful gravy.",
    ingredients: "Mushrooms, onion, tomato, spices",
    popular: false
  },
  {
    id: 26,
    name: "Dal Tadka",
    category: "Gravies",
    type: "Veg",
    price: 150,
    rating: 4.5,
    image: getFoodImage("dal-tadka.jpg"),
    description: "Lentils finished with aromatic tempering.",
    ingredients: "Dal, garlic, cumin, ghee",
    popular: false
  },
  {
    id: 27,
    name: "Chicken Chettinad",
    category: "Gravies",
    type: "Non-Veg",
    price: 220,
    rating: 4.8,
    image: getFoodImage("chicken-chettinad.jpg"),
    description: "Peppery chicken curry inspired by Chettinad cuisine.",
    ingredients: "Chicken, pepper, curry leaves, spices",
    popular: true
  },
  {
    id: 28,
    name: "Butter Chicken",
    category: "Gravies",
    type: "Non-Veg",
    price: 230,
    rating: 4.8,
    image: getFoodImage("butter-chicken.jpg"),
    description: "Tender chicken in a creamy tomato gravy.",
    ingredients: "Chicken, tomato, butter, cream",
    popular: true
  },
  {
    id: 29,
    name: "Egg Masala",
    category: "Gravies",
    type: "Non-Veg",
    price: 150,
    rating: 4.5,
    image: getFoodImage("egg-masala.jpg"),
    description: "Boiled eggs cooked in a spiced gravy.",
    ingredients: "Eggs, onion, tomato, spices",
    popular: false
  },

  // BREADS
  {
    id: 30,
    name: "Butter Naan",
    category: "Breads",
    type: "Veg",
    price: 45,
    rating: 4.5,
    image: getFoodImage("butter-naan.jpg"),
    description: "Soft Indian bread finished with melted butter.",
    ingredients: "Flour, yoghurt, butter",
    popular: true
  },
  {
    id: 31,
    name: "Garlic Naan",
    category: "Breads",
    type: "Veg",
    price: 60,
    rating: 4.6,
    image: getFoodImage("garlic-naan.jpg"),
    description: "Naan topped with garlic and herbs.",
    ingredients: "Flour, garlic, butter, herbs",
    popular: false
  },
  {
    id: 32,
    name: "Tandoori Roti",
    category: "Breads",
    type: "Veg",
    price: 35,
    rating: 4.3,
    image: getFoodImage("tandoori-roti.jpg"),
    description: "Traditional whole-wheat Indian flatbread.",
    ingredients: "Whole-wheat flour, water",
    popular: false
  },

  // ICE CREAM
  {
    id: 33,
    name: "Vanilla Ice Cream",
    category: "Ice Cream",
    type: "Veg",
    price: 80,
    rating: 4.5,
    image: getFoodImage("vanilla-ice-cream.jpg"),
    description: "Classic creamy vanilla ice cream.",
    ingredients: "Milk, cream, vanilla",
    popular: true
  },
  {
    id: 34,
    name: "Chocolate Ice Cream",
    category: "Ice Cream",
    type: "Veg",
    price: 80,
    rating: 4.7,
    image: getFoodImage("chocolate-ice-cream.jpg"),
    description: "Rich chocolate ice cream for dessert lovers.",
    ingredients: "Milk, cream, cocoa",
    popular: false
  },
  {
    id: 35,
    name: "Strawberry Ice Cream",
    category: "Ice Cream",
    type: "Veg",
    price: 80,
    rating: 4.5,
    image: getFoodImage("strawberry-ice-cream.jpg"),
    description: "Creamy strawberry-flavoured ice cream.",
    ingredients: "Milk, cream, strawberry",
    popular: false
  },

  // JUICES
  {
    id: 36,
    name: "Fresh Lime Soda",
    category: "Juices",
    type: "Veg",
    price: 60,
    rating: 4.4,
    image: getFoodImage("fresh-lime-soda.jpg"),
    description: "Refreshing lime soda served chilled.",
    ingredients: "Lime, soda, sugar or salt",
    popular: true
  },
  {
    id: 37,
    name: "Fresh Orange Juice",
    category: "Juices",
    type: "Veg",
    price: 70,
    rating: 4.6,
    image: getFoodImage("fresh-orange-juice.jpg"),
    description: "Fresh orange juice served chilled.",
    ingredients: "Fresh oranges",
    popular: false
  },
  {
    id: 38,
    name: "Watermelon Juice",
    category: "Juices",
    type: "Veg",
    price: 60,
    rating: 4.5,
    image: getFoodImage("watermelon-juice.jpg"),
    description: "A cool and refreshing watermelon drink.",
    ingredients: "Watermelon, ice",
    popular: false
  },
  {
    id: 39,
    name: "Mango Juice",
    category: "Juices",
    type: "Veg",
    price: 70,
    rating: 4.7,
    image: getFoodImage("mango-juice.jpg"),
    description: "Sweet mango drink with a tropical flavour.",
    ingredients: "Mango, water, ice",
    popular: false
  },

  
  // STARTERS
  {
    id: 41,
    name: "Paneer Tikka",
    category: "Starters",
    type: "Veg",
    price: 160,
    rating: 4.7,
    image: getFoodImage("paneer-tikka.jpg"),
    description: "Grilled paneer cubes marinated with Indian spices.",
    ingredients: "Paneer, yoghurt, spices",
    popular: true
  },
  {
    id: 42,
    name: "Veg Spring Rolls",
    category: "Starters",
    type: "Veg",
    price: 130,
    rating: 4.5,
    image: getFoodImage("veg-spring-rolls.jpg"),
    description: "Crispy rolls filled with seasoned vegetables.",
    ingredients: "Cabbage, carrots, wrappers",
    popular: false
  },
  {
    id: 43,
    name: "Gobi 65",
    category: "Starters",
    type: "Veg",
    price: 150,
    rating: 4.6,
    image: getFoodImage("gobi-65.jpg"),
    description: "Crispy cauliflower tossed with Indian spices.",
    ingredients: "Cauliflower, flour, spices",
    popular: true
  },
  {
    id: 44,
    name: "Chicken 65",
    category: "Starters",
    type: "Non-Veg",
    price: 170,
    rating: 4.8,
    image: getFoodImage("chicken-65.jpg"),
    description: "Spicy, crispy South Indian chicken starter.",
    ingredients: "Chicken, curry leaves, spices",
    popular: true
  },
  {
    id: 45,
    name: "Chicken Lollipop",
    category: "Starters",
    type: "Non-Veg",
    price: 180,
    rating: 4.7,
    image: getFoodImage("chicken-lollipop.jpg"),
    description: "Fried chicken lollipops with a spicy coating.",
    ingredients: "Chicken wings, spices, sauce",
    popular: false
  },
  {
    id: 46,
    name: "Fish Fingers",
    category: "Starters",
    type: "Non-Veg",
    price: 180,
    rating: 4.6,
    image: getFoodImage("fish-finger.jpg"),
    description: "Crispy fish strips served with dipping sauce.",
    ingredients: "Fish, breadcrumbs, spices",
    popular: false
  },

  // SOUTH INDIAN
  {
    id: 47,
    name: "Plain Dosa",
    category: "South Indian",
    type: "Veg",
    price: 70,
    rating: 4.5,
    image: getFoodImage("plain-dosa.jpg"),
    description: "Crispy dosa served with sambar and chutney.",
    ingredients: "Rice, urad dal",
    popular: true
  },
  {
    id: 48,
    name: "Masala Dosa",
    category: "South Indian",
    type: "Veg",
    price: 100,
    rating: 4.8,
    image: getFoodImage("masala-dosa.jpg"),
    description: "Crispy dosa filled with seasoned potato masala.",
    ingredients: "Dosa batter, potato, spices",
    popular: true
  },
  {
    id: 49,
    name: "Idli Sambar",
    category: "South Indian",
    type: "Veg",
    price: 60,
    rating: 4.5,
    image: getFoodImage("idli-sambar.jpg"),
    description: "Soft steamed idlis served with sambar.",
    ingredients: "Rice, urad dal, sambar",
    popular: false
  },
  {
    id: 50,
    name: "Medu Vada",
    category: "South Indian",
    type: "Veg",
    price: 70,
    rating: 4.5,
    image: getFoodImage("medu-vada.jpg"),
    description: "Crispy lentil doughnuts served with chutney.",
    ingredients: "Urad dal, pepper, curry leaves",
    popular: false
  },
  {
    id: 51,
    name: "Pongal",
    category: "South Indian",
    type: "Veg",
    price: 80,
    rating: 4.5,
    image: getFoodImage("ven-pongal.jpg"),
    description: "Traditional rice and lentil pongal with ghee.",
    ingredients: "Rice, moong dal, pepper, ghee",
    popular: false
  },
  {
    id: 52,
    name: "Onion Uthappam",
    category: "South Indian",
    type: "Veg",
    price: 90,
    rating: 4.6,
    image: getFoodImage("onion-uthappam.jpg"),
    description: "Soft uthappam topped with onions and green chillies.",
    ingredients: "Dosa batter, onion, green chillies",
    popular: false
  },


  // DESSERTS
  {
    id: 40,
    name: "Gulab Jamun",
    category: "Desserts",
    type: "Veg",
    price: 80,
    rating: 4.8,
    image: getFoodImage("gulab-jamun.jpg"),
    description: "Classic Indian sweet soaked in sugar syrup.",
    ingredients: "Milk solids, sugar, cardamom",
    popular: true
  }
];

export default foods;
