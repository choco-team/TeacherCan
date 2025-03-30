'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AllergyContextType = {
  allergies: string[];
  setAllergies: React.Dispatch<React.SetStateAction<string[]>>;
};

const AllergyContext = createContext<AllergyContextType | undefined>(undefined);

export function AllergyProvider({ children }: { children: React.ReactNode }) {
  const [allergies, setAllergies] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAllergies = localStorage.getItem('allergies');
      if (storedAllergies) {
        setAllergies(JSON.parse(storedAllergies));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('allergies', JSON.stringify(allergies));
    }
  }, [allergies]);

  return (
    <AllergyContext.Provider value={{ allergies, setAllergies }}>
      {children}
    </AllergyContext.Provider>
  );
}

export const useAllergy = (): AllergyContextType => {
  const context = useContext(AllergyContext);
  if (!context)
    throw new Error('useAllergy must be used within an AllergyProvider');
  return context;
};
