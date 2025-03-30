'use client';

import React, { createContext, useContext, useState } from 'react';

type AllergyContextType = {
  allergies: string[];
  setAllergies: React.Dispatch<React.SetStateAction<string[]>>;
};

const AllergyContext = createContext<AllergyContextType | undefined>(undefined);

export function AllergyProvider({ children }: { children: React.ReactNode }) {
  const [allergies, setAllergies] = useState<string[]>(() => {
    const storedAllergies = localStorage.getItem('allergies');
    return storedAllergies ? JSON.parse(storedAllergies) : [];
  });

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
