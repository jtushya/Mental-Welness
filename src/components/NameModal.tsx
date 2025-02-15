import React, { useState } from 'react';

interface NameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

const NameModal: React.FC<NameModalProps> = ({ isOpen, onSubmit }) => {
  const [inputName, setInputName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      onSubmit(inputName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to MindfulAI</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              What's your name?
            </label>
            <input
              type="text"
              id="name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameModal;