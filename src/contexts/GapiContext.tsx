import React, { createContext, useContext, useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

interface GapiContextType {
  isGapiInitialized: boolean;
}

const GapiContext = createContext<GapiContextType>({ isGapiInitialized: false });

export const useGapi = () => useContext(GapiContext);

export const GapiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGapiInitialized, setIsGapiInitialized] = useState(false);

  useEffect(() => {
    const initGapiClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/keep.readonly',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/keep/v1/rest'],
      }).then(() => {
        setIsGapiInitialized(true);
      });
    };
    gapi.load('client:auth2', initGapiClient);
  }, []);

  return (
    <GapiContext.Provider value={{ isGapiInitialized }}>
      {children}
    </GapiContext.Provider>
  );
};
