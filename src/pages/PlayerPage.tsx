import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';

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
}

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (id) {
      fetchMovie(id);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  const fetchMovie = async (movieId: string) => {
    try {
      const response = await fetch('https://samchi.onrender.com/api/movies');
      if (!response.ok) throw new Error('Failed to fetch movies');
      const movies = await response.json();
      const foundMovie = movies.find((m: Movie) => m._id === movieId);
      
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        setError('Movie not found');
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load movie. Please try again later.');
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white">Loading player...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500 mb-4">{error || 'Movie not found'}</p>
          <Link to="/movies" className="btn-primary">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative w-full h-screen">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={movie.thumbnailUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onMouseMove={() => setShowControls(true)}
          onClick={togglePlayPause}
        >
          <source src={movie.streamUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseMove={() => setShowControls(true)}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <Link
              to="/movies"
              className="flex items-center space-x-2 text-white hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold">Back to Movies</span>
            </Link>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{movie.title}</h1>
              <p className="text-gray-300">{movie.year} • Rating: {movie.rating}</p>
            </div>
          </div>

          {/* Center Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="bg-primary-500 hover:bg-primary-600 text-black p-6 rounded-full transform hover:scale-110 transition-all duration-200"
              >
                <Play className="w-12 h-12" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center justify-center space-x-6">
              {/* Skip Back */}
              <button
                onClick={() => skipTime(-10)}
                className="text-white hover:text-primary-500 transition-colors"
              >
                <RotateCcw className="w-8 h-8" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="bg-primary-500 hover:bg-primary-600 text-black p-3 rounded-full transition-all duration-200"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="text-white hover:text-primary-500 transition-colors"
              >
                <RotateCw className="w-8 h-8" />
              </button>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="text-white hover:text-primary-500 transition-colors"
              >
                {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary-500 transition-colors"
              >
                <Maximize className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Section */}
      <div className="bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-black text-black mb-4">{movie.title}</h2>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">
                  {movie.year}
                </span>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-medium">
                  ★ {movie.rating}
                </span>
                {movie.category && (
                  <span className="bg-primary-500 text-black px-3 py-1 rounded-full font-medium">
                    {movie.category.name}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Experience this amazing movie in high quality. Stream now and enjoy the cinematic experience 
                from the comfort of your home.
              </p>
              <Link to="/movies" className="btn-outline">
                Browse More Movies
              </Link>
            </div>
            <div className="neo-card p-6">
              <img
                src={movie.thumbnailUrl}
                alt={movie.title}
                className="w-full rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/489319/pexels-photo-489319.jpeg?auto=compress&cs=tinysrgb&w=600';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;