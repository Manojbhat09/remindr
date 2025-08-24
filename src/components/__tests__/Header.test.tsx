import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('renders the header with the correct title', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the Quick Add button', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByText('Quick Add')).toBeInTheDocument();
  });
});
