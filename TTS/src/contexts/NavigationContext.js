import React, { createContext, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  return (
    <NavigationContext.Provider
      value={{
        currentLocation, setCurrentLocation
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}