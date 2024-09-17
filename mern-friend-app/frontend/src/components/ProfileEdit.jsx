import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../utils/api';
import { setUser } from '../slices/userSlice';

function ProfileEdit() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [interests, setInterests] = useState(user.interests.join(', '));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', { interests: interests.split(',').map(i => i.trim()) });
      dispatch(setUser(res.data));
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Interests (comma-separated):
        <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} />
      </label>
      <button type="submit">Update Profile</button>
    </form>
  );
}

export default ProfileEdit;