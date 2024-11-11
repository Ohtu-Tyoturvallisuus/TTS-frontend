import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Image from '@components/take-picture/Image';

jest.mock('react-native-image-zoom-viewer', () => {
  const MockImageViewer = ({ imageUrls, index, onClick }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onClick}>
        <Text>Mock ImageViewer</Text>
        <Text>{imageUrls[index].url}</Text>
      </TouchableOpacity>
    );
  };
  MockImageViewer.displayName = 'MockImageViewer';
  return MockImageViewer;
});

describe('Image Component', () => {
  const mockImages = [
    { uri: 'http://example.com/image1.jpg' },
    { uri: 'http://example.com/image2.jpg' },
  ];

  it('renders the image correctly', () => {
    const { getByTestId } = render(<Image images={mockImages} currentIndex={0} />);
    const image = getByTestId('risk-image-0');
    
    expect(image.props.source.uri).toBe(mockImages[0].uri);
  });

  it('toggles the enlargement of the image on press', () => {
    const { getByTestId, getByText, queryByText } = render(<Image images={mockImages} currentIndex={0} />);

    expect(queryByText('Mock ImageViewer')).toBeNull();

    fireEvent.press(getByTestId('risk-image-0'));
    expect(getByText('Mock ImageViewer')).toBeTruthy();

    fireEvent.press(getByText('Mock ImageViewer'));
    expect(queryByText('Mock ImageViewer')).toBeNull();
  });

  it('calls onRemove when remove button is pressed', () => {
    const mockOnRemove = jest.fn();
    const { getByText } = render(<Image images={mockImages} currentIndex={0} onRemove={mockOnRemove} />);
    
    fireEvent.press(getByText('X'));
    expect(mockOnRemove).toHaveBeenCalledWith(mockImages[0].uri);
  });

  it('does not render the remove button if onRemove is not provided', () => {
    const { queryByText } = render(<Image images={mockImages} currentIndex={0} />);
    
    expect(queryByText('X')).toBeNull();
  });

  it('applies the correct styles for landscape images', () => {
    const { getByTestId } = render(<Image images={mockImages} currentIndex={0} isLandscape={true} />);
    const image = getByTestId('risk-image-0');
    
    expect(image.props.style).toEqual(expect.objectContaining({
      borderRadius: 4,
      height: 93.75,
      width: 125,
    }));
  });

  it('applies the correct styles for portrait images', () => {
    const { getByTestId } = render(<Image images={mockImages} currentIndex={0} isLandscape={false} />);
    const image = getByTestId('risk-image-0');
    
    expect(image.props.style).toEqual(expect.objectContaining({
      borderRadius: 4,
      height: 125,
      width: 93.75,
    }));
  });
});
