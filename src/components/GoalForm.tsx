import React, { useState } from 'react';
import { Goal } from '../App';

interface GoalFormProps {
  onSave: (goal: Omit<Goal, 'id' | 'progress' | 'status' | 'tasks'>) => void;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      description: formData.description,
      targetDate: new Date(formData.targetDate),
      smartCriteria: {
        specific: formData.specific,
        measurable: formData.measurable,
        achievable: formData.achievable,
        relevant: formData.relevant,
        timeBound: formData.timeBound,
      },
    });
    setFormData({
      title: '',
      description: '',
      targetDate: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
        <input
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-600 mb-2">Specific</label>
          <input
            type="text"
            value={formData.specific}
            onChange={(e) => setFormData({ ...formData, specific: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What exactly do you want to achieve?"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-600 mb-2">Measurable</label>
          <input
            type="text"
            value={formData.measurable}
            onChange={(e) => setFormData({ ...formData, measurable: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How will you measure success?"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-yellow-600 mb-2">Achievable</label>
          <input
            type="text"
            value={formData.achievable}
            onChange={(e) => setFormData({ ...formData, achievable: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Is this goal realistic?"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-purple-600 mb-2">Relevant</label>
          <input
            type="text"
            value={formData.relevant}
            onChange={(e) => setFormData({ ...formData, relevant: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Why is this goal important?"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-red-600 mb-2">Time-Bound</label>
        <input
          type="text"
          value={formData.timeBound}
          onChange={(e) => setFormData({ ...formData, timeBound: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What's your timeline?"
          required
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Goal
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
