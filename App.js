import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity } from 'react-native'; 

// Importerer skærme til navigation
import dashboard from './components/home'; 
import booking from './components/book';
import history from './components/history';
import profile from './components/profile';
import settings from './components/settings';

// Importerer globale stilarter
import { GlobalStyle } from './styles/globalstyles';

// Firebase opsætning: Konfigurer Firebase
const firebaseConfig = {
  apiKey: "AIzaSyADvL16QaGmXg8ezO35f2SHfuS7b-JOvfE",
  authDomain: "ovelseinnt.firebaseapp.com",
  projectId: "ovelseinnt",
  storageBucket: "ovelseinnt.appspot.com",
  messagingSenderId: "650756283665",
  appId: "1:650756283665:web:3aedccd7112f60a494c0b0",
};

// Initialiserer Firebase, hvis den ikke allerede er initialiseret
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const Tab = createBottomTabNavigator();

// Login-komponent for brugerens autentificering (Login eller Sign-up)
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Håndter login med email og adgangskode
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => onLogin(userCredential.user))
      .catch(error => console.error('Login fejl:', error));
  };

  // Håndter sign-up med email og adgangskode
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => onLogin(userCredential.user))
      .catch(error => console.error('Sign-up fejl:', error));
  };

  return (
    <View style={GlobalStyle.container}>
      <Text>{isSignUp ? 'Opret konto' : 'Login'}</Text>
      <TextInput 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        style={GlobalStyle.textInput}
      />
      <TextInput 
        placeholder="Adgangskode" 
        onChangeText={setPassword} 
        value={password} 
        secureTextEntry 
        style={GlobalStyle.textInput}
      />
      
      {/* Login/Sign-up knap */}
      <View style={GlobalStyle.buttonContainer}>
        <TouchableOpacity 
          style={GlobalStyle.primaryBtn} 
          onPress={isSignUp ? handleSignUp : handleLogin}
        >
          <Text style={GlobalStyle.primaryBtnText}>
            {isSignUp ? "Opret konto" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Skift mellem Login og Sign-up formularer */}
      <View style={GlobalStyle.buttonContainer}>
        <TouchableOpacity 
          style={GlobalStyle.secondaryBtn} 
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={GlobalStyle.secondaryBtnText}>
            {isSignUp ? "Har du en konto? Login" : "Ny bruger? Opret konto"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Hoved App-komponent med navigation og autentificeringstjek
export default function App() {
  const [user, setUser] = useState(null);

  // Sætter op en lytter til ændringer i brugerens autentificeringstilstand
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => setUser(user));
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        // Hvis brugeren er autentificeret, vis bottom tab navigation med forskellige skærme
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
        // Hvis ingen bruger er autentificeret, vis Login-skærmen
        <Login onLogin={setUser} />
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
