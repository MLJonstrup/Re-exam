import React from 'react';
import { Text, View, Switch, TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/globalstyles'; // Assuming styles are stored here

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Toggles the dark mode setting
  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
  };

  return (
    <View style={GlobalStyle.container}>
      <Text style={GlobalStyle.heading}>Settings</Text>
      
      <View style={GlobalStyle.settingItem}>
        <Text style={GlobalStyle.subText}>Dark Mode</Text>
        <Switch
          onValueChange={toggleTheme}
          value={isDarkMode}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      {/* You can add more settings options here */}
      
      <TouchableOpacity 
        style={GlobalStyle.secondaryBtn}
        onPress={() => alert('Settings saved!')}>
        <Text style={GlobalStyle.secondaryBtnText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
