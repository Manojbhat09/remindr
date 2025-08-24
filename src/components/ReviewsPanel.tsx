import React, { useState } from 'react';
import { Review } from '../App';

interface ReviewsPanelProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id'>) => void;
}

interface ReviewFormData {
  type: 'daily' | 'weekly' | 'monthly';
  accomplishments: string[];
  challenges: string[];
  improvements: string[];
  nextActions: string[];
}

const ReviewsPanel: React.FC<ReviewsPanelProps> = ({ reviews, onAddReview }) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    type: 'daily',
    accomplishments: [''],
    challenges: [''],
    improvements: [''],
    nextActions: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview({
      date: new Date(),
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
    setIsAddingReview(false);
  };

  const addField = (field: keyof Omit<ReviewFormData, 'type'>) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const updateField = (field: keyof Omit<ReviewFormData, 'type'>, index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const removeField = (field: keyof Omit<ReviewFormData, 'type'>, index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: newArray,
      });
    }
  };

  const getReviewIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'monthly': return '🎯';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Review & Reflection</h2>
          <p className="text-gray-600">Track your progress and plan for improvement</p>
        </div>
        <button
          onClick={() => setIsAddingReview(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getReviewIcon(review.type)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">
                    {review.type} Review
                  </h3>
                  <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(review.type)}`}>
                {review.type}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-3 flex items-center">
                  <span className="mr-2">✅</span> Accomplishments
                </h4>
                <ul className="space-y-2">
                  {review.accomplishments.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-3 flex items-center">
                  <span className="mr-2">⚠️</span> Challenges
                </h4>
                <ul className="space-y-2">
                  {review.challenges.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-700 mb-3 flex items-center">
                  <span className="mr-2">💡</span> Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {review.improvements.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-3 flex items-center">
                  <span className="mr-2">🎯</span> Next Actions
                </h4>
                <ul className="space-y-2">
                  {review.nextActions.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-purple-50 p-2 rounded">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isAddingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Create New Review</h3>
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
                  onClick={() => setIsAddingReview(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPanel; 