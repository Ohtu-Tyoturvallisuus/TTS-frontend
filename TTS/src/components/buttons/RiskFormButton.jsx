import React, { useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContext } from '@contexts/NavigationContext';

const RiskFormButton = ({ title, setVisible, buttonStyle, textStyle }) => {
  const { setCurrentLocation } = useContext(NavigationContext);
  const navigation = useNavigation()

  const handlePress = () => {
    setCurrentLocation('RiskForm');
    navigation.navigate('RiskForm');
    setVisible(false);
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={handlePress}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#32CD32',
    borderRadius: 5,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
    padding: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default RiskFormButton;
