import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; // Changed Button to TouchableOpacity
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GlobalStyle } from '../styles/globalstyles'; // Assuming styles are stored here

export default function BookingComponent() {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [futureDates, setFutureDates] = useState([]);
  const dateBooked = new Date();
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const handleBooking = async () => {
    if (!selectedSport || !selectedTime || !selectedDate) {
      alert('Please select sport, time, and date for booking.');
      return;
    }

    try {
      await addDoc(collection(db, 'bookings'), {
        sport: selectedSport,
        time: selectedTime,
        date: selectedDate,
        dateBooked: dateBooked,
        userId: userId,
      });
      alert('Booking successful!');
    } catch (e) {
      console.error('Error adding booking: ', e);
      alert('Failed to book time');
    }
  };

  const getFutureDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 4; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const formattedDate = `${futureDate.getDate()}/${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`;
      dates.push(formattedDate);
    }

    return dates;
  };

  useEffect(() => {
    setFutureDates(getFutureDates());
  }, []);

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.heading}>Create Booking Here:</Text>

      <Text style={GlobalStyle.subText}>Select Sport:</Text>
      <Picker
        selectedValue={selectedSport}
        onValueChange={(itemValue) => setSelectedSport(itemValue)}
        style={GlobalStyle.picker}
      >
        <Picker.Item label="Select Sport" value="" />
        <Picker.Item label="Soccer" value="soccer" />
        <Picker.Item label="Basketball" value="basketball" />
        <Picker.Item label="Tennis" value="tennis" />
      </Picker>

      <Text style={GlobalStyle.subText}>Select Time:</Text>
      <Picker
        selectedValue={selectedTime}
        onValueChange={(itemValue) => setSelectedTime(itemValue)}
        style={GlobalStyle.picker}
      >
        <Picker.Item label="Select Time" value="" />
        <Picker.Item label="8:00 AM" value="8:00 AM" />
        <Picker.Item label="10:00 AM" value="10:00 AM" />
        <Picker.Item label="12:00 PM" value="12:00 PM" />
        <Picker.Item label="2:00 PM" value="2:00 PM" />
      </Picker>

      <Text style={GlobalStyle.subText}>Select Date:</Text>
      <Picker
        selectedValue={selectedDate}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
        style={GlobalStyle.picker}
      >
        <Picker.Item label="Select Date" value="" />
        {futureDates.map((date, index) => (
          <Picker.Item key={index} label={date} value={date} />
        ))}
      </Picker>

      <View style={GlobalStyle.buttonContainer}>
        <TouchableOpacity 
          style={GlobalStyle.secondaryBtn} 
          onPress={handleBooking}>
          <Text style={GlobalStyle.secondaryBtnText}>Book Time</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
