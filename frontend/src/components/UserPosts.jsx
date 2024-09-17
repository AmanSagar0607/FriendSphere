import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from './ui/Button';
import Card from './ui/Card';

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/posts?limit=3'); // Fetch only 3 posts
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again.');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/posts', { content: newPost });
      setPosts(prevPosts => [res.data, ...prevPosts.slice(0, 2)]); // Keep only the latest 3 posts
      setNewPost('');
      setError(null);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleSeeMore = () => {
    navigate('/posts');
  };

  return (
    <Card className="bg-gray-800 p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">Recent Posts</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 bg-gray-700 text-white"
          placeholder="What's on your mind?"
        />
        <Button type="submit" className="mt-2" disabled={!newPost.trim()}>Post</Button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {posts.length > 0 ? (
            <>
              {posts.map(post => (
                <div key={post._id} className="bg-gray-700 p-4 rounded">
                  <p className="text-white">{post.content}</p>
                  <p className="text-sm text-gray-400 mt-2">Posted by: {post.user.username}</p>
                </div>
              ))}
              <Button onClick={handleSeeMore} variant="outline" className="w-full">
                See More Posts
              </Button>
            </>
          ) : (
            <p className="text-gray-400">No posts yet.</p>
          )}
        </div>
      )}
    </Card>
  );
}

UserPosts.propTypes = {
  // Add any props if the component receives any in the future
};

export default UserPosts;