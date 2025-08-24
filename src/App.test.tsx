import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('opens the Quick Add modal when the button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Quick Add'));
    expect(screen.getByText('Quick Add Task')).toBeInTheDocument();
  });

  it('adds a new task and displays it on the dashboard', () => {
    render(<App />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Quick Add'));

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Task Name'), { target: { value: 'My new task' } });
    fireEvent.click(screen.getByText('Save'));

    // Check that the task is displayed
    expect(screen.getByText('My new task')).toBeInTheDocument();
  });
});