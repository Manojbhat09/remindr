import React, { useState } from 'react';
import KeepGoalImporter from './KeepGoalImporter';
import { Goal, Task } from '../App';

interface GoalsDashboardProps {
  goals: Goal[];
  tasks: Task[];
  onUpdateGoal: (goalId: number, updates: Partial<Goal>) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'progress' | 'status' | 'tasks'>) => void;
}

interface GoalFormData {
  title: string;
  description: string;
  targetDate: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

const GoalsDashboard: React.FC<GoalsDashboardProps> = ({ goals, tasks, onUpdateGoal, onAddGoal }) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isImportingFromKeep, setIsImportingFromKeep] = useState(false);
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    targetDate: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
  });

  const handleImportFromKeep = () => {
    setIsImportingFromKeep(true);
  };

  const handleGoalsImported = (importedGoals: Omit<Goal, 'id' | 'progress' | 'status' | 'tasks'>[]) => {
    importedGoals.forEach(goal => onAddGoal(goal));
    setIsImportingFromKeep(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal({
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
    setIsAddingGoal(false);
  };

  const getDaysUntilTarget = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
              <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Goals Dashboard</h2>
            <p className="text-gray-600">Track your SMART goals and measure progress</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleImportFromKeep}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>📝</span>
              Import from Keep
            </button>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Goal
            </button>
          </div>
        </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{goal.title}</h3>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    getDaysUntilTarget(goal.targetDate) < 0 ? 'bg-red-100 text-red-700' :
                    getDaysUntilTarget(goal.targetDate) <= 7 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {getDaysUntilTarget(goal.targetDate) < 0 ? 
                      `${Math.abs(getDaysUntilTarget(goal.targetDate))} days overdue` :
                      `${getDaysUntilTarget(goal.targetDate)} days left`
                    }
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getProgressColor(goal.progress)}`}>
                  {goal.progress}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>

            {/* SMART Criteria */}
            <div className="space-y-2 mb-4">
              <h4 className="font-medium text-gray-700">SMART Criteria:</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div><span className="font-medium text-blue-600">S:</span> {goal.smartCriteria.specific}</div>
                <div><span className="font-medium text-green-600">M:</span> {goal.smartCriteria.measurable}</div>
                <div><span className="font-medium text-yellow-600">A:</span> {goal.smartCriteria.achievable}</div>
                <div><span className="font-medium text-purple-600">R:</span> {goal.smartCriteria.relevant}</div>
                <div><span className="font-medium text-red-600">T:</span> {goal.smartCriteria.timeBound}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onUpdateGoal(goal.id, { progress: Math.min(goal.progress + 10, 100) })}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Update Progress
              </button>
              <button
                onClick={() => onUpdateGoal(goal.id, { status: goal.status === 'active' ? 'paused' : 'active' })}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {goal.status === 'active' ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Create New SMART Goal</h3>
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
                  onClick={() => setIsAddingGoal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import from Google Keep Modal */}
      {isImportingFromKeep && (
        <KeepGoalImporter
          onImport={handleGoalsImported}
          onClose={() => setIsImportingFromKeep(false)}
        />
      )}
    </div>
  );
};

export default GoalsDashboard; 