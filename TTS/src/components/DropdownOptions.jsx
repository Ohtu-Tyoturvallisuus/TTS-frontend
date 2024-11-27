import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useTranslation } from 'react-i18next';

const DropdownOptions = ({ options = [], onSelect, placeholderText }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();

  const handleClear = () => {
    setSelectedItem(null);
    onSelect(null);
  };

  return (
    <SelectDropdown
      data={options}
      onSelect={(item) => {
        setSelectedItem(item);
        onSelect(item);
      }}
      defaultButtonText={placeholderText}
      buttonTextAfterSelection={() => selectedItem || placeholderText}
      renderButton={(selectedItem) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text className="text-gray-800 flex-1 text-lg font-medium text-center">
              {selectedItem || placeholderText}
            </Text>
            {selectedItem ? (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            ) : (
              <View className="absolute right-5">
                <Text>▼</Text>
              </View>
            )}
          </View>
        );
      }}
      renderItem={(item) => {
        if (!item || !Array.isArray(item) || item.length < 2) {
          return null; // Handle malformed item
        }
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
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
      searchPlaceHolder={t('dropdownoptions.search')}
      searchPlaceHolderColor={'#A9A9A9'}
      renderSearchInputLeftIcon={() => {
        return <Text className="text-lg">🔍</Text>;
      }}
    />
  );
};

const styles = StyleSheet.create({
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 36,
    fontWeight: 'bold',
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
    width: '100%',
  },
  dropdownItemStyle: {
    alignItems: 'center',
    borderBottomColor: '#D1D1D1',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: '100%',
  }
});

export default DropdownOptions;
