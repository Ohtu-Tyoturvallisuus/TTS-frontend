  import React from 'react';
  import { View, Text, StyleSheet } from 'react-native';
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
      alignSelf: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 8
    },
  });

  export default RiskNote;

