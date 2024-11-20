import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { NavigationContext, NavigationProvider } from '@contexts/NavigationContext';

describe('NavigationProvider', () => {
  it('renders children and provides default context values', () => {
    const TestComponent = () => {
      const { currentLocation } = React.useContext(NavigationContext);
      return <Text testID="location-text">{currentLocation || 'No location set'}</Text>;
    };

    const { getByTestId } = render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(getByTestId('location-text').props.children).toBe('No location set');
  });

  it('updates currentLocation when setCurrentLocation is called', () => {
    const TestComponent = () => {
      const { currentLocation, setCurrentLocation } = React.useContext(NavigationContext);
      return (
        <>
          <Text testID="location-text">{currentLocation || 'No location set'}</Text>
          <Button
            testID="update-location-button"
            title="Update Location"
            onPress={() => setCurrentLocation('New Location')}
          />
        </>
      );
    };

    const { getByTestId } = render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    const locationText = getByTestId('location-text');
    const updateButton = getByTestId('update-location-button');

    expect(locationText.props.children).toBe('No location set');

    fireEvent.press(updateButton);

    expect(locationText.props.children).toBe('New Location');
  });

  it('passes values correctly to child components', () => {
    const TestComponent = () => {
      const { currentLocation } = React.useContext(NavigationContext);
      return <Text testID="child-location-text">{currentLocation || 'Default Location'}</Text>;
    };

    const { getByTestId } = render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(getByTestId('child-location-text').props.children).toBe('Default Location');
  });
});
