
import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, useContext } from "react-native";
import { storeData } from '../../helper/asyncStorage';
import { CommonActions } from "@react-navigation/native";
import { GlobalContext } from '../../Context/Globalcontext';
import { showToast } from '../../helper/toastMessage';
import instance from '../../helper/axiosInstance';
import Loader from '../../components/Loader';
export default function SignUp({ navigation, setAuthentication}) {

  const [initialState, setInitialState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validate = () => {
    const { email, password, confirmPassword, name } = initialState;

    if (!email && !password && !name) {
      showToast('error', 'Please enter all details. 😓');
      return false;
    }
    else if (!name) {
      showToast('error', 'Please enter name. 😓');
      return false;
    } 
    else if (!email) {
      showToast('error', 'Please enter email. 😓');
      return false;
    }
    else if (!password) {
      showToast('error', 'Please enter password. 😓');
      return false;
    }
     else if (!isValidEmail(email)) {
      showToast('error', 'Please enter a valid email. 😓');
      return false;
    }
    else if (password?.length < 9) {
      showToast('error', 'Password must be longer than or equal to 9 characters. 😓');
      return false;
    }
    else if (!confirmPassword) {
      showToast('error', 'Please enter confirm password. 😓');
      return false;
    } else if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match. 😓');
      return false;
    } else if (!name) {
      showToast('error', 'Please enter your name. 😓');
      return false;
    }
    return true;
  };

  const doSignUp = async () => {

    if (validate()) {
      try {
        setLoading(true)
        const response = await (await instance.post("users", { "email": initialState?.email, "name": initialState?.name, "password": initialState?.password })).data
        setLoading(false)
        if (response.message === "created") {
          showToast('success', "Account Created Succesfully. 🥳")
          await storeData('authKey', 'true');
          await storeData('userData',JSON.stringify(response?.data))
          setAuthentication(true);
        }else{
          showToast('error', response.message)
        }
      } catch (error) {
        setLoading(false)
        showToast('error', "Something went wrong")
        console.log("Error : ", error)
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
              placeholder='Enter your name'
              onChangeText={(e) => {
                setInitialState((prev) => ({
                  ...prev,
                  name: e
                }))
              }}
            />
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
            <TextInput
              style={styles.input}
              placeholder='Confirm your password'
              secureTextEntry={true}
              onChangeText={(e) => {
                setInitialState((prev) => ({
                  ...prev,
                  confirmPassword: e
                }))
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={doSignUp}
          >
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.signupTextContainer}>
            <Text style={styles.signupText}>if you already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Loader show={loading}/>
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