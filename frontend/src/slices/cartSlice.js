import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      //cart handling
      const curItem = action.payload;

      const existItem = state.cartItems.find(
        (item) => item._id === curItem._id
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((item) =>
          item._id === existItem._id ? curItem : item
        );
      } else {
        state.cartItems = [...state.cartItems, curItem];
      }

      updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      updateCart(state);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
