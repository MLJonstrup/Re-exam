import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { StatusBar } from 'expo-status-bar';
import { GlobalStyle } from '../styles/globalstyles'; 

export default function HomeComponent() {
  const [events, setEvents] = useState([]);  // State til at gemme kommende bookinger
  const db = getFirestore();  // Firebase Firestore reference
  const auth = getAuth();  // Firebase Auth reference
  const userId = auth.currentUser?.uid;  // Hent brugerens UID

  // Hent kommende bookinger fra Firestore
  const fetchBookings = async () => {
    if (!userId) return;  // Hvis brugerens UID ikke findes, afslut funktionen

    try {
      const bookingsCollection = collection(db, 'bookings');  // Reference til bookings-kollektionen i Firestore
      const q = query(bookingsCollection, where('userId', '==', userId));  // Filtrer bookinger baseret på brugerens UID
      const bookingSnapshot = await getDocs(q);  // Hent alle bookinger for den nuværende bruger

      // Map de hentede dokumenter til en liste med bookingdata
      const bookingList = bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const today = new Date();  // Opret en ny dato for dagens dato
      const upcomingBookings = bookingList.filter(booking => {
        if (booking.date && typeof booking.date === 'string') {
          const bookingDate = parseDate(booking.date);  // Parse datoen fra booking
          return bookingDate >= today;  // Filtrer bookinger, der er på eller efter dagens dato
        }
        return false;
      });

      // Sorter de kommende bookinger efter dato, fra tidligste til seneste
      upcomingBookings.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB;  // Sortér i stigende rækkefølge
      });

      setEvents(upcomingBookings);  // Opdater state med de filtrerede og sorterede bookinger
    } catch (e) {
      console.error('Error fetching bookings: ', e);  // Fejl ved hentning af bookinger
    }
  };

  // Funktion til at parse datoen fra formatet 'dd/mm/yyyy' til en Date-objekt
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);  // Del datoen op og omdan den til tal
    return new Date(year, month - 1, day);  // Returnér en Date med år, måned og dag
  };

  // Brug useEffect til at hente bookinger ved komponentens første render og opdatere dem med interval
  useEffect(() => {
    fetchBookings();  // Hent bookinger ved første render

    const intervalId = setInterval(() => {
      fetchBookings();  // Opdater bookinger hver 10. sekund
    }, 10000);

    return () => clearInterval(intervalId);  // Ryd intervallet, når komponenten afmonteres
  }, []);

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.heading}>Upcoming Bookings:</Text>

      {/* Hvis der ikke er nogen kommende bookinger */}
      {events.length === 0 ? (
        <Text style={GlobalStyle.subText}>No upcoming bookings available.</Text>  // Vis besked
      ) : (
        <FlatList
          data={events}  // Brug FlatList til at vise de kommende bookinger
          keyExtractor={(item) => item.id}  // Sørg for, at hver listeelement har en unik nøgle
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
