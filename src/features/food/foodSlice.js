
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_BASE_URL from "../../api";

// Fetch foods from Spring Boot + MySQL
export const fetchFoods = createAsyncThunk(
  "food/fetchFoods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/foods`);

      if (!response.ok) {
        throw new Error("Unable to fetch foods from backend");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const foodSlice = createSlice({
  name: "food",

  initialState: {
    items: [],
    cart: [],
    orders: [],
    status: "idle",
    error: null
  },

  reducers: {
    addFood: (state, action) => {
      state.items.push(action.payload);
    },

    updateFood: (state, action) => {
      const index = state.items.findIndex(
        (food) => food.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteFood: (state, action) => {
      state.items = state.items.filter(
        (food) => food.id !== action.payload
      );
    },

    addToCart: (state, action) => {
      const food = action.payload;

      const existing = state.cart.find(
        (item) => item.id === food.id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...food, quantity: 1 });
      }
    },

    changeQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.cart.find(
        (food) => food.id === id
      );

      if (!item) return;

      if (quantity <= 0) {
        state.cart = state.cart.filter(
          (food) => food.id !== id
        );
      } else {
        item.quantity = quantity;
      }
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (food) => food.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.cart = [];
    },

    placeOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },

    updateOrderStatus: (state, action) => {
      const { orderNumber, status } = action.payload;

      const order = state.orders.find(
        (item) => item.orderNumber === orderNumber
      );

      if (order) {
        order.status = status;
      }
    },

    cancelOrder: (state, action) => {
      const order = state.orders.find(
        (item) => item.orderNumber === action.payload
      );

      if (order && (order.status || "Pending") === "Pending") {
        order.status = "Cancelled";
      }
    },

    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.orderNumber !== action.payload
      );
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })

      .addCase(fetchFoods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  }
});

export const {
  addFood,
  updateFood,
  deleteFood,
  addToCart,
  changeQuantity,
  removeFromCart,
  clearCart,
  placeOrder,
  updateOrderStatus,
  cancelOrder,
  deleteOrder
} = foodSlice.actions;

export default foodSlice.reducer;
