import{ useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setProfileModalOpen } from '../slices/userSlice';
import api from '../utils/api';
import Button from './ui/Button';

function ProfileModal() {
  const { user, isProfileModalOpen } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [interests, setInterests] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.interests) {
      setInterests(user.interests.join(', '));
    }
  }, [user]);

  if (!isProfileModalOpen) return null;

  const handleClose = () => {
    dispatch(setProfileModalOpen(false));
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', { 
        interests: interests.split(',').map(i => i.trim()).filter(i => i) 
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="mb-4">
          <strong className="text-gray-300">Username:</strong> {user.username}
        </div>
        <div className="mb-4">
          <strong className="text-gray-300">Friends:</strong> {user.friends ? user.friends.length : 0}
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="interests" className="block text-gray-300 mb-2">Interests (comma-separated):</label>
              <input
                type="text"
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 bg-gray-700 text-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        ) : (
          <div className="mb-4">
            <strong className="text-gray-300">Interests:</strong> {user.interests?.join(', ') || 'None'}
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-4">
              Edit
            </Button>
          </div>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}
        <Button onClick={handleClose} className="mt-4">Close</Button>
      </div>
    </div>
  );
}

ProfileModal.propTypes = {
  // Add any props if the component receives any in the future
};

export default ProfileModal;