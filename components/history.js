import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 
import { StatusBar } from 'expo-status-bar';
import { GlobalStyle } from '../styles/globalstyles'; 

export default function HomeComponent() {
  const [pastEvents, setPastEvents] = useState([]);  // State til at gemme tidligere bookinger
  const db = getFirestore();  // Firebase Firestore reference
  const auth = getAuth();  // Firebase Auth reference
  const userId = auth.currentUser?.uid;  // Hent brugerens UID

  // Hent tidligere bookinger fra Firestore
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
      const pastBookings = bookingList.filter(booking => {
        if (booking.date && typeof booking.date === 'string') {
          const bookingDate = parseDate(booking.date);  // Parse datoen fra booking
          return bookingDate < today;  // Filtrer bookinger, der er før dagens dato
        }
        return false;
      });

      // Sorter de tidligere bookinger efter dato, fra nyeste til ældste
      pastBookings.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA;  // Sortér i faldende rækkefølge
      });

      setPastEvents(pastBookings);  // Opdater state med de filtrerede og sorterede bookinger
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
      <Text style={GlobalStyle.heading}>Past Bookings:</Text>

      {/* Hvis der ikke er nogen tidligere bookinger */}
      {pastEvents.length === 0 ? (
        <Text style={GlobalStyle.subText}>No past bookings available.</Text>  // Vis besked
      ) : (
        <FlatList
          data={pastEvents}  // Brug FlatList til at vise de tidligere bookinger
          keyExtractor={(item) => item.id}  // Sørg for, at hver listeelement har en unik nøgle
          renderItem={({ item }) => (
            <View style={GlobalStyle.itemContainer}>
              <Text style={GlobalStyle.itemText}>
                {item.sport} - {item.date} at {item.time}  // Vis sport, dato og tid for booking
              </Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}
