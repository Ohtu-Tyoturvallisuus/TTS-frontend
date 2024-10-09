import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const DropdownOptions = ({ options=[], onSelect, placeholderText='Valitse' }) => {
  return (
      <SelectDropdown
        data={options}
        onSelect={(selectedItem) => {
          onSelect(selectedItem);
        }}
        renderButton={(selectedItem) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>{selectedItem || placeholderText}</Text>
              <View style={{ position: 'absolute', right: 20 }}>
                <Text>▼</Text>
              </View>
            </View>
          );
        }}
        renderItem={(item, isSelected) => {
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
  dropdown1ItemTxtStyle: {
    color: '#000000',
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  dropdown1MenuStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minHeight: 420,
  },
  dropdown1SearchInputStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  dropdownButtonStyle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000', // Added border color
    borderRadius: 12,
    borderWidth: 1, // Added border width
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    width: 350,
  },
  dropdownButtonTxtStyle: {
    color: '#151E26',
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DropdownOptions;
