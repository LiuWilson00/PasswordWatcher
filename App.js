import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Animated } from 'react-native';

export default function App() {
  const password = ['1234', '5678']
  const userData = {
    '1234': {
      name: 'Wilson'
    },
    '5678': {
      name: 'Roy'
    }
  }
  const [ValidCode, setValidCode] = useState('')
  const [ValidState, setValidState] = useState(false)
  const [EnterState, setEnterState] = useState(true)
  const [firstEnter, setFirstEnter] = useState(false)
  const [user, setUser] = useState('Visitors')
  const [isWrongEnter, setIsWrongEnter] = useState(false)
  const stateView = [{
    stateName: 'tooShort',
    validFunction: (str) => {
      return str.length < 4 ? true : false
    },
    wrongText: (str) => {
      return <Text style={{ color: 'red' }}>密碼長度小於四碼</Text>
    }
  }, {
    stateName: 'containLetter',
    validFunction: (str) => {
      var regExp = /[a-zA-Z]/;
      return regExp.test(str) ? true : false
    },
    wrongText: (str) => {
      return <Text style={{ color: 'red' }}>密碼不可包含英文字</Text>
    }
  }]

  const logo = require('./src/img/logo.png')
  const wrongLogo = require('./src/img/wrong.png')
  var spinValue = new Animated.Value(0)
  var enterValue = new Animated.Value(0)
  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true  // To make use of native driver for performance
      }
    )).start()
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  Animated.timing(
    enterValue, {
    toValue: 1,
    duration: 500

  }
  ).start(() => {
    setIsWrongEnter(true)
  })

  const enterAni = enterValue.interpolate(
    {
      inputRange: [0, 1],
      outputRange: [400, 0]
    }
  )

  const dynamicValid = () => {
    let validViewArr = Array()

    stateView.forEach(state => {
      if (state.validFunction(ValidCode) && firstEnter) {
        validViewArr.push(state.wrongText(ValidCode))
      }
    })
    return validViewArr
  }
  const checkFirstEnter = () => {
    if (!firstEnter) {
      setFirstEnter(true)
    }
  }
  const textChange = (text) => {
    let isValid = true
    setValidCode(text)
    stateView.forEach(state => {
      if (state.validFunction(text)) {
        isValid = false
      }
    })
    setValidState(isValid)
  }
  const passwordEnter = () => {
    if (password.indexOf(ValidCode) >= 0) {
      setUser(userData[ValidCode].name)
    } else {
      setEnterState(false)

      setTimeout(() => {
        setIsWrongEnter(false)
      }, 100);

    }
  }


  if (user == 'Visitors') return (
    <View style={styles.container}>


      <Text>PASSWORD GAME</Text>
      {EnterState ? <Animated.Image style={[styles.logo, { transform: [{ rotate: spin }] }]} source={logo}></Animated.Image> :
        <View style={styles.wrongGroup}><Animated.Image style={[styles.logo, { transform: [{ translateX: isWrongEnter ? 0 : enterAni }] }]} source={wrongLogo} ></Animated.Image>
          <Text style={styles.wrongGroupText}>密碼錯誤,請重新輸入!</Text></View>}
      <TextInput maxLength={4} onChangeText={(text) => textChange(text)} onBlur={() => { checkFirstEnter() }} style={styles.textInput}></TextInput>
      <View>
        {dynamicValid()}
      </View>
      <TouchableOpacity
        disabled={!ValidState}
        onPress={() => passwordEnter()}
        style={[styles.button]} >
        <Text style={ValidState ? styles.btnText : styles.wrongText}>
          輸入密碼
          </Text>
      </TouchableOpacity>
    </View >
  );
  return (
    <View style={styles.container}>
      <Text>Hello! {user}</Text>
      <TouchableOpacity
        onPress={() => {
          setValidCode('')
          setUser('Visitors')
          setFirstEnter(false)
          setEnterState(true)
          setIsWrongEnter(false)
        }}
        style={[styles.logoutButton]} >
        <Text style={styles.logoutButtonText}>
          Logout
          </Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: "#e0dede", width: 100, fontSize: 30, borderRadius: 5,
    textAlign: "center", color: "gray"
  },
  logo: {
    width: 100,
    height: 100,
    margin: 50,
    // transform: [
    //   { rotateZ: "45deg" },
    // ]
  },
  button: {
    width: 400,
    height: 50,
    marginTop: 50,
    backgroundColor: 'gray',
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5

  },

  btnText: {
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    letterSpacing: 10,
    color: '#f7f7f7'

  },
  wrongText: {
    color: '#e0dede',
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    letterSpacing: 10,
  },
  wrongGroup: {
    justifyContent: "center",
    alignItems: "center"
  },
  wrongGroupText: {
    color: "red",
    marginBottom: 20
  },
  logoutButton: {
    width: 200,
    height: 50,
    marginTop: 50,
    backgroundColor: '#84a9ac',
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5
  },
  logoutButtonText: {
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
    letterSpacing: 10,
    color: '#f7f7f7'
  }
});
