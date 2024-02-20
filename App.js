import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Home from "./components/Home";
import { Dimensions } from "react-native";
import AppContainer from "./routes/AppContainer";
import GlobalProvider from "./Context/Globalcontext";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export default function App() {
  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    // success: (props) => (
    //   <BaseToast
    //     {...props}
    //     text1NumberOfLines={20}

    //   />
    // ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
      <ErrorToast
        {...props}
        text1NumberOfLines={20}
        text1Style={{
          color: "#E34234"
        }}
      />
    )
  };



  return (
    <GlobalProvider>
      <StatusBar backgroundColor="rgba(255, 255, 255, 1)" style='dark' />
      <AppContainer />
      <Toast position="bottom" config={toastConfig} />
    </GlobalProvider>
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
