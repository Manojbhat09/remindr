import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  it('renders the sidebar with navigation links', () => {
    const handleNavigate = jest.fn();
    render(<Sidebar onNavigate={handleNavigate} />);

    expect(screen.getByText('Remindr')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Eisenhower Matrix')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('calls the onNavigate callback when a link is clicked', () => {
    const handleNavigate = jest.fn();
    render(<Sidebar onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('Calendar'));
    expect(handleNavigate).toHaveBeenCalledWith('Calendar');

    fireEvent.click(screen.getByText('Goals'));
    expect(handleNavigate).toHaveBeenCalledWith('Goals');
  });
});
