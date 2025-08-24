import React, { useState } from 'react';
import { Review } from '../App';

interface ReviewFormProps {
  onSave: (review: Omit<Review, 'id' | 'date'>) => void;
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'daily' as 'daily' | 'weekly' | 'monthly',
    accomplishments: [''],
    challenges: [''],
    improvements: [''],
    nextActions: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: formData.type,
      accomplishments: formData.accomplishments.filter(item => item.trim() !== ''),
      challenges: formData.challenges.filter(item => item.trim() !== ''),
      improvements: formData.improvements.filter(item => item.trim() !== ''),
      nextActions: formData.nextActions.filter(item => item.trim() !== ''),
    });
    setFormData({
      type: 'daily',
      accomplishments: [''],
      challenges: [''],
      improvements: [''],
      nextActions: [''],
    });
  };

  const addField = (field: keyof Omit<typeof formData, 'type'>) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const updateField = (field: keyof Omit<typeof formData, 'type'>, index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const removeField = (field: keyof Omit<typeof formData, 'type'>, index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: newArray,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Review Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'daily' | 'weekly' | 'monthly' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily Review</option>
          <option value="weekly">Weekly Review</option>
          <option value="monthly">Monthly Review</option>
        </select>
      </div>

      {/* Accomplishments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-green-700">Accomplishments</label>
          <button
            type="button"
            onClick={() => addField('accomplishments')}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            + Add
          </button>
        </div>
        {formData.accomplishments.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateField('accomplishments', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="What did you accomplish today?"
            />
            <button
              type="button"
              onClick={() => removeField('accomplishments', index)}
              className="text-red-500 hover:text-red-700 px-2 py-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-red-700">Challenges</label>
          <button
            type="button"
            onClick={() => addField('challenges')}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            + Add
          </button>
        </div>
        {formData.challenges.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateField('challenges', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="What challenges did you face?"
            />
            <button
              type="button"
              onClick={() => removeField('challenges', index)}
              className="text-red-500 hover:text-red-700 px-2 py-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Improvements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-blue-700">Areas for Improvement</label>
          <button
            type="button"
            onClick={() => addField('improvements')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add
          </button>
        </div>
        {formData.improvements.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateField('improvements', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What could you improve?"
            />
            <button
              type="button"
              onClick={() => removeField('improvements', index)}
              className="text-red-500 hover:text-red-700 px-2 py-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Next Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-purple-700">Next Actions</label>
          <button
            type="button"
            onClick={() => addField('nextActions')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            + Add
          </button>
        </div>
        {formData.nextActions.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateField('nextActions', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="What will you do next?"
            />
            <button
              type="button"
              onClick={() => removeField('nextActions', index)}
              className="text-red-500 hover:text-red-700 px-2 py-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Review
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

export default ReviewForm;
