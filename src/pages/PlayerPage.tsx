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
  const [volume, setVolume] = useState(1); // Volume from 0 to 1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
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
      const response = await fetch('https://samchi.koyeb.app/api/movies');
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0); // Mute if volume is 0
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
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
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
        >
          <source src={movie.streamUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        )}

        {/* Overlay Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          onMouseMove={() => setShowControls(true)}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between">
            <Link
              to="/movies"
              className="flex items-center space-x-2 text-white hover:text-primary-500 transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-semibold">Back to Movies</span>
            </Link>
            <div className="text-white text-right">
              <h1 className="text-lg md:text-2xl font-bold">{movie.title}</h1>
              <p className="text-gray-300 text-xs md:text-base">{movie.year} • Rating: {movie.rating}</p>
            </div>
          </div>

          {/* Center Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="bg-primary-500 hover:bg-primary-600 text-black p-4 md:p-6 rounded-full transform hover:scale-110 transition-all duration-200"
              >
                <Play className="w-8 h-8 md:w-12 md:h-12" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-white text-sm font-medium">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleProgressChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-white text-sm font-medium">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2 md:space-x-6">
                {/* Skip Back */}
                <button
                  onClick={() => skipTime(-10)}
                  className="text-white hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="bg-primary-500 hover:bg-primary-600 text-black p-2 md:p-3 rounded-full transition-all duration-200"
                >
                  {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8" /> : <Play className="w-6 h-6 md:w-8 md:h-8" />}
                </button>

                {/* Skip Forward */}
                <button
                  onClick={() => skipTime(10)}
                  className="text-white hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <RotateCw className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-white/10"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <Maximize className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
