import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity } from 'react-native'; // Changed Button to TouchableOpacity

// Import screens
import dashboard from './components/home'; 
import booking from './components/book';
import history from './components/history';
import profile from './components/profile';
import settings from './components/settings';

// Import Global Styles
import { GlobalStyle } from './styles/globalstyles'; // Assuming your styles are in this file

// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyADvL16QaGmXg8ezO35f2SHfuS7b-JOvfE",
  authDomain: "ovelseinnt.firebaseapp.com",
  projectId: "ovelseinnt",
  storageBucket: "ovelseinnt.appspot.com",
  messagingSenderId: "650756283665",
  appId: "1:650756283665:web:3aedccd7112f60a494c0b0",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const Tab = createBottomTabNavigator();

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => onLogin(userCredential.user))
      .catch(error => console.error('Login error:', error));
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => onLogin(userCredential.user))
      .catch(error => console.error('Sign-up error:', error));
  };

  return (
    <View style={GlobalStyle.container}>
      <Text>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      <TextInput 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        style={GlobalStyle.textInput}
      />
      <TextInput 
        placeholder="Password" 
        onChangeText={setPassword} 
        value={password} 
        secureTextEntry 
        style={GlobalStyle.textInput}
      />
      
      {/* Custom Buttons with the same style as TextInput */}
      <View style={GlobalStyle.buttonContainer}>
        <TouchableOpacity 
          style={GlobalStyle.primaryBtn} 
          onPress={isSignUp ? handleSignUp : handleLogin}
        >
          <Text style={GlobalStyle.primaryBtnText}>
            {isSignUp ? "Sign Up" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={GlobalStyle.buttonContainer}>
        <TouchableOpacity 
          style={GlobalStyle.secondaryBtn} 
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={GlobalStyle.secondaryBtnText}>
            {isSignUp ? "Have an account? Login" : "New user? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => setUser(user));
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator>
          <Tab.Screen 
            name="Home" 
            component={dashboard} 
            options={{
              tabBarIcon: () => (<Ionicons name="home" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Book new time" 
            component={booking} 
            options={{
              tabBarIcon: () => (<Ionicons name="add" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="See past bookings" 
            component={history} 
            options={{
              tabBarIcon: () => (<Ionicons name="book" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Profile" 
            component={profile} 
            options={{
              tabBarIcon: () => (<Ionicons name="person" size={20} />),
              headerShown: false
            }} 
          />
          <Tab.Screen 
            name="Settings" 
            component={settings} 
            options={{
              tabBarIcon: () => (<Ionicons name="settings" size={20} />),
              headerShown: false
            }} 
          />
        </Tab.Navigator>
      ) : (
        <Login onLogin={setUser} />
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
