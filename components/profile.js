import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { GlobalStyle } from '../styles/globalstyles'; 

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: 'Client',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);  // State til at håndtere, om brugeren er i redigeringsmode
  const db = getFirestore();  // Firebase Firestore reference
  const auth = getAuth();  // Firebase Auth reference
  const userId = auth.currentUser?.uid;  // Hent brugerens UID

  useEffect(() => {
    // Funktion til at hente brugerens profil
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', userId);  // Reference til brugerens dokument i Firestore
      const docSnap = await getDoc(docRef);  // Hent dokumentet

      if (docSnap.exists()) {
        setProfile(docSnap.data());  // Opdater state med profildata
      } else {
        console.log('No such document! Creating a new profile.');  // Hvis dokumentet ikke findes
      }
    };

    if (userId) {
      fetchProfile();  // Hent profil, hvis brugerens UID findes
    }
  }, [userId]);

  // Funktion til at gemme ændringer i profilen
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', userId);  // Reference til brugerens dokument
      await setDoc(docRef, profile, { merge: true });  // Gem profilen med ændringerne

      alert('Profile saved successfully!');  // Bekræftelse af succesfuld gemning
      setIsEditing(false);  // Slå redigeringsmode fra
    } catch (e) {
      console.error('Error saving profile: ', e);  // Fejl ved gemning af profil
      alert('Failed to save profile');
    }
  };

  // Funktion til at logge ud
  const handleLogout = async () => {
    try {
      await signOut(auth);  // Log ud af Firebase
      Alert.alert('Logged out successfully!');  // Bekræftelse af succesfuld udlogning
    } catch (error) {
      console.error('Error during logout: ', error);  // Fejl ved udlogning
      alert('Failed to log out');
    }
  };

  // Funktion til at hente brugerens location og opdatere profilen
  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();  // Anmod om tilladelse til at få adgang til placering
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');  // Hvis adgang til placeringen blev nægtet
        return;
      }

      let location = await Location.getCurrentPositionAsync({});  // Hent den aktuelle placering
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        setProfile({ ...profile, location: reverseGeocode[0].city || '' });  // Opdater location i profilen med byen
      }
    } catch (error) {
      console.error("Couldn't fetch location: ", error);  // Fejl ved hentning af placering
      Alert.alert('Error fetching location');
    }
  };

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.heading}>Profile Page</Text>

      <TextInput
        style={GlobalStyle.input}
        value={profile.name}
        editable={isEditing}  // Gør feltet redigerbart, hvis isEditing er sandt
        onChangeText={(text) => setProfile({ ...profile, name: text })}  // Opdater profilens navn
        placeholder="Name"
      />
      <TextInput
        style={GlobalStyle.input}
        value={profile.email}
        editable={isEditing}  // Gør feltet redigerbart, hvis isEditing er sandt
        onChangeText={(text) => setProfile({ ...profile, email: text })}  // Opdater profilens email
        placeholder="Email"
      />

      {/* Location Input */}
      <TextInput
        style={GlobalStyle.input}
        value={profile.location}
        editable={isEditing}  // Gør feltet redigerbart, hvis isEditing er sandt
        onChangeText={(text) => setProfile({ ...profile, location: text })}  // Opdater location
        placeholder="City (Enter manually or fetch)"
      />
      {isEditing && (
        <TouchableOpacity 
          style={GlobalStyle.secondaryBtn} 
          onPress={fetchLocation}>
          <Text style={GlobalStyle.secondaryBtnText}>Fetch Location</Text>  {/* Hent brugerens location */}
        </TouchableOpacity>
      )}

      {/* Picker for Role Selection */}
      {isEditing && (
        <Picker
          selectedValue={profile.role}
          onValueChange={(itemValue) => setProfile({ ...profile, role: itemValue })}
          style={GlobalStyle.picker}
        >
          <Picker.Item label="Trainer" value="Trainer" />
          <Picker.Item label="Client" value="Client" />
        </Picker>
      )}

      {isEditing ? (
        <TouchableOpacity 
          style={GlobalStyle.secondaryBtn} 
          onPress={handleSave}>
          <Text style={GlobalStyle.secondaryBtnText}>Save</Text>  {/* Gem ændringer */}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={GlobalStyle.secondaryBtn} 
          onPress={() => setIsEditing(true)}>
          <Text style={GlobalStyle.secondaryBtnText}>Edit</Text>  {/* Skift til redigeringsmode */}
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={GlobalStyle.secondaryBtn} 
        onPress={handleLogout}>
        <Text style={GlobalStyle.secondaryBtnText}>Logout</Text>  {/* Log ud af appen */}
      </TouchableOpacity>
    </View>
  );
}
