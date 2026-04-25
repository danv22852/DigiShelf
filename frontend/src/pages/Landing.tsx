import React from 'react';
import bookshelfImg from '../assets/bookshelf.jpeg';
import { Link } from 'react-router-dom';


const Landing: React.FC = () => {
  return (
    /* Added 'relative' so the absolute buttons know where to sit */
    <div className="min-h-screen relative flex flex-col items-center justify-start pt-32 bg-orange-50 p-4">
      
      {/* Top Right Navigation */}
      <nav className="absolute top-6 right-6 flex items-center gap-4">
        <Link to='/register' className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
          Register
        </Link>
        <Link to='/login' className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
          Log In
        </Link>
      </nav>

      <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">
        Digital Bookshelf
      </h1>

      <p className="mt-2 text-lg text-gray-700 font-medium text-center max-w-lg">
        A personal digital bookshelf to organize and track your reading journey!
      </p>


      {/* Image Container */}
      <div className="mt-8 w-full max-w-sm overflow-hidden rounded-2xl ">
        <img 
          src={bookshelfImg} 
          alt="Bookshelf"
          className="w-full h-auto object-cover"
        />
      </div>
      

    </div>
  );
}

export default Landing;
