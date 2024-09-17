import  { useEffect, useState } from 'react';
import api from '../utils/api';

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const res = await api.get('/friends/requests');
      setRequests(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching friend requests:', err);
      setError('Error fetching friend requests. Please try again.');
      setRequests([]);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await api.post(`/friends/accept/${userId}`);
      fetchFriendRequests();
    } catch (err) {
      console.error('Error accepting friend request:', err);
      setError('Error accepting friend request. Please try again.');
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.post(`/friends/reject/${userId}`);
      fetchFriendRequests();
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      setError('Error rejecting friend request. Please try again.');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {requests.length > 0 ? (
        <ul className="space-y-2">
          {requests.map(request => (
            <li key={request._id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <span>{request.username}</span>
              <div className="space-x-2">
                <button 
                  onClick={() => handleAccept(request._id)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleReject(request._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-secondary-600">No friend requests at the moment.</p>
      )}
    </div>
  );
}

export default FriendRequests;