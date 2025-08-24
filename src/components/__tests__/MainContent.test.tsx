import React from 'react';
import { render, screen } from '@testing-library/react';
import MainContent from '../MainContent';

describe('MainContent', () => {
  it('renders the dashboard view by default', () => {
    render(<MainContent view="Dashboard" />);
    expect(screen.getByText('Task Overview')).toBeInTheDocument();
    expect(screen.getByText('Calendar/Time Block')).toBeInTheDocument();
    expect(screen.getByText('Pomodoro Panel')).toBeInTheDocument();
  });

  it('renders the calendar view', () => {
    render(<MainContent view="Calendar" />);
    expect(screen.getByText('Calendar View')).toBeInTheDocument();
  });

  it('renders the Eisenhower Matrix view', () => {
    render(<MainContent view="Eisenhower Matrix" />);
    expect(screen.getByText('Eisenhower Matrix View')).toBeInTheDocument();
  });

  it('renders the goals view', () => {
    render(<MainContent view="Goals" />);
    expect(screen.getByText('Goals View')).toBeInTheDocument();
  });
});
