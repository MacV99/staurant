// Gestión de restaurantes
export function createRestaurant(name) {
  return {
    id: Date.now(),
    name,
    stars: 0,
    city: "",
    dishes: []
  };
}

export function findRestaurant(restaurants, id) {
  return restaurants.find(r => r.id === id);
}

export function deleteRestaurant(restaurants, id) {
  return restaurants.filter(r => r.id !== id);
}

export function saveRestaurants(restaurants) {
  localStorage.setItem("restaurants", JSON.stringify(restaurants));
}

export function loadRestaurants() {
  const data = localStorage.getItem("restaurants");
  return data ? JSON.parse(data) : [];
}
