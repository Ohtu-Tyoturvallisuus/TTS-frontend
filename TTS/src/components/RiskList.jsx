// RiskList.jsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';


const RiskList = ({ risks }) => {
  const renderRisk = ({ item }) => (
      <View style={styles.riskContainer}>
        <View style={styles.riskInfo}>
          <Text style={styles.riskNote}>{item.note}</Text>
          <Text style={styles.riskDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
  );

  return (
    <FlatList
      data={risks}
      renderItem={renderRisk}
      keyExtractor={risk => risk.id.toString()}
    />
  );
};
const styles = StyleSheet.create({
  riskContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  riskNote: {
    fontWeight: 'bold',
  },
  riskDate: {
    fontSize: 12,
    color: '#555',
  },
});

export default RiskList;