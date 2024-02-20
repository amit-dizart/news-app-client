import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../Pages/LoginPage";
import { GlobalContext } from "../Context/Globalcontext";
import SignUp from "../Pages/SignupPage";

const AuthRoutes = (props) => {
  const Stack = createNativeStackNavigator();
  const { setAuthentication } = useContext(GlobalContext)
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        options={({ route }) => ({
          headerShown: false,
        })}
      >
        {({ navigation }) => (
          <LoginPage
            setAuthentication={(e) => {
              setAuthentication(e)
            }}
            navigation={navigation}
          />)}
      </Stack.Screen>

      <Stack.Screen
        name="SignUp"
        options={({ route }) => ({
          headerShown: false,
        })}
      >
        {({ navigation }) => (
          <SignUp
            setAuthentication={(e) => {
              setAuthentication(e)
            }}
            navigation={navigation}
          />)}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

AuthRoutes.propTypes = {};

export default AuthRoutes;
