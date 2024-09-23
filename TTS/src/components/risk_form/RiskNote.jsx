  import React, { useState } from 'react';
  import { View, Text, Button, StyleSheet } from 'react-native';

  const RiskNote = ({ risk, data, onChange }) => {
    const [value, setValue] = useState(data);

    const renderButtonGroup = (name) => (
      <View style={styles.buttonGroup}>
        <Button
          title="Kunnossa"
          onPress={() => {
            const newValue = value === 'Kunnossa' ? '' : 'Kunnossa';
            setValue(newValue);
            onChange(name, newValue);
          }}
          color={value === 'Kunnossa' ? 'blue' : 'gray'}
        />
        <Button
          title="Ei koske"
          onPress={() => {
            const newValue = value === 'Ei koske' ? '' : 'Ei koske';
            setValue(newValue);
            onChange(name, newValue);
          }}
          color={value === 'Ei koske' ? 'blue' : 'gray'}
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
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
  });

  export default RiskNote;

