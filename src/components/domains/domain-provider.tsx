
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

export interface ConnectedDomain {
  name: string;
  connectedAt: string;
  status: 'pending' | 'active';
}

interface DomainContextType {
  domains: ConnectedDomain[];
  addDomain: (name: string) => void;
  removeDomain: (name: string) => void;
  activateDomain: (name: string) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<ConnectedDomain[]>([]);
  
  const userStorageKey = user ? `connectedDomains_${user.uid}` : null;

  useEffect(() => {
    if (userStorageKey) {
      try {
        const item = window.localStorage.getItem(userStorageKey);
        const storedDomains = item ? JSON.parse(item) : [];
        const migratedDomains = storedDomains.map((d: any) => ({
            ...d,
            status: d.status || 'active'
        }));
        setDomains(migratedDomains);
      } catch (error) {
        console.error("Failed to read domains from localStorage.", error);
        setDomains([]);
      }
    } else {
      setDomains([]);
    }
  }, [userStorageKey]);

  useEffect(() => {
    if (userStorageKey) {
      try {
        window.localStorage.setItem(userStorageKey, JSON.stringify(domains));
      } catch (error) {
        console.error("Failed to write domains to localStorage", error);
      }
    }
  }, [domains, userStorageKey]);

  const addDomain = useCallback((name: string) => {
    setDomains(prev => {
      if (!name || prev.some(d => d.name === name)) return prev;
      const newDomain: ConnectedDomain = {
        name,
        connectedAt: new Date().toISOString(),
        status: 'pending',
      };
      return [newDomain, ...prev];
    });
  }, []);
  
  const removeDomain = useCallback((name: string) => {
    setDomains(prev => prev.filter(d => d.name !== name));
  }, []);

  const activateDomain = useCallback((name: string) => {
    setDomains(prev => prev.map(d => d.name === name ? { ...d, status: 'active' } : d));
  }, []);


  const value = { domains, addDomain, removeDomain, activateDomain };

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
