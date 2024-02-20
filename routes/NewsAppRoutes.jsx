import { StyleSheet, useContext } from "react-native";
import { Dimensions } from "react-native";
import Home from "../components/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalContext } from "../Context/Globalcontext";

export default function NewsAppRoutes({setAuthentication}) {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={({ route }) => ({
          headerShown: false,
        })}>
        {({ navigation }) => (
          <Home
            setAuthentication={(e) => {
              setAuthentication(e)
            }}
          />)}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
    width: windowWidth,
    height: windowHeight,
    paddingTop: 20
    // alignItems: "center",
    // justifyContent: "center",
  },
});