import  { useState } from 'react';
import api from '../utils/api';
import Button from './ui/Button';
import Card from './ui/Card';

function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.get(`/users/search?term=${searchTerm}`);
      setSearchResults(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Error searching users. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
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
    <Card className="bg-gray-800 ">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users"
            className="flex-grow p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {searchResults.length > 0 ? (
        <ul className="space-y-2">
          {searchResults.map(user => (
            <li key={user._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-gray-700 rounded">
              <span className="text-white mb-2 sm:mb-0">{user.username}</span>
              {!user.requestSent ? (
                <Button 
                  onClick={() => handleSendRequest(user._id)} 
                  variant="primary" 
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Send Request
                </Button>
              ) : (
                <span className="text-primary-400">Request Sent</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No users found.</p>
      )}
    </Card>
  );
}

export default UserSearch;