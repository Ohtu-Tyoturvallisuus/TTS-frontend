import React, { createContext, useState } from 'react';

// Create a Context for user info
export const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
