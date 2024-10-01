  import React, { useState, useEffect } from 'react';
  import { View, Text, Button, StyleSheet } from 'react-native';

  const RiskNote = ({ risk, data, onChange }) => {
    const renderButtonGroup = (name) => (
      <View style={styles.buttonGroup}>
        <Button
          title="Kunnossa"
          onPress={() => {
            const newValue = data === 'Kunnossa' ? '' : 'Kunnossa';
            onChange(name, newValue);
          }}
          color={data === 'Kunnossa' ? 'blue' : 'gray'}
        />
        <Button
          title="Ei koske"
          onPress={() => {
            const newValue = data === 'Ei koske' ? '' : 'Ei koske';
            onChange(name, newValue);
          }}
          color={data === 'Ei koske' ? 'blue' : 'gray'}
        />
      </View>
    );
  
    return (
      <View>
        <Text style={styles.riskNote}>{risk.note}</Text>
        {renderButtonGroup(risk.note)}
      </View>
    );
  };

  const styles = StyleSheet.create({
    riskNote: {
      fontSize: 16,
      marginVertical: 8,
      fontWeight: 'bold',
      alignSelf: 'center'
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
  });

  export default RiskNote;

