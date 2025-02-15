import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const quotes = [
  {
    text: "Healing is not linear. Be patient with yourself; every step forward is progress.",
    author: "Unknown"
  },
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    text: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr."
  }
];

const QuoteSlider = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-40 bg-gradient-to-r from-purple-100 to-blue-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center px-12"
          >
            <Quote className="absolute top-6 left-6 w-8 h-8 text-purple-400 opacity-50" />
            <div className="text-center">
              <p className="text-xl text-gray-800 mb-4 font-medium">{quotes[currentQuote].text}</p>
              <p className="text-gray-600">- {quotes[currentQuote].author}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <button
          onClick={prevQuote}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={nextQuote}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default QuoteSlider;