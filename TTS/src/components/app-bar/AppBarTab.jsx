import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AppBarTab = ({ text, to }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(to);
  };

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AppBarTab;