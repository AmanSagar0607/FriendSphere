import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';
import api from '../utils/api';
import Button from './ui/Button';
import Card from './ui/Card';

function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [interests, setInterests] = useState(user?.interests?.join(', ') || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', { 
        interests: interests.split(',').map(i => i.trim()) 
      });
      dispatch(setUser(res.data));
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="mb-4">
            <strong className="text-gray-700">Username:</strong> {user.username}
          </div>
          <div className="mb-4">
            <strong className="text-gray-700">Friends:</strong> {user.friends ? user.friends.length : 0}
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="interests" className="block text-gray-700 mb-2">Interests (comma-separated):</label>
                <input
                  type="text"
                  id="interests"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="mb-4">
              <strong className="text-gray-700">Interests:</strong> {user.interests?.join(', ') || 'None'}
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-4">
                Edit
              </Button>
            </div>
          )}
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </Card>
    </div>
  );
}

export default Profile;