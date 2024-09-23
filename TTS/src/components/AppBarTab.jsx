import { Pressable, Text, StyleSheet } from 'react-native';
import { Link } from "react-router-native";

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '700',
  },
  button: {
    borderRadius: 10,
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