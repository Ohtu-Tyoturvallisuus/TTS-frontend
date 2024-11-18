import React, { createContext, useState } from 'react';

// Create a Context for user info
export const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [newUserSurveys, setNewUserSurveys] = useState(false);

  return (
    <UserContext.Provider
      value={{
        username, setUsername,
        email, setEmail,
        accessToken, setAccessToken,
        newUserSurveys, setNewUserSurveys
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
