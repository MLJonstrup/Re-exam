import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('client'); 
  const auth = getAuth();
  const db = getFirestore(); 

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        userType: userType, 
      });

      alert('Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      alert('Signup failed: ' + error.message);
    }
  };

  return (
    <View>
      <Text>Signup</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      
      <Text>Select User Type:</Text>
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Client" value="client" />
        <Picker.Item label="Trainer" value="trainer" />
      </Picker>

      <Button title="Signup" onPress={handleSignup} />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}
