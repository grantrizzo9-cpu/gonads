'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export interface ConnectedDomain {
  name: string;
  connectedAt: string;
}

interface DomainContextType {
  domains: ConnectedDomain[];
  addDomain: (name: string) => void;
  removeDomain: (name: string) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'connectedDomains';

const getInitialState = (): ConnectedDomain[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Failed to read domains from localStorage.", error);
    return [];
  }
};

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  const [domains, setDomains] = useState<ConnectedDomain[]>(getInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(domains));
    } catch (error) {
      console.error("Failed to write domains to localStorage", error);
    }
  }, [domains]);

  const addDomain = useCallback((name: string) => {
    if (!name || domains.some(d => d.name === name)) return;
    const newDomain: ConnectedDomain = {
      name,
      connectedAt: new Date().toISOString(),
    };
    setDomains(prev => [newDomain, ...prev]);
  }, [domains]);
  
  const removeDomain = useCallback((name: string) => {
    setDomains(prev => prev.filter(d => d.name !== name));
  }, []);

  const value = { domains, addDomain, removeDomain };

  return (
    <DomainContext.Provider value={value}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomains = (): DomainContextType => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomains must be used within a DomainProvider');
  }
  return context;
};
