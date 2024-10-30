import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RiskFormButton = ({ title, buttonStyle, textStyle }) => {
  const navigation = useNavigation()

  return (
    <View>
      <TouchableOpacity 
        style={[styles.button, buttonStyle]}
        onPress={() => navigation.navigate('RiskForm')}
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