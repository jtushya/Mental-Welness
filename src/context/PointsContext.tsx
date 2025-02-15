import React, { createContext, useContext, useState, useEffect } from 'react';

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState(100); // Default starting points

  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
  }, []);

  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const newPoints = prev + amount;
      localStorage.setItem('userPoints', newPoints.toString());
      return newPoints;
    });
  };

  return (
    <PointsContext.Provider value={{ points, addPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};