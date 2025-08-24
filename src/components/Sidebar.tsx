import React from 'react';
import TaskList from './TaskList';
import { Task, Goal } from '../App';

interface SidebarProps {
  onNavigate: (view: string) => void;
  tasks: Task[];
  goals: Goal[];
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, tasks, goals }) => {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Remindr</h1>
      </div>
      <nav className="mt-4">
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => onNavigate('Dashboard')}>Dashboard</a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => onNavigate('Calendar')}>Calendar</a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => onNavigate('Eisenhower Matrix')}>Eisenhower Matrix</a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => onNavigate('Goals')}>Goals</a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => onNavigate('Notes')}>Notes</a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => onNavigate('Task Breakdown')}>Task Breakdown</a>
        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={() => onNavigate('Reviews')}>Reviews</a>
      </nav>
      <div className="mt-6 px-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Active Tasks:</span>
            <span className="font-medium">{tasks.filter(t => t.status !== 'completed').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Goals:</span>
            <span className="font-medium">{goals.filter(g => g.status === 'active').length}</span>
          </div>
        </div>
      </div>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Sidebar;
