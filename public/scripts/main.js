
import {
  createRestaurant,
  findRestaurant,
  deleteRestaurant,
  saveRestaurants,
  loadRestaurants
} from "./restaurantManager.js";
import {
  createDish,
  addDishToRestaurant,
  deleteDishFromRestaurant,
  dishExists
} from "./dishManager.js";
import {
  renderRestaurants,
  renderDishes
} from "./domUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  let restaurants = loadRestaurants();
  let currentRestaurantId = null;

  // --- REFERENCIAS A ELEMENTOS ---
  const restaurantForm = document.getElementById("new-restaurant-form");
  const dishForm = document.querySelector("#restaurant_view .new-dish form");
  const closeBtn = document.querySelector(".close-restaurant");
  const deleteRestaurantBtn = document.querySelector(".delete-restaurant");

  // --- EVENTOS PRINCIPALES ---
  restaurantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("name-restaurant-input");
    const name = input.value.trim();
    if (!name) return;
    if (restaurants.some(r => r.name.trim().toLowerCase() === name.toLowerCase())) {
      alert("¡Ese restaurante ya está en la lista!");
      return;
    }
    const restaurant = createRestaurant(name);
    restaurants.push(restaurant);
    saveRestaurants(restaurants);
    input.value = "";
    renderRestaurants(restaurants);
  });

  dishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = document.querySelector(".name-dish-input");
    const starsInput = document.querySelector(".stars-dish-input");
    const name = nameInput.value.trim();
    const stars = parseFloat(starsInput.value.trim());
    if (!name || currentRestaurantId === null) return;
    if (isNaN(stars) || stars < 1 || stars > 10) {
      alert("La calificación debe ser un número entre 1 y 10 (puede tener decimales).");
      return;
    }
    const restaurant = findRestaurant(restaurants, currentRestaurantId);
    if (!restaurant) return;
    if (dishExists(restaurant, name)) {
      alert("¡Ese plato ya está en la lista!");
      return;
    }
    const dish = createDish(name, stars);
    addDishToRestaurant(restaurant, dish);
    // updateRestaurantStars(restaurant); // Si tienes esta función, impórtala y úsala aquí
    renderDishes(restaurant);
    saveRestaurants(restaurants);
    nameInput.value = "";
    starsInput.value = "";
  });

  closeBtn.addEventListener("click", () => {
    document.getElementById("restaurant_view").style.display = "none";
    currentRestaurantId = null;
  });

  deleteRestaurantBtn.addEventListener("click", () => {
    if (currentRestaurantId === null) return;
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este restaurante?");
    if (!confirmDelete) return;
    restaurants = deleteRestaurant(restaurants, currentRestaurantId);
    saveRestaurants(restaurants);
    renderRestaurants(restaurants);
    document.getElementById("restaurant_view").style.display = "none";
    currentRestaurantId = null;
  });

  // Puedes agregar aquí más lógica para inicializar la vista, cargar datos, etc.
});

function openRestaurantView(id) {
  currentRestaurantId = id;
  const view = document.getElementById("restaurant_view");
  const restaurant = restaurants.find(r => r.id === id);
  if (!restaurant) return;
  view.querySelector("h1").innerText = restaurant.name;
  view.querySelector(".stars").innerText = `${restaurant.stars}⭐`;
  renderDishes(id);
  view.style.display = "flex";
}

function deleteDish(dishId) {
  if (currentRestaurantId === null) return;
  const restaurant = restaurants.find(r => r.id === currentRestaurantId);
  if (!restaurant) return;
  restaurant.dishes = restaurant.dishes.filter(d => d.id !== dishId);
  updateRestaurantStars(restaurant);
  saveRestaurants();
  renderDishes(currentRestaurantId);
}

function updateRestaurantStars(restaurant) {
  const total = restaurant.dishes.reduce((sum, d) => sum + d.stars, 0);
  restaurant.stars = restaurant.dishes.length
    ? parseFloat((total / restaurant.dishes.length).toFixed(1))
    : 0;
  renderRestaurants();
  if (currentRestaurantId === restaurant.id) {
    document.querySelector("#restaurant_view .stars").innerText = `${restaurant.stars}⭐`;
  }
}

function saveRestaurants() {
  localStorage.setItem("restaurants", JSON.stringify(restaurants));
}

function loadRestaurants() {
  const data = localStorage.getItem("restaurants");
  if (data) {
    try {
      restaurants = JSON.parse(data);
    } catch {
      restaurants = [];
    }
  }
  renderRestaurants();
}

// --- INICIALIZAR DATOS ---
loadRestaurants();

