import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigate } from 'react-router-native';

const RiskFormButton = ({ title='Tee uusi työturvallisuuslomake', worksite, buttonStyle, textStyle }) => {
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
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default RiskFormButton;