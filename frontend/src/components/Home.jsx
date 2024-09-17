import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import UserSearch from './UserSearch';
import FriendRequests from './FriendRequests';
import Card from './ui/Card';
import Button from './ui/Button';
import ProfileModal from './ProfileModal';
import { setProfileModalOpen } from '../slices/userSlice';
import UserPosts from './UserPosts';

const MemoizedUserSearch = React.memo(UserSearch);
const MemoizedFriendRequests = React.memo(FriendRequests);

function Home() {
  const [friends, setFriends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const { user, isProfileModalOpen } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const fetchFriends = useCallback(async () => {
    try {
      const res = await api.get('/friends');
      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setFriends([]);
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await api.get('/friends/recommendations');
      setRecommendations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setRecommendations([]);
    }
  }, []);

  const handleUnfriend = useCallback(async (friendId) => {
    try {
      await api.post(`/friends/unfriend/${friendId}`);
      fetchFriends();
    } catch (err) {
      console.error('Error unfriending:', err);
      setError('Failed to unfriend. Please try again.');
    }
  }, [fetchFriends]);

  const handleSendRequest = async (userId) => {
    try {
      await api.post(`/friends/request/${userId}`);
      setRecommendations(prevRecommendations => 
        prevRecommendations.filter(rec => rec._id !== userId)
      );
      setError(null);
    } catch (err) {
      console.error('Error sending friend request:', err);
      if (err.response && err.response.status === 400) {
        setError(err.response.data.msg || 'Unable to send friend request. You might already be friends or have a pending request.');
      } else {
        setError('Failed to send friend request. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchRecommendations();
    }
  }, [user, fetchFriends, fetchRecommendations]);

  const friendsList = useMemo(() => (
    <ul className="space-y-4">
      {friends.map(friend => (
        <li key={friend._id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <span className="font-medium text-white">{friend.username}</span>
          <Button onClick={() => handleUnfriend(friend._id)} variant="outline" size="sm" className="text-red-400 hover:bg-red-900 hover:text-red-300">Unfriend</Button>
        </li>
      ))}
    </ul>
  ), [friends, handleUnfriend]);

  const recommendationsList = useMemo(() => (
    <ul className="space-y-2">
      {recommendations.map(rec => (
        <li key={rec._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-gray-700 rounded">
          <div>
            <span className="text-white">{rec.username}</span>
            <p className="text-sm text-gray-400">Mutual Friends: {rec.mutualFriends}</p>
          </div>
          <Button 
            onClick={() => handleSendRequest(rec._id)} 
            variant="primary" 
            size="sm"
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            Send Request
          </Button>
        </li>
      ))}
    </ul>
  ), [recommendations]);

  const handleCloseProfileModal = () => {
    dispatch(setProfileModalOpen(false));
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 min-h-screen flex flex-col justify-center items-center text-white">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Welcome to FriendSphere</h1>
          <p className="text-xl mb-8">Connect, Share, and Thrive in Your Social Circle</p>
          <div className="space-x-4 mb-12">
            <Link to="/login" className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 hover:text-blue-700 transition duration-300 inline-block">
              Login
            </Link>
            <Link to="/signup" className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 hover:text-white transition duration-300 inline-block">
              Sign Up
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {['Connect', 'Share', 'Discover'].map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-20 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">{feature}</h2>
                <p className="text-white">
                  {feature === 'Connect' && 'Find and connect with friends, old and new. Expand your social network effortlessly.'}
                  {feature === 'Share' && 'Share your interests, experiences, and moments with your friends in a safe environment.'}
                  {feature === 'Discover' && 'Discover new connections through our smart friend recommendation system.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UserPosts />
            <Card className="bg-gray-800">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">Your Friends</h2>
                {friends.length > 0 ? friendsList : <p className="bg-gray-700 text-gray-400">You have no friends yet.</p>}
              </div>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="bg-gray-800 p-4">
              <h2 className="text-2xl font-semibold mb-4 text-white">Find Friends</h2>
              <MemoizedUserSearch />
            </Card>
            <Card className="bg-gray-800 p-4">
              <h2 className="text-2xl font-semibold mb-4 bg-gray-800 text-white">Friend Requests</h2>
              <MemoizedFriendRequests />
            </Card>
            <Card className="bg-gray-800 p-4">
              <h2 className="text-2xl font-semibold mb-4 text-white">Recommended Friends</h2>
              {recommendations.length > 0 ? recommendationsList : <p className="text-gray-400">No recommendations available.</p>}
            </Card>
          </div>
        </div>
      </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={handleCloseProfileModal} />
    </div>
  );
}

export default React.memo(Home);