import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Play, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Movie {
  _id: string;
  title: string;
  year: string;
  rating: string;
  thumbnailUrl: string;
  streamUrl: string;
  category?: {
    name: string;
  };
  isTrending?: boolean;
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, selectedCategory]);

  useEffect(() => {
    // Auto-scroll trending carousel every 4 seconds
    const interval = setInterval(() => {
      if (trendingMovies.length > 0) {
        setCurrentTrendingIndex((prev) => 
          prev === trendingMovies.length - 1 ? 0 : prev + 1
        );
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [trendingMovies.length]);

  const fetchMovies = async () => {
    try {
      const response = await fetch('https://samchi.onrender.com/api/movies');
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      setMovies(data);
      
      // Filter trending movies
      const trending = data.filter((movie: Movie) => movie.isTrending);
      setTrendingMovies(trending);
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      setIsLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'trending') {
        filtered = filtered.filter(movie => movie.isTrending);
      } else {
        filtered = filtered.filter(movie => movie.category?.name === selectedCategory);
      }
    }

    setFilteredMovies(filtered);
  };

  const nextTrending = () => {
    setCurrentTrendingIndex((prev) => 
      prev === trendingMovies.length - 1 ? 0 : prev + 1
    );
  };

  const prevTrending = () => {
    setCurrentTrendingIndex((prev) => 
      prev === 0 ? trendingMovies.length - 1 : prev - 1
    );
  };

  const categories = ['all', 'trending', ...new Set(movies.map(movie => movie.category?.name).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-inter">
        <Navbar showAuthButtons={false} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-xl font-bold text-gray-600">Loading awesome movies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white font-inter">
        <Navbar showAuthButtons={false} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl font-bold text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMovies}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar showAuthButtons={false} />
      
      {/* Trending Movies Carousel */}
      {trendingMovies.length > 0 && (
        <section className="relative bg-black text-white py-16 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={trendingMovies[currentTrendingIndex]?.thumbnailUrl}
              alt={trendingMovies[currentTrendingIndex]?.title}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/489319/pexels-photo-489319.jpeg?auto=compress&cs=tinysrgb&w=1200';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black">🔥 Trending Now</h2>
              <div className="flex space-x-2">
                <button
                  onClick={prevTrending}
                  className="bg-primary-500 hover:bg-primary-600 text-black p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextTrending}
                  className="bg-primary-500 hover:bg-primary-600 text-black p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-black text-sm inline-block">
                  TRENDING #{currentTrendingIndex + 1}
                </div>
                <h3 className="text-5xl font-black leading-tight">
                  {trendingMovies[currentTrendingIndex]?.title}
                </h3>
                <div className="flex items-center space-x-4 text-lg">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">{trendingMovies[currentTrendingIndex]?.year}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{trendingMovies[currentTrendingIndex]?.rating}</span>
                  </span>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed font-medium">
                  Don't miss out on this trending blockbuster! Experience the movie that everyone's talking about.
                </p>
                <Link
                  to={`/player/${trendingMovies[currentTrendingIndex]?._id}`}
                  className="inline-flex items-center space-x-3 bg-primary-500 hover:bg-primary-600 text-black font-black text-xl px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Play className="w-6 h-6" />
                  <span>Watch Now</span>
                </Link>
              </div>

              <div className="relative">
                <div className="neo-card overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <img
                    src={trendingMovies[currentTrendingIndex]?.thumbnailUrl}
                    alt={trendingMovies[currentTrendingIndex]?.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/489319/pexels-photo-489319.jpeg?auto=compress&cs=tinysrgb&w=600';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Trending Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {trendingMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTrendingIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTrendingIndex ? 'bg-primary-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="bg-gray-50 border-b-4 border-black py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-black mb-8">Discover Movies</h1>
          
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-lg font-medium"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-lg font-bold"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Movies' : 
                     category === 'trending' ? 'Trending' : 
                     category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-gray-600">No movies found</p>
              <p className="text-gray-500 mt-2 font-medium">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMovies.map((movie, index) => (
                <div
                  key={movie._id}
                  className="neo-card overflow-hidden group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/489319/pexels-photo-489319.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    {movie.isTrending && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-lg font-black text-sm shadow-lg">
                        TRENDING
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <Link
                        to={`/player/${movie._id}`}
                        className="opacity-0 group-hover:opacity-100 bg-primary-500 text-black p-4 rounded-full transform scale-50 group-hover:scale-100 transition-all duration-300 hover:bg-primary-600"
                      >
                        <Play className="w-8 h-8" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-black text-black mb-2 group-hover:text-primary-500 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">{movie.year}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{movie.rating}</span>
                      </div>
                    </div>
                    {movie.category && (
                      <div className="mb-4">
                        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                          {movie.category.name}
                        </span>
                      </div>
                    )}
                    <Link
                      to={`/player/${movie._id}`}
                      className="block w-full btn-primary text-center font-bold"
                    >
                      Watch Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MoviesPage;