  import React, { useState, useEffect } from 'react';
  import { View, Text, Button, StyleSheet } from 'react-native';
  import ButtonGroup from './ButtonGroup';

  const RiskNote = ({ risk, onChange }) => {  
    return (
      <View>
        <Text style={styles.riskNote}>{risk.note}</Text>
        <ButtonGroup options={['Kunnossa', 'Ei koske']} onChange={(value) => onChange(risk.note, value)} />
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

