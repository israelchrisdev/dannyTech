import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get('/search', { params: query });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    suggestions: [],
    loading: false,
    error: null,
    recentSearches: JSON.parse(localStorage.getItem('recentSearches')) || []
  },
  reducers: {
    addRecentSearch: (state, action) => {
      const searchTerm = action.payload;
      state.recentSearches = [
        searchTerm,
        ...state.recentSearches.filter(term => term !== searchTerm)
      ].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem('recentSearches');
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    clearSearch: (state) => {
      state.results = [];
      state.suggestions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data.products;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addRecentSearch, clearRecentSearches, setSuggestions, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;