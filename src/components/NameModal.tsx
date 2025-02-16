import React, { useState } from 'react';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface NameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

const NameModal: React.FC<NameModalProps> = ({ isOpen, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First try popup
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user?.displayName) {
        onSubmit(result.user.displayName);
      }
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked') {
        try {
          // If popup is blocked, try redirect
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Error signing in with redirect:', redirectError);
          setError('Unable to sign in. Please try again.');
        }
      } else {
        console.error('Error signing in:', error);
        setError('Unable to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to MindfulAI</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-all duration-200 mb-4 relative"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
          ) : (
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
          )}
          <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>

        <p className="text-sm text-gray-500 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default NameModal;