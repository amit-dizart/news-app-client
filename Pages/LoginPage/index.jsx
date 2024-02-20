import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, useContext } from "react-native";
import { storeData } from '../../helper/asyncStorage';
import { CommonActions } from "@react-navigation/native";
import { GlobalContext } from '../../Context/Globalcontext';
import { showToast } from '../../helper/toastMessage';
import instance from '../../helper/axiosInstance';
import Loader from '../../components/Loader';



export default function LoginPage({ navigation, setAuthentication }) {

  const [initialState, setInitialState] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)


  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validate = () => {
    const { email, password } = initialState;

    if (!email && !password) {
      showToast('error', "Please enter email and password. 😓");
      return false;
    } else if (!email) {
      showToast('error', "Please enter email. 😓");
      return false;
    } else if (!password) {
      showToast('error', "Please enter password. 😓");
      return false;
    } else if (!isValidEmail(email)) {
      showToast('error', "Please enter a valid email. 😓");
      return false;
    }
    return true;
  };

  const doLogin = async () => {
    if (validate()) {
      try {
        setLoading(true)
        const response = await (await instance.post("login", initialState)).data
        setLoading(false)
        if (response.message === "login") {
          showToast('success', "Logged in Succesfully. 🥳")
          await storeData('authKey', 'true');
          await storeData('userData', JSON.stringify(response?.data))
          setAuthentication(true);
        } else {
          showToast('error', response.message)
        }
      } catch (e) {
        setLoading(false)
        console.log("Error : ", e)
        showToast('error', "Something went wrong")
      }
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.contentBox}>
          <Text style={styles.logo}>News App</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Enter your mail'
              onChangeText={(e) => {
                setInitialState((prev) => ({
                  ...prev,
                  email: e
                }))
              }}
            />
            <TextInput
              style={styles.input}
              placeholder='Enter your password'
              secureTextEntry={true}
              onChangeText={(e) => {
                setInitialState((prev) => ({
                  ...prev,
                  password: e
                }))
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={doLogin}
          >
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.signupTextContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Loader show={loading} />
    </>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
    width: windowWidth,
    height: windowHeight,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBox: {
    backgroundColor: '#F2F2F2',
    borderRadius: 15,
    padding: 20,
    width: '85%',

    alignItems: 'center',
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
  },
  loginButton: {
    width: '30%',
    backgroundColor: 'orange',
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
  },
  signupTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    marginRight: 5,
  },
  signupLink: {
    color: 'orange',
  },
});