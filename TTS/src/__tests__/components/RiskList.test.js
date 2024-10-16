import React from 'react';
import { render } from '@testing-library/react-native';
import RiskList from '../../components/RiskList';

describe('RiskList', () => {
  const risksMock = [
    {
      id: 1,
      note: 'Risk of slipping on wet floors',
    },
  ];

  it('renders a list of risks correctly', () => {
  const { getByText } = render(<RiskList risks={risksMock} />);

  expect(getByText('Risk of slipping on wet floors')).toBeTruthy();
});
});
