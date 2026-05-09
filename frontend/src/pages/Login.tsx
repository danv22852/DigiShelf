import React, { useState } from 'react'; // 1. Added useState
import { Link, useNavigate } from 'react-router-dom'; // 2. Added useNavigate
import { ArrowLeft } from 'lucide-react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';


const Login: React.FC = () => {
  // 3. Create states for inputs and messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for visibility
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Store the JWT token and redirect to dashboard
        localStorage.setItem('token', data.token);
        navigate('/dashboard'); // Change this to wherever your user goes after login
      } else {
        // This will catch "Invalid credentials" or "Please verify email"
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-orange-100">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Welcome Back! 👋</h2>
        
        {/* 5. Show error message if login fails */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="you@example.com" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="••••••••" 
              required
            />
            <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
          </div>
        </div>
           {loading ? <LoaderCircle className="animate-spin w-full max-w-md"size={20}color={"#656de2"} /> : <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-transform active:scale-95">
            Log In
          </button>}
          
        </form>

        <p className="mt-6 text-center text-gray-500">
          Don't have an account? <Link to="/register" className="text-black font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
