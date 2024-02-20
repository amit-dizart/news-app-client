import Toast from "react-native-toast-message";
export const showToast = (type, msg) => {
  Toast.show({
      type: type,
      text1: msg,
  });
} 