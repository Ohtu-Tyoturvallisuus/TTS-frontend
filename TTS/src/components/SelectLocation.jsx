import Constants from 'expo-constants';
import useFetchWorksites from '../hooks/useFetchWorksites';
import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'

const SelectLocation = ( {setFilter}) => {
  const local_ip = Constants.expoConfig.extra.local_ip
  const worksites = useFetchWorksites(local_ip);
  const locations = [...new Set(worksites.map(worksite => worksite.location))].sort((a, b) => a.localeCompare(b));
  locations.unshift('Näytä kaikki');

  return (
    <View style={styles.container}>
      <SelectDropdown
        data={locations}
        onSelect={(selectedItem, index) => {
          setFilter(selectedItem);
        }}
        renderButton={(selectedItem, isOpen) => {
            return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>{selectedItem || 'Valitse kaupunki'}</Text>
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
        showsVerticalScrollIndicator={false}
        search
        searchInputStyle={styles.dropdown1SearchInputStyle}
        searchInputTxtColor={'#000000'} // Changed text color to black
        searchPlaceHolder={'Etsi...'}
        searchPlaceHolderColor={'#A9A9A9'} // Changed placeholder color to a darker shade
        renderSearchInputLeftIcon={() => {
          return <Text style={{ color: '#000000', fontSize: 18 }}>🔍</Text>; // Changed icon color to black
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
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

export default SelectLocation;

