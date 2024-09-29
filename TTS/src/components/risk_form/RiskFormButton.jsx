import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigate } from 'react-router-native';

const RiskFormButton = ({ title, worksite }) => {
  const navigate = useNavigate()

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigate('worksafetyform')}
      >
        <Text style={styles.buttonText}>Täytä Työturvallisuuslomake</Text>
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
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: '#e1e4e8',
    padding: 10,
  },
})

export default RiskFormButton;