import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { StatusBar } from 'expo-status-bar';
import { GlobalStyle } from '../styles/globalstyles'; // Assuming your styles are in this file

export default function HomeComponent() {
  const [events, setEvents] = useState([]);
  const db = getFirestore();
  const auth = getAuth(); 
  const userId = auth.currentUser?.uid; 

  const fetchBookings = async () => {
    if (!userId) return; 

    try {
      const bookingsCollection = collection(db, 'bookings');
      const q = query(bookingsCollection, where('userId', '==', userId)); 
      const bookingSnapshot = await getDocs(q); 

      const bookingList = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const today = new Date();
      const upcomingBookings = bookingList.filter(booking => {
        if (booking.date && typeof booking.date === 'string') {
          const bookingDate = parseDate(booking.date);
          return bookingDate >= today;
        }
        return false;
      });

      upcomingBookings.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB; 
      });

      setEvents(upcomingBookings);
    } catch (e) {
      console.error('Error fetching bookings: ', e);
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    fetchBookings();

    const intervalId = setInterval(() => {
      fetchBookings();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.heading}>Upcoming Bookings:</Text>
      {events.length === 0 ? (
        <Text style={GlobalStyle.subText}>No upcoming bookings available.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={GlobalStyle.itemContainer}>
              <Text style={GlobalStyle.itemText}>
                {item.sport} - {item.date} at {item.time}
              </Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}
