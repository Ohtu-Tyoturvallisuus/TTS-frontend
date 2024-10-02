import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const DropdownOptions = ({ options=[], onSelect, placeholderText='Valitse' }) => {
  return (
      <SelectDropdown
        data={options}
        onSelect={(selectedItem, index) => {
          onSelect(selectedItem);
        }}
        renderButton={(selectedItem, isOpen) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>{selectedItem || placeholderText}</Text>
              <View style={{ position: 'absolute', right: 20 }}>
                <Text>▼</Text>
              </View>
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdown1ItemStyle,
                ...(isSelected && { backgroundColor: '#ADD8E6' }),
              }}>
              <Text style={styles.dropdown1ItemTxtStyle}>{item}</Text>
            </View>
          );
        }}
        dropdownStyle={styles.dropdown1MenuStyle}
        showsVerticalScrollIndicator={true}
        search
        searchInputStyle={styles.dropdown1SearchInputStyle}
        searchInputTxtColor={'#000000'} // Changed text color to black
        searchPlaceHolder={'Etsi...'}
        searchPlaceHolderColor={'#A9A9A9'} // Changed placeholder color to a darker shade
        renderSearchInputLeftIcon={() => {
          return <Text style={{ color: '#000000', fontSize: 18 }}>🔍</Text>; // Changed icon color to black
        }}
      />
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 350,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1, // Added border width
    borderColor: '#000000', // Added border color
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdown1MenuStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minHeight: 420,
  },
  dropdown1SearchInputStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  dropdown1ItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
  },
  dropdown1ItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
});

export default DropdownOptions;
