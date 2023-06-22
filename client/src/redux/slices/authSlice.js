import { createSlice } from "@reduxjs/toolkit";

// Check for token and user data in localStorage
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
  isAuthenticated: !!token,
  user: user ? JSON.parse(user) : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

// -------------------------------------------------------------

// import { createSlice } from "@reduxjs/toolkit";

// // Check for token and user data in localStorage
// const token = localStorage.getItem("token");
// const user = localStorage.getItem("user"); // Assuming you also store user data in localStorage

// const initialState = {
//   isAuthenticated: !!token, // Convert to boolean. If token exists, it'll be true.
//   user: user ? JSON.parse(user) : null, // Parse the user data if it exists
// };

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;
