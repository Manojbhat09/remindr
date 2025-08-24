import React, { useState } from 'react';
import { Task } from '../App';

interface QuickAddFormProps {
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'subtasks' | 'goalId'>) => void;
  onClose: () => void;
}

const QuickAddForm: React.FC<QuickAddFormProps> = ({ onSave, onClose }) => {
  // Get tomorrow's date at the same time
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 1,
    priority: 'medium' as Task['priority'],
    complexity: 'moderate' as Task['complexity'],
    targetDate: getTomorrowDate(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        duration: formData.duration,
        priority: formData.priority,
        complexity: formData.complexity,
        targetDate: new Date(formData.targetDate),
      });
      setFormData({
        name: '',
        description: '',
        duration: 1,
        priority: 'medium',
        complexity: 'moderate',
        targetDate: getTomorrowDate(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
          Task Name *
        </label>
        <input
          type="text"
          id="taskName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (hours)
          </label>
          <input
            type="number"
            id="duration"
            min="0.5"
            step="0.5"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
            Target Date
          </label>
          <input
            type="datetime-local"
            id="targetDate"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label htmlFor="complexity" className="block text-sm font-medium text-gray-700">
            Complexity
          </label>
          <select
            id="complexity"
            value={formData.complexity}
            onChange={(e) => setFormData({ ...formData, complexity: e.target.value as Task['complexity'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="simple">Simple</option>
            <option value="moderate">Moderate</option>
            <option value="complex">Complex</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Task
        </button>
      </div>
    </form>
  );
};

export default QuickAddForm;
