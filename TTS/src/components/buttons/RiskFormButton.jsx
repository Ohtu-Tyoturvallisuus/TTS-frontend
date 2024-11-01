import React, { useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigate } from 'react-router-native';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';

// Opens new empty risk form
const RiskFormButton = ({ title, buttonStyle, textStyle }) => {
  const navigate = useNavigate()
  const { setSelectedSurveyURL } = useContext(ProjectSurveyContext);

  const handlePress = () => {
    setSelectedSurveyURL(null);
    navigate('riskform');
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