import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  // This Ref will track if we have already successfully verified
  const hasVerified = useRef(false);

  useEffect(() => {
    // If we already succeeded in the first "Strict Mode" run, stop here.
    if (hasVerified.current) return;

    const verifyToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`);
        const data = await response.json();

        if (response.ok) {
          hasVerified.current = true; // Mark as done
          setStatus('success');
        } else {
          // If the account is ALREADY verified, the backend might return 400.
          // We check for that specific case so we don't show an "Error".
          if (data.message === "Email already verified") {
            setStatus('success');
          } else {
            setStatus('error');
            setMessage(data.message || 'Verification failed.');
          }
        }
      } catch (error) {
        setStatus('error');
        setMessage('Server connection failed.');
      }
    };

    if (token) verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 p-4 text-center">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-orange-100 max-w-md w-full">
        {status === 'loading' && (
          <div className="flex flex-col items-center text-gray-600">
            <Loader2 className="animate-spin mb-4 text-blue-600" size={48} />
            <h2 className="text-xl font-bold">Verifying your email...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-green-600">
            <CheckCircle className="mb-4" size={48} />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Email Verified! 🎉</h2>
            <p className="text-gray-600 mb-6">Your account is now active.</p>
            <Link to="/login" className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all">
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-red-600">
            <XCircle className="mb-4" size={48} />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/login" className="text-black font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
