import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface NameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

const NameModal: React.FC<NameModalProps> = ({ isOpen, onSubmit }) => {
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user.displayName) {
        onSubmit(user.displayName);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to MindfulAI</h2>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-all duration-200 mb-4"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default NameModal;