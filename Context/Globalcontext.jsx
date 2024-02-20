import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../helper/asyncStorage";
export const GlobalContext = createContext({});

const GlobalProvider = ({ children }) => {
  const [authentication, setAuthentication] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  React.useMemo(() => {
    const bootstrapAsync = async () => {
      try {
        let user = await getData("authKey");
        if (user !== undefined) {
          setAuthLoaded(true);
          setAuthentication(true);
        } else {
          setAuthLoaded(true);
          setAuthentication(false);
        }
      } catch (e) {
        // Restoring token failed
      }
    };
    bootstrapAsync();
  }, [AsyncStorage]);

  return (
    <GlobalContext.Provider value={{ authentication, setAuthentication, authLoaded }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
