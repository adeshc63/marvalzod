import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Users, Zap, Film, TrendingUp, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar />
      
      {/* Hero Section */}
      <section className="grid-bg py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-black text-black mb-6 leading-tight">
              Streamline Your{' '}
              <span className="relative">
                <span className="bg-yellow-400 px-4 py-2 inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_#000]">
                  Movie Experience
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-medium">
              Discover, stream, and enjoy the latest blockbusters and timeless classics 
              with our cutting-edge streaming platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/movies"
                className="btn-primary text-xl px-10 py-4 flex items-center space-x-3 group"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Start Streaming</span>
              </Link>
              <Link
                to="/login"
                className="btn-outline text-xl px-10 py-4"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 text-black">
              Experience Cinema Like Never Before
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform brings you the ultimate movie streaming experience with cutting-edge features and seamless playback.
            </p>
          </div>

          {/* Dashboard Mockup */}
          <div className="neo-card p-8 mb-16 animate-scale-in">
            <div className="bg-black rounded-lg p-6 text-white">
              {/* Mock Navigation */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <Film className="w-6 h-6 text-primary-500" />
                  <span className="font-bold text-lg">MARVALZOD</span>
                </div>
                <div className="flex space-x-4">
                  <span className="text-gray-300">Movies</span>
                  <span className="text-gray-300">Trending</span>
                  <span className="text-gray-300">Categories</span>
                </div>
              </div>

              {/* Mock Hero Movie */}
              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-bold inline-block mb-4">
                    TRENDING NOW
                  </div>
                  <h3 className="text-4xl font-black mb-4">Featured Movie</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>2024</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>8.5</span>
                    </span>
                  </div>
                  <div className="bg-primary-500 text-black px-6 py-3 rounded font-bold inline-flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Watch Now</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                  <Play className="w-16 h-16 text-primary-500" />
                </div>
              </div>

              {/* Mock Movie Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-lg h-32 flex items-center justify-center">
                    <Film className="w-8 h-8 text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-black text-black mb-2">1000+</h3>
              <p className="text-gray-600 font-medium">Movies Available</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-black text-black mb-2">50+</h3>
              <p className="text-gray-600 font-medium">Trending Movies</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-black text-black mb-2">10K+</h3>
              <p className="text-gray-600 font-medium">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16 text-black">
            Why Choose Marvalzod?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="neo-card p-8 text-center animate-scale-in">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Lightning Fast</h3>
              <p className="text-gray-600 text-lg">
                Experience ultra-fast streaming with zero buffering and instant playback.
              </p>
            </div>
            <div className="neo-card p-8 text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Premium Quality</h3>
              <p className="text-gray-600 text-lg">
                Watch in crystal-clear HD and 4K resolution with immersive sound quality.
              </p>
            </div>
            <div className="neo-card p-8 text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Multi-Device</h3>
              <p className="text-gray-600 text-lg">
                Stream seamlessly across all your devices - phone, tablet, laptop, or TV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-12 text-gray-300">
            Join thousands of movie enthusiasts who have already discovered the future of streaming.
          </p>
          <Link
            to="/movies"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-black font-bold text-xl px-12 py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-lg font-medium">
            © 2025 Marvalzod. All rights reserved. Built with passion for movie lovers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;