import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@heroicons/react/outline';

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&category=${category}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value="all">All Categories</option>
        <option value="antiques">Antiques</option>
        <option value="art">Art</option>
        <option value="books">Books</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for anything"
        className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
};

export default SearchBar;