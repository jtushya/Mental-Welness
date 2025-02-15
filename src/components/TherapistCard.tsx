import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const TherapistCard = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg overflow-hidden my-6 relative"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517898717281-8e4385a41802?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')] opacity-10" />
      
      <motion.div
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: '100% 50%' }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        className="relative p-8 flex items-center justify-between"
      >
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Talk to AI Therapist</h3>
          <p className="text-white/90 mb-4">Share your thoughts and feelings in a safe space</p>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90 transition-colors">
            <MessageCircle className="w-5 h-5" />
            Start Conversation
          </button>
        </div>
        
        <div className="hidden md:block">
          <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TherapistCard;