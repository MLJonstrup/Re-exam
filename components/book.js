import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; 
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GlobalStyle } from '../styles/globalstyles'; 

export default function BookingComponent() {
  const [selectedSport, setSelectedSport] = useState('');  // Valgt sport
  const [selectedTime, setSelectedTime] = useState('');    // Valgt tid
  const [selectedDate, setSelectedDate] = useState('');    // Valgt dato
  const [futureDates, setFutureDates] = useState([]);     // Fremtidige datoer
  const dateBooked = new Date();  // Dato for booking
  const db = getFirestore();  // Firebase Firestore reference
  const auth = getAuth();  // Firebase Auth reference
  const userId = auth.currentUser?.uid;  // Hent brugerens UID

  // Håndter booking af tid
  const handleBooking = async () => {
    if (!selectedSport || !selectedTime || !selectedDate) {
      alert('Please select sport, time, and date for booking.');
      return; // Hvis ikke alle felter er udfyldt, vis advarsel
    }

    try {
      // Tilføj bookingdata til Firestore
      await addDoc(collection(db, 'bookings'), {
        sport: selectedSport,
        time: selectedTime,
        date: selectedDate,
        dateBooked: dateBooked,
        userId: userId,
      });
      alert('Booking successful!');  // Bekræft booking
    } catch (e) {
      console.error('Error adding booking: ', e);
      alert('Failed to book time');  // Fejl ved booking
    }
  };

  // Funktion til at generere fremtidige datoer (de næste 4 dage)
  const getFutureDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 4; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);  // Tilføj i dage til den aktuelle dato
      const formattedDate = `${futureDate.getDate()}/${futureDate.getMonth() + 1}/${futureDate.getFullYear()}`;
      dates.push(formattedDate);  // Formater datoen og tilføj til listen
    }

    return dates;
  };

  useEffect(() => {
    setFutureDates(getFutureDates());  // Opdater listen med fremtidige datoer
  }, []);

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.heading}>Create Booking Here:</Text>

      <Text style={GlobalStyle.subText}>Select Sport:</Text>
      <Picker
        selectedValue={selectedSport}
        onValueChange={(itemValue) => setSelectedSport(itemValue)}  // Opdater valgt sport
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
        onValueChange={(itemValue) => setSelectedTime(itemValue)}  // Opdater valgt tid
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
        onValueChange={(itemValue) => setSelectedDate(itemValue)}  // Opdater valgt dato
        style={GlobalStyle.picker}
      >
        <Picker.Item label="Select Date" value="" />
        {futureDates.map((date, index) => (
          <Picker.Item key={index} label={date} value={date} />  // Vis fremtidige datoer
        ))}
      </Picker>

      <View style={GlobalStyle.buttonContainer}>
        {/* Book tid knap */}
        <TouchableOpacity 
          style={GlobalStyle.secondaryBtn} 
          onPress={handleBooking}
        >
          <Text style={GlobalStyle.secondaryBtnText}>Book Time</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
