import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import UserSearch from './UserSearch';
import FriendRequests from './FriendRequests';
import Card from './ui/Card';
import Button from './ui/Button';

const MemoizedUserSearch = React.memo(UserSearch);
const MemoizedFriendRequests = React.memo(FriendRequests);

function Home() {
  const [friends, setFriends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useSelector(state => state.user);

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
    }
  }, [fetchFriends]);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchRecommendations();
    }
  }, [user, fetchFriends, fetchRecommendations]);

  const friendsList = useMemo(() => (
    <ul className="space-y-4">
      {friends.map(friend => (
        <li key={friend._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">{friend.username}</span>
          <Button onClick={() => handleUnfriend(friend._id)} variant="outline" size="sm">Unfriend</Button>
        </li>
      ))}
    </ul>
  ), [friends, handleUnfriend]);

  const recommendationsList = useMemo(() => (
    <ul className="space-y-4">
      {recommendations.map(rec => (
        <li key={rec._id} className="bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">{rec.username}</span>
          <p className="text-sm text-gray-600">Mutual Friends: {rec.mutualFriends}</p>
        </li>
      ))}
    </ul>
  ), [recommendations]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center py-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-xl mt-10">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to FriendSphere</h1>
          <p className="text-xl text-white mb-8">Connect, Share, and Thrive in Your Social Circle</p>
          <div className="space-x-4">
            <Link to="/login" className="bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-primary-100 transition duration-300">
              Login
            </Link>
            <Link to="/signup" className="bg-primary-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-900 transition duration-300">
              Sign Up
            </Link>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Connect</h2>
            <p className="text-gray-600">Find and connect with friends, old and new. Expand your social network effortlessly.</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Share</h2>
            <p className="text-gray-600">Share your interests, experiences, and moments with your friends in a safe environment.</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Discover</h2>
            <p className="text-gray-600">Discover new connections through our smart friend recommendation system.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Welcome, {user.username}!</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Find Friends</h2>
              <MemoizedUserSearch />
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Friends</h2>
              {friends.length > 0 ? friendsList : <p className="text-gray-600">You have no friends yet.</p>}
            </div>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Friend Requests</h2>
              <MemoizedFriendRequests />
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recommended Friends</h2>
              {recommendations.length > 0 ? recommendationsList : <p className="text-gray-600">No recommendations available.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Home);