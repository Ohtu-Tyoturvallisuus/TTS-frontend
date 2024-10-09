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
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 10,
  },
  riskDate: {
    color: '#555',
    fontSize: 12,
  },
  riskInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  riskNote: {
    fontWeight: 'bold',
  },
});

export default RiskList;