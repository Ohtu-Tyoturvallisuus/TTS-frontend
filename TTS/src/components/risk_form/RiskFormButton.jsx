import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';

const RiskFormButton = ({ title, worksite }) => {
  const navigate = useNavigate()

  return (
    <TouchableOpacity 
    style={styles.button}
    onPress={() => navigate('worksafetyform')}
    >
      <Text style={styles.buttonText}>Täytä Työturvallisuuslomake</Text>
    </TouchableOpacity>
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
})

export default RiskFormButton;