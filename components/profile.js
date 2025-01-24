import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: 'Client',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        console.log('No such document! Creating a new profile.');
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Save profile changes
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, profile, { merge: true });

      alert('Profile saved successfully!');
      setIsEditing(false);
    } catch (e) {
      console.error('Error saving profile: ', e);
      alert('Failed to save profile');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out successfully!');
    } catch (error) {
      console.error('Error during logout: ', error);
      alert('Failed to log out');
    }
  };

  // Fetch and update location in profile
  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        setProfile({ ...profile, location: reverseGeocode[0].city || '' });
      }
    } catch (error) {
      console.error("Couldn't fetch location: ", error);
      Alert.alert('Error fetching location');
    }
  };

  return (
    <View>
      <Text>Profile Page</Text>

      <TextInput
        value={profile.name}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Name"
      />
      <TextInput
        value={profile.email}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        placeholder="Email"
      />

      {/* Location Input */}
      <TextInput
        value={profile.location}
        editable={isEditing}
        onChangeText={(text) => setProfile({ ...profile, location: text })}
        placeholder="City (Enter manually or fetch)"
      />
      {isEditing && (
        <Button title="Fetch Location" onPress={fetchLocation} />
      )}

      {/* Picker for Role Selection */}
      {isEditing && (
        <Picker
          selectedValue={profile.role}
          onValueChange={(itemValue) => setProfile({ ...profile, role: itemValue })}
        >
          <Picker.Item label="Trainer" value="Trainer" />
          <Picker.Item label="Client" value="Client" />
        </Picker>
      )}

      {isEditing ? (
        <Button title="Save" onPress={handleSave} />
      ) : (
        <Button title="Edit" onPress={() => setIsEditing(true)} />
      )}

      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}
