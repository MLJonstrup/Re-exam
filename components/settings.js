import React from 'react';
import { Text, View, Switch } from 'react-native';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Toggles the dark mode setting
  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
  };

  return (
    <View>
      <Text>Dark Mode</Text>
      <Switch
        onValueChange={toggleTheme}
        value={isDarkMode}
      />
    </View>
  );
}
