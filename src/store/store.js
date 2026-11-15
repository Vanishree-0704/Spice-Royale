
import { configureStore } from "@reduxjs/toolkit";
import foodReducer, { fetchFoods } from "../features/food/foodSlice";

const loadState = () => {
  try {
    const savedState = localStorage.getItem("spiceRoyaleState");
    return savedState ? JSON.parse(savedState) : undefined;
  } catch (error) {
    console.error("Error loading saved data:", error);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    food: foodReducer
  },
  preloadedState: loadState()
});

// Save Redux state to LocalStorage
store.subscribe(() => {
  try {
    localStorage.setItem(
      "spiceRoyaleState",
      JSON.stringify(store.getState())
    );
  } catch (error) {
    console.error("Error saving data:", error);
  }
});

// Load latest food data from MySQL
store.dispatch(fetchFoods());
