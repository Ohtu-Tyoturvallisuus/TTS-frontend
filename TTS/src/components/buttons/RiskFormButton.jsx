import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigate } from 'react-router-native';

const RiskFormButton = ({ title, buttonStyle, textStyle }) => {
  const navigate = useNavigate()

  return (
    <View>
      <TouchableOpacity 
        style={[styles.button, buttonStyle]}
        onPress={() => navigate('worksafetyform')}
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