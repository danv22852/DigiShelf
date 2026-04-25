import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-4">
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-orange-100">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Welcome Back! 👋</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="••••••••" />
          </div>
          
          <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-transform active:scale-95">
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Don't have an account? <Link to="/register" className="text-black font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
