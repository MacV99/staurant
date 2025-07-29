// Gestión de platos
export function createDish(name, stars) {
  return {
    id: Date.now(),
    name,
    stars
  };
}

export function addDishToRestaurant(restaurant, dish) {
  restaurant.dishes.push(dish);
}

export function deleteDishFromRestaurant(restaurant, dishId) {
  restaurant.dishes = restaurant.dishes.filter(d => d.id !== dishId);
}

export function dishExists(restaurant, name) {
  return restaurant.dishes.some(d => d.name.trim().toLowerCase() === name.toLowerCase());
}
