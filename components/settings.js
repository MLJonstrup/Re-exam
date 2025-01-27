import React from 'react';
import { Text, View, Switch, TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/globalstyles'; 

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);  // State til at holde styr på om mørk tilstand er aktiveret

  // Funktion til at skifte mellem mørk og lys tilstand
  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);  // Skift tilstanden
  };

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.heading}>Indstillinger</Text>
      
      <View style={GlobalStyle.settingItem}>
        <Text style={GlobalStyle.subText}>Mørk tilstand</Text>
        <Switch
          onValueChange={toggleTheme}  // Når værdien ændres, kaldes toggleTheme funktionen
          value={isDarkMode}  // Sætter værdien af switch baseret på isDarkMode
          trackColor={{ false: "#767577", true: "#81b0ff" }}  // Farve på switch track (baggrund)
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}  // Farve på switch thumb (knappen)
        />
      </View>

      {/* Flere indstillingsmuligheder kan tilføjes her */}
      
      <TouchableOpacity 
        style={GlobalStyle.secondaryBtn}
        onPress={() => alert('Indstillinger gemt!')}>  {/* Simuler gemmehandling */}
        <Text style={GlobalStyle.secondaryBtnText}>Gem Indstillinger</Text>
      </TouchableOpacity>
    </View>
  );
}
