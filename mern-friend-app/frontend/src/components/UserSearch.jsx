import React, { useState } from 'react';
import api from '../utils/api';

function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/users/search?term=${searchTerm}`);
      setSearchResults(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Error searching users. Please try again.');
      setSearchResults([]);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      const response = await api.post(`/friends/request/${userId}`);
      console.log('Friend request response:', response.data);
      setSearchResults(searchResults.map(user => 
        user._id === userId ? { ...user, requestSent: true } : user
      ));
      setError(null);
    } catch (err) {
      console.error('Error sending friend request:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Error sending friend request. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users"
          className="flex-grow p-2 border border-secondary-300 rounded"
        />
        <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600">Search</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {searchResults.length > 0 ? (
        <ul className="space-y-2">
          {searchResults.map(user => (
            <li key={user._id} className="flex justify-between items-center p-2 bg-secondary-100 rounded">
              <span>{user.username}</span>
              {!user.requestSent && (
                <button onClick={() => handleSendRequest(user._id)} className="bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600">
                  Send Friend Request
                </button>
              )}
              {user.requestSent && <span className="text-primary-600">Friend Request Sent</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default UserSearch;