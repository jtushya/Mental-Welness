import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Book } from 'lucide-react';

interface JournalEntryProps {
  onClose: () => void;
  onSave: (entry: string) => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ onClose, onSave }) => {
  const [entry, setEntry] = useState('');
  const [prompt, setPrompt] = useState('How are you feeling today?');

  const journalPrompts = [
    'How are you feeling today?',
    'What made you smile today?',
    'What\'s challenging you right now?',
    'What are you grateful for?',
    'What would you like to improve about yourself?'
  ];

  const handleSave = () => {
    if (entry.trim()) {
      onSave(entry);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl w-full"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Book className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Journal Entry</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Writing Prompt
            </label>
            <button
              onClick={() => setPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)])}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Get New Prompt
            </button>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-purple-800">
            {prompt}
          </div>
        </div>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Start writing here..."
          className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={!entry.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Save Entry</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalEntry;