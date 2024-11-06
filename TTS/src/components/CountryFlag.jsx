import React from 'react';
import OriginalCountryFlag from 'react-native-country-flag';

const CountryFlag = ({ isoCode, size }) => {
  return (
    <OriginalCountryFlag
      isoCode={isoCode}
      size={size}
      style={{ borderColor: '#c5c6c8', borderWidth: 1, borderRadius: 3 }}
    />
  );
};

export default CountryFlag;