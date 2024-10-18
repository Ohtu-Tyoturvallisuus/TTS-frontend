import { Pressable, Text, StyleSheet } from 'react-native';
import { Link } from "react-router-native";

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

const AppBarTab = ({ text, to }) => {
  return (
    <Link to={to} component={Pressable} style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </Link>
  );
}

export default AppBarTab;