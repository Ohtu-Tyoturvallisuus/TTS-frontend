import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const DropdownOptions = ({ options = [], onSelect, placeholderText = 'Valitse' }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <SelectDropdown
      data={options}
      onSelect={(item) => {
        setSelectedItem(item);
        item[0] === '--Valitse kaikki--'
          ? onSelect(null)
          : onSelect(item);
      }}
      defaultButtonText={placeholderText}
      buttonTextAfterSelection={(item) => item}
      renderButton={(selectedItem) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text className="text-gray-800 flex-1 text-lg font-medium text-center">
              {selectedItem || placeholderText}
            </Text>
            <View className="absolute right-5">
              <Text>▼</Text>
            </View>
          </View>
        );
      }}
      renderItem={(item) => {
        return (
          <View
            style={{
              ...styles.dropdown1ItemStyle,
              ...(selectedItem === item && { backgroundColor: '#ADD8E6' }),
            }}
          >
            <Text className="flex-1 text-lg font-medium">{item[0]}, {item[1]}</Text>
          </View>
        );
      }}
      dropdownStyle={{ backgroundColor: '#FFFFFF', borderRadius: 8, minHeight: 420 }}
      showsVerticalScrollIndicator={true}
      search
      searchInputStyle={{ backgroundColor: '#FFFFFF', borderBottomColor: '#000000', borderBottomWidth: 1 }}
      searchInputTxtColor={'#000000'}
      searchPlaceHolder={'Etsi...'}
      searchPlaceHolderColor={'#A9A9A9'}
      renderSearchInputLeftIcon={() => {
        return <Text className="text-lg">🔍</Text>;
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown1ItemStyle: {
    alignItems: 'center',
    borderBottomColor: '#D1D1D1',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: '100%',
  },
  dropdownButtonStyle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    width: 350,
  },
});

export default DropdownOptions;