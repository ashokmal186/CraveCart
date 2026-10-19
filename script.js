
const foods = [
  {
    id: 1,
    name: "Classic Beef Burger",
    category: "Burgers",
    price: 650,
    description: "Juicy burger with fresh lettuce and special sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Crispy Chicken Burger",
    category: "Burgers",
    price: 550,
    description: "Crispy chicken, creamy sauce and soft bun.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Cheese Lover Pizza",
    category: "Pizza",
    price: 1200,
    description: "Delicious cheesy pizza with a golden crust.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 1400,
    description: "Classic pizza topped with cheese and pepperoni.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Chicken Biryani",
    category: "Biryani",
    price: 350,
    description: "Aromatic rice with spicy chicken and herbs.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Special Biryani",
    category: "Biryani",
    price: 450,
    description: "A generous serving of flavourful special biryani.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 400,
    description: "Rich chocolate cake for your sweet cravings.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Ice Cream Sundae",
    category: "Desserts",
    price: 300,
    description: "A cool, creamy dessert with chocolate topping.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80"
  }
];

let cart = [];
let selectedCategory = "All";

const foodGrid = document.getElementById("food-grid");
const searchInput = document.getElementById("search");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const formatPrice = (price) => `Rs. ${price.toLocaleString("en-PK")}`;

function renderFoods() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "All" || food.category === selectedCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm) ||
      food.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  if (filteredFoods.length === 0) {
    foodGrid.innerHTML =
      '<p class="no-results">No food found. Try another search!</p>';
    return;
  }

  foodGrid.innerHTML = filteredFoods.map((food) => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy">
      <div class="food-info">
        <h3>${food.name}</h3>
        <p>${food.description}</p>
        <div class="food-bottom">
          <span class="food-price">${formatPrice(food.price)}</span>
          <button class="add-btn" data-add="${food.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(foodId) {
  const existingItem = cart.find((item) => item.id === foodId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const food = foods.find((item) => item.id === foodId);
    if (!food) return;
    cart.push({ ...food, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(foodId, amount) {
  const item = cart.find((food) => food.id === foodId);
  if (!item) return;

  item.quantity += amount;
  cart = cart.filter((food) => food.quantity > 0);

  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your cart is empty. Find something delicious!</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <div>${formatPrice(item.price)} × ${item.quantity}</div>
      </div>
      <div>
        <button data-minus="${item.id}" aria-label="Decrease quantity">−</button>
        <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join("");
}

document.querySelector(".categories").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach((categoryButton) => {
    categoryButton.classList.toggle("active", categoryButton === button);
  });

  renderFoods();
});

searchInput.addEventListener("input", renderFoods);

foodGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", (event) => {
  const plusButton = event.target.closest("[data-plus]");
  const minusButton = event.target.closest("[data-minus]");

  if (plusButton) changeQuantity(Number(plusButton.dataset.plus), 1);
  if (minusButton) changeQuantity(Number(minusButton.dataset.minus), -1);
});

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add some food first.");
    return;
  }

  alert(
    "Thanks for trying CraveCart! This is a demo website, so real orders and payments are not available yet."
  );
});

renderFoods();
renderCart();
