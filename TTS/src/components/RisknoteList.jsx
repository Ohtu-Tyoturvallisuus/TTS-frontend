import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RiskNote = ({ note }) => {
  return (
    <View style={styles.noteContainer}>
      <Text style={styles.noteTitle}>{note.title}</Text>
      <Text>{note.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default RiskNote;