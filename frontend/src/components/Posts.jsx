import React, { useState, useEffect, useCallback, useRef } from 'react';
// import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import api from '../utils/api';
import Button from './ui/Button';
import Card from './ui/Card';
import LoadingSpinner from './ui/LoadingSpinner';
import { FaHeart, FaRegHeart, FaReply } from 'react-icons/fa';
import ProfileModal from './ProfileModal';
import { setProfileModalOpen } from '../slices/userSlice';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isProfileModalOpen } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const observer = useRef();

  const lastPostElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/posts?page=${page}&limit=10`);
      setPosts(prevPosts => [...prevPosts, ...res.data.posts]);
      setHasMore(res.data.hasMore);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/posts', { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost('');
      setError(null);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleReply = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/reply`, { content: replyContent });
      setPosts(posts.map(post => 
        post._id === postId ? res.data : post
      ));
      setReplyContent('');
      setReplyingTo(null);
      setError(null);
    } catch (err) {
      console.error('Error replying to post:', err);
      setError('Failed to reply to post. Please try again.');
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/like/${postId}`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: res.data } : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post. Please try again.');
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const res = await api.post(`/posts/unlike/${postId}`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: res.data } : post
      ));
    } catch (err) {
      console.error('Error unliking post:', err);
      setError('Failed to unlike post. Please try again.');
    }
  };

  const openProfileModal = () => {
    dispatch(setProfileModalOpen(true));
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Posts</h1>
          {/* <Button onClick={openProfileModal}>Profile</Button> */}
        </div>
        <Card className="bg-gray-800 p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 bg-gray-700 text-white"
              placeholder="What's on your mind?"
            />
            <Button type="submit" className="mt-2 " disabled={!newPost.trim()}>Post</Button>
          </form>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </Card>
        {isLoading && posts.length === 0 ? (
          <div className="text-center mt-8">Loading...</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <React.Fragment key={post._id}>
                {index > 0 && <hr className="border-gray-700 opacity-20 my-6" />}
                <Card className="bg-gray-800 p-4 shadow-sm" ref={index === posts.length - 1 ? lastPostElementRef : null}>
                  <p className="mb-2">{post.content}</p>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-400">Posted by: {post.user.username}</p>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaReply />
                      </button>
                      <div className="flex items-center">
                        {post.likes.includes(user._id) ? (
                          <FaHeart className="text-red-500 cursor-pointer" onClick={() => handleUnlike(post._id)} />
                        ) : (
                          <FaRegHeart className="text-gray-400 cursor-pointer" onClick={() => handleLike(post._id)} />
                        )}
                        <span className="ml-1 text-gray-400">{post.likes.length}</span>
                      </div>
                    </div>
                  </div>
                  {replyingTo === post._id && (
                    <div className="mt-2 mb-4">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500 bg-gray-700 text-white"
                        placeholder="Write a reply..."
                      />
                      <Button onClick={() => handleReply(post._id)} className="mt-2" disabled={!replyContent.trim()}>Reply</Button>
                    </div>
                  )}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-700">
                      {post.replies.map(reply => (
                        <div key={reply._id} className="bg-gray-700 p-3 rounded">
                          <p>{reply.content}</p>
                          <p className="text-sm text-gray-400 mt-1">Replied by: {reply.user.username}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </React.Fragment>
            ))}
            {isLoading && <div className="text-center mt-4"><LoadingSpinner /></div>}
          </div>
        )}
      </div>
      <ProfileModal />
    </div>
  );
}

Posts.propTypes = {
  // Add any props if the component receives any in the future
};

export default Posts;