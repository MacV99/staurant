document.addEventListener("DOMContentLoaded", () => {
  let restaurants = [];
  let currentRestaurantId = null;

  // --- REFERENCIAS A ELEMENTOS ---
  const restaurantForm = document.getElementById("new-restaurant-form");
  const dishForm = document.querySelector("#restaurant_view .new-dish form");
  const closeBtn = document.querySelector(".close-restaurant");
  const deleteRestaurantBtn = document.querySelector(".delete-restaurant");

  // --- EVENTOS PRINCIPALES ---
  restaurantForm.addEventListener("submit", newRestaurant);
  dishForm.addEventListener("submit", newDish);
  closeBtn.addEventListener("click", () => {
    document.getElementById("restaurant_view").style.display = "none";
    currentRestaurantId = null;
  });
  deleteRestaurantBtn.addEventListener("click", () => {
    if (currentRestaurantId === null) return;
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este restaurante?");
    if (!confirmDelete) return;
    restaurants = restaurants.filter(r => r.id !== currentRestaurantId);
    saveRestaurants();
    renderRestaurants();
    document.getElementById("restaurant_view").style.display = "none";
    currentRestaurantId = null;
  });

  // --- FUNCIONES LÓGICAS ---
  function newRestaurant(event) {
    event.preventDefault();
    const input = document.getElementById("name-restaurant-input");
    const name = input.value.trim();
    if (!name) return;

    if (restaurants.some(r => r.name.trim().toLowerCase() === name.toLowerCase())) {
      alert("¡Ese restaurante ya está en la lista!");
      return;
    }

    const restaurant = {
      id: Date.now(),
      name,
      stars: 0,
      city: "",
      dishes: []
    };

    restaurants.push(restaurant);
    saveRestaurants();
    input.value = "";
    renderRestaurants();
  }

  function newDish(event) {
    event.preventDefault();
    const nameInput = document.querySelector(".name-dish-input");
    const starsInput = document.querySelector(".stars-dish-input");
    const name = nameInput.value.trim();
    const stars = parseInt(starsInput.value.trim(), 10);

    if (!name || currentRestaurantId === null) return;
    if (isNaN(stars) || stars < 1 || stars > 10) {
      alert("La calificación debe ser un número entre 1 y 10.");
      return;
    }

    const restaurant = restaurants.find(r => r.id === currentRestaurantId);
    if (!restaurant) return;
    if (restaurant.dishes.some(d => d.name.trim().toLowerCase() === name.toLowerCase())) {
      alert("¡Ese plato ya está en la lista!");
      return;
    }

    const dish = { id: Date.now(), name, stars };
    restaurant.dishes.push(dish);
    updateRestaurantStars(restaurant);
    renderDishes(currentRestaurantId);
    saveRestaurants();
    nameInput.value = "";
    starsInput.value = "";
  }

  function renderDishes(idRestaurant) {
    const list = document.querySelector(".list-dishes");
    list.innerHTML = "";
    const restaurant = restaurants.find(r => r.id === idRestaurant);
    if (!restaurant) return;

    restaurant.dishes.forEach(d => {
      const dishCard = document.createElement("div");
      dishCard.classList.add("dish");
      dishCard.innerHTML = `
        <i class="bi bi-trash-fill delete-dish" data-id="${d.id}"></i>
        <div class="flex-row">
          <h3>${d.name}</h3>
        </div>
        <ul>
          <li>${d.stars}⭐</li>
        </ul>
      `;
      list.appendChild(dishCard);
    });

    // re-registrar eventos de borrado de platos
    document.querySelectorAll(".delete-dish").forEach(icon => {
      icon.addEventListener("click", () => {
        const dishId = parseInt(icon.getAttribute("data-id"), 10);
        if (confirm("¿Eliminar este plato?")) deleteDish(dishId);
      });
    });
  }

  function renderRestaurants() {
    const container = document.getElementById("restaurants-list");
    container.innerHTML = "";
    restaurants.forEach(r => {
      const card = document.createElement("div");
      card.classList.add("restaurant");
      card.innerHTML = `
        <h3>${r.name}</h3>
        <ul><li>${r.stars}⭐</li></ul>
      `;
      card.addEventListener("click", () => openRestaurantView(r.id));
      container.appendChild(card);
    });
  }

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
});
