import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Plus, Edit2, Trash2, Users, TrendingUp, Calendar, X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

interface Movie {
  _id: string;
  title: string;
  year: string;
  rating: string;
  thumbnailUrl: string;
  streamUrl: string;
  category?: {
    _id: string;
    name: string;
  };
  isTrending?: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface MovieFormData {
  title: string;
  year: string;
  rating: string;
  thumbnailUrl: string;
  streamUrl: string;
  category: string;
  isTrending: boolean;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'categories'>('overview');
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [movieForm, setMovieForm] = useState<MovieFormData>({
    title: '',
    year: '',
    rating: '',
    thumbnailUrl: '',
    streamUrl: '',
    category: '',
    isTrending: false
  });
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [moviesResponse, categoriesResponse] = await Promise.all([
        fetch('https://samchi.onrender.com/api/movies'),
        fetch('https://samchi.onrender.com/api/categories')
      ]);

      if (moviesResponse.ok) {
        const moviesData = await moviesResponse.json();
        setMovies(moviesData);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({
      title: '',
      year: '',
      rating: '',
      thumbnailUrl: '',
      streamUrl: '',
      category: '',
      isTrending: false
    });
    setShowMovieModal(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      thumbnailUrl: movie.thumbnailUrl,
      streamUrl: movie.streamUrl,
      category: movie.category?._id || '',
      isTrending: movie.isTrending || false
    });
    setShowMovieModal(true);
  };

  const handleSaveMovie = async () => {
    try {
      const url = editingMovie 
        ? `https://samchi.onrender.com/api/movies/${editingMovie._id}`
        : 'https://samchi.onrender.com/api/movies';
      
      const method = editingMovie ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieForm),
      });

      if (response.ok) {
        setShowMovieModal(false);
        fetchData();
      } else {
        console.error('Failed to save movie');
      }
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await fetch(`https://samchi.onrender.com/api/movies/${movieId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchData();
        } else {
          console.error('Failed to delete movie');
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      const url = editingCategory 
        ? `https://samchi.onrender.com/api/categories/${editingCategory._id}`
        : 'https://samchi.onrender.com/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        setShowCategoryModal(false);
        fetchData();
      } else {
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`https://samchi.onrender.com/api/categories/${categoryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchData();
        } else {
          console.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar showAuthButtons={false} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalMovies = movies.length;
  const trendingMovies = movies.filter(movie => movie.isTrending).length;
  const totalCategories = categories.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuthButtons={false} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your movie streaming platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b-4 border-black">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-500 text-black border-2 border-black transform -translate-y-1'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'movies'
                ? 'bg-primary-500 text-black border-2 border-black transform -translate-y-1'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'categories'
                ? 'bg-primary-500 text-black border-2 border-black transform -translate-y-1'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Categories
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="neo-card p-6 text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-2">{totalMovies}</h3>
              <p className="text-gray-600 font-medium">Total Movies</p>
            </div>

            <div className="neo-card p-6 text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-2">{trendingMovies}</h3>
              <p className="text-gray-600 font-medium">Trending Movies</p>
            </div>

            <div className="neo-card p-6 text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-2">{totalCategories}</h3>
              <p className="text-gray-600 font-medium">Categories</p>
            </div>
          </div>
        )}

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Manage Movies</h2>
              <button onClick={handleAddMovie} className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Movie</span>
              </button>
            </div>

            <div className="neo-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-black">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-black">Thumbnail</th>
                      <th className="px-6 py-4 text-left font-bold text-black">Title</th>
                      <th className="px-6 py-4 text-left font-bold text-black">Year</th>
                      <th className="px-6 py-4 text-left font-bold text-black">Rating</th>
                      <th className="px-6 py-4 text-left font-bold text-black">Category</th>
                      <th className="px-6 py-4 text-left font-bold text-black">Status</th>
                      <th className="px-6 py-4 text-left font-bold text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((movie, index) => (
                      <tr key={movie._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          <img 
                            src={movie.thumbnailUrl} 
                            alt={movie.title}
                            className="w-16 h-24 object-cover rounded border-2 border-black"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/489319/pexels-photo-489319.jpeg?auto=compress&cs=tinysrgb&w=200';
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-black">{movie.title}</td>
                        <td className="px-6 py-4 text-gray-600">{movie.year}</td>
                        <td className="px-6 py-4 text-gray-600">{movie.rating}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                            {movie.category?.name || 'No Category'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {movie.isTrending ? (
                            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-medium">
                              Trending
                            </span>
                          ) : (
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                              Regular
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditMovie(movie)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMovie(movie._id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Manage Categories</h2>
              <button onClick={handleAddCategory} className="btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category._id} className="neo-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-black">{category.name}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {movies.filter(movie => movie.category?._id === category._id).length} movies
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Movie Modal */}
      {showMovieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button 
                onClick={() => setShowMovieModal(false)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Title</label>
                <input
                  type="text"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Year</label>
                  <input
                    type="text"
                    value={movieForm.year}
                    onChange={(e) => setMovieForm({...movieForm, year: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Rating</label>
                  <input
                    type="text"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({...movieForm, rating: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={movieForm.thumbnailUrl}
                  onChange={(e) => setMovieForm({...movieForm, thumbnailUrl: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Stream URL</label>
                <input
                  type="url"
                  value={movieForm.streamUrl}
                  onChange={(e) => setMovieForm({...movieForm, streamUrl: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Category</label>
                <select
                  value={movieForm.category}
                  onChange={(e) => setMovieForm({...movieForm, category: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isTrending"
                  checked={movieForm.isTrending}
                  onChange={(e) => setMovieForm({...movieForm, isTrending: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="isTrending" className="text-sm font-semibold text-black">
                  Mark as Trending
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowMovieModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMovie}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingMovie ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({name: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary-500"
                  placeholder="Enter category name"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingCategory ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;