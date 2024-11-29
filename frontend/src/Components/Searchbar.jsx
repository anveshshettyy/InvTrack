import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce'; // Ensure you install lodash.debounce

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch suggestions based on the search term
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]); // Clear suggestions if the query is empty
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/search?query=${query}`, { withCredentials: true });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Debounced function to handle search input
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Handle search input change
  const handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedFetchSuggestions(value); // Call the debounced function
  };

  // Handle selection of a suggestion
  const handleSelect = (item) => {
    if (item.type === 'inventory') {
      navigate(`/inventory/${item._id}`);
    } else if (item.type === 'item') {
      navigate(`/item/${item._id}`);
    }
    setSearchTerm(''); // Clear the search bar
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="relative text-black">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for items, inventories or categories..."
        className="border border-gray-400 rounded-md px-2 py-2 focus:outline-none focus:border-[#124468]"
      />
      {searchTerm && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <span className="font-semibold">{suggestion.name} {suggestion.type === 'inventory' ? '(Inventory)' : `(Item - ${suggestion.category})`}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">Nothing found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
