import { createSlice } from '@reduxjs/toolkit';
import { api } from './api';

const TOKEN = 'token';
const BASE_URL = 'http://localhost:5433';

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query({
      query: () => `${BASE_URL}/api/users/me`,
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: `${BASE_URL}/api/users/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: `${BASE_URL}/api/users/register`,
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      queryFn: () => ({ data: {} }),
    }),
  }),
});

const storeToken = (state, { payload }) => {
  state.token = payload.token;
  window.sessionStorage.setItem(TOKEN, payload.token);
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: window.sessionStorage.getItem(TOKEN),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, storeToken);
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeToken);
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
      state.token = null;
      window.sessionStorage.removeItem(TOKEN);
    });
  },
});

export default authSlice.reducer;
export const {
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
