import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../helper/RootNavigation";
import { ActivityIndicator } from "react-native";
import NewsAppRoutes from "./NewsAppRoutes";
import AuthRoutes from "./AuthRoutes";
import { GlobalContext } from "../Context/Globalcontext";
import * as Linking from "expo-linking";

const AppContainer = () => {
  const { authentication, authLoaded, setAuthentication } = useContext(GlobalContext);

  const prefix = Linking.createURL("/news"); // Update the prefix to match your deep link structure

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        News: "news", // Update the screen name to match your route name in NewsAppRoutes
        NotFound: "*",
      },
    },
  };

  return (
    <>
      {authLoaded ? (
        <NavigationContainer ref={navigationRef} linking={linking}>
          {/* {authentication ? (
            <NewsAppRoutes setAuthentication={setAuthentication} />
          ) : (
            <AuthRoutes />
          )} */}
          <NewsAppRoutes setAuthentication={setAuthentication} />
        </NavigationContainer>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

export default AppContainer;
